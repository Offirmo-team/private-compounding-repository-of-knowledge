#!/usr/bin/env node
//MISE description="serves the repo's docs/ folder as GitHub Pages would: under /<repo-name>/"

console.log(`Executing task ${(process.env.MISE_TASK_NAME ?? "serve").replace(/\.js$/, "")}...`)

/////////////////////////////////////////////////

const PORT = Number(process.argv[2] ?? process.env.PORT ?? 8080)

/// GitHub Pages serves a project site under the repo name, ex. https://<owner>.github.io/<repo>/
/// Reproducing that prefix locally is the whole point of this task:
/// it's what catches assets referenced with a root-absolute path.
const { SERVED_DIR, BASE_PATH } = (() => {
	const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim()
	const repo_root = git("rev-parse", "--show-toplevel")
	const repo_name = git("remote", "get-url", "origin")
		.replace(/\/$/, "")
		.replace(/\.git$/, "")
		.split("/")
		.at(-1)

	assert.ok(repo_name, "serve: should infer the repo name from the 'origin' remote!")

	return { SERVED_DIR: join(repo_root, "docs"), BASE_PATH: `/${repo_name}/` }
})()

createServer((request, response) => {
	log_when_responded(request, response)

	const { pathname } = new URL(request.url, "http://localhost")

	if (pathname === DEVTOOLS_WORKSPACE_PATH) return serve_devtools_workspace(response)

	if (pathname === "/" || `${pathname}/` === BASE_PATH) return redirect_to(response, BASE_PATH)

	/// Outside the project site: GitHub would answer with its own generic 404, NOT our docs/404.html
	if (!pathname.startsWith(BASE_PATH)) return respond_plain(response, 404, `404 Not Found (outside of ${BASE_PATH})`)

	const file_path = resolve_served_file(decodeURIComponent(pathname.slice(BASE_PATH.length)))

	if (!file_path) return serve_not_found(response)

	serve_file(response, file_path, 200)
}).listen(PORT, () => {
	const url = `http://localhost:${PORT}${BASE_PATH}`

	console.log(`↳ serving ${SERVED_DIR}`)
	console.log(`↳ ${colorize(["bold", "underline"], url)}`)

	if (process.env.NO_OPEN) return

	open_in_default_browser(url)
})

/////////////////////////////////////////////////

function resolve_served_file(relative_path) {
	const candidate = resolve(SERVED_DIR, relative_path)

	if (candidate !== SERVED_DIR && !candidate.startsWith(SERVED_DIR + sep)) return undefined

	const stats = stat_or_undefined(candidate)

	if (!stats) return undefined
	if (stats.isFile()) return candidate
	if (!stats.isDirectory()) return undefined

	const index_path = join(candidate, "index.html")

	return stat_or_undefined(index_path)?.isFile() ? index_path : undefined
}

function serve_not_found(response) {
	const custom_404_path = join(SERVED_DIR, "404.html")

	if (!stat_or_undefined(custom_404_path)?.isFile()) return respond_plain(response, 404, "404 Not Found")

	serve_file(response, custom_404_path, 404)
}

function respond_plain(response, status_code, body) {
	response.writeHead(status_code, { "content-type": "text/plain; charset=utf-8" })
	response.end(body)
}

function serve_file(response, file_path, status_code) {
	response.writeHead(status_code, { "content-type": content_type_of(file_path) })
	createReadStream(file_path)
		/// the status is already on the wire, so all we can do is report it and hang up
		.on("error", (err) => {
			console.log(colorize("red", `↳ failed to read ${file_path} (${err.code ?? err.message})`))
			response.end()
		})
		.pipe(response)
}

function redirect_to(response, location) {
	response.writeHead(302, { location })
	response.end()
}

/// `throwIfNoEntry: false` covers both ENOENT and ENOTDIR, ex. docs/robots.txt/nope
function stat_or_undefined(path) {
	return statSync(path, { throwIfNoEntry: false })
}

function content_type_of(file_path) {
	return CONTENT_TYPE_BY_EXTENSION[extname(file_path).toLowerCase()] ?? "application/octet-stream"
}

const CONTENT_TYPE_BY_EXTENSION = {
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".ico": "image/x-icon",
	".jpg": "image/jpeg",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".map": "application/json; charset=utf-8",
	".png": "image/png",
	".svg": "image/svg+xml",
	".txt": "text/plain; charset=utf-8",
	".webmanifest": "application/manifest+json",
	".webp": "image/webp",
	".woff2": "font/woff2",
}

/////////////////////////////////////////////////

/// Chrome DevTools >= M135 auto-attaches a workspace folder when a localhost origin serves this,
/// which makes the served files editable straight from the Sources panel:
/// https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/automatic_workspace_folders.md
/// NOTE: a deliberate deviation from GitHub Pages (which 404s here), but only Chrome ever asks for it
const DEVTOOLS_WORKSPACE_PATH = "/.well-known/appspecific/com.chrome.devtools.json"

function serve_devtools_workspace(response) {
	response.writeHead(200, { "content-type": "application/json; charset=utf-8" })
	response.end(JSON.stringify({ workspace: { root: SERVED_DIR, uuid: DEVTOOLS_WORKSPACE_UUID } }))
}

/// DevTools wants this uuid stable across runs, so we derive it from the folder instead of persisting state
const DEVTOOLS_WORKSPACE_UUID = (() => {
	const nibbles = [...createHash("sha256").update(SERVED_DIR).digest("hex").slice(0, 32)]

	nibbles[12] = "4" /// version
	nibbles[16] = "89ab"[parseInt(nibbles[16], 16) % 4] /// variant

	const hex = nibbles.join("")
	const uuid = [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-")

	assert.match(
		uuid,
		/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/,
		"serve: should derive a valid v4 uuid!",
	)

	return uuid
})()

/////////////////////////////////////////////////

/// "finish" is the single choke point every response goes through, whatever the outcome
function log_when_responded(request, response) {
	response.on("finish", () => {
		const { statusCode } = response

		console.log(
			`↳ ${colorize(color_of_status(statusCode), String(statusCode))} ${colorize("dim", request.method)} ${request.url}`,
		)
	})
}

function color_of_status(status_code) {
	if (status_code >= 500) return "red"
	if (status_code >= 400) return "yellow"
	if (status_code >= 300) return "cyan"

	return "green"
}

/// the "stream" option makes Node strip the colors by itself when piped, or when NO_COLOR is set
function colorize(format, text) {
	return styleText(format, text, { stream: process.stdout })
}

/////////////////////////////////////////////////

function open_in_default_browser(url) {
	const [command, args] =
		process.platform === "darwin"
			? ["open", [url]]
			: process.platform === "win32"
				? ["cmd", ["/c", "start", "", url]]
				: ["xdg-open", [url]]

	/// best effort: a missing opener should not take the server down
	const child = spawn(command, args, { detached: true, stdio: "ignore" })
	child.on("error", (err) => console.log(`↳ could not open a browser (${err.code ?? err.message}), open it yourself!`))
	child.unref()
}

/////////////////////////////////////////////////

import { strict as assert } from "node:assert"
import { execFileSync, spawn } from "node:child_process"
import { createHash } from "node:crypto"
import { createReadStream, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, resolve, sep } from "node:path"
import { styleText } from "node:util"
