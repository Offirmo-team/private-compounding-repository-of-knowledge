/////////////////////////////////////////////////

export function getꓽwebᝍpropertyᝍbundle(spec: Immutable<WebPropertySpec>): WebPropertyBundle {
	const ǃ = assert_from({ getꓽwebᝍpropertyᝍbundle })

	ǃ.forⵧparam({ spec__isꓽcatching_all_routes: spec.isꓽcatching_all_routes }).require(
		!(spec.isꓽcatching_all_routes && spec.host === "github-pages"),
		`GitHub Pages does not support SPA routing — isꓽcatching_all_routes cannot be true with host='github-pages'`,
	)

	const files: FilesMap = {
		...generateꓽhtml(spec),
		...generateꓽicons(spec),
		...generateꓽwell_known(spec),
		...generateꓽmisc_root_files(spec),
		...generateꓽbuild_badges(spec),

		// PWA
		...(needsꓽwebmanifest(spec) && {
			[`${getꓽdirⵧfiles_to_serve(spec)}/${getꓽbasenameⵧwebmanifest(spec)}`]: {
				content: JSON.stringify(generateꓽwebmanifest(spec), undefined, "	"),
			},
		}),

		// JS SRC
		...(shouldꓽgenerateꓽjscode(spec) && generateꓽsource_code(spec)),
	}

	return {
		files,
		meta: {
			serve_me‿relpath: getꓽdirⵧfiles_to_serve(spec),
			spec: spec as WebPropertySpec,
		},
	}
}

/////////////////////////////////////////////////
const PRETTIER_OPTIONS = {
	printWidth: 120,
	tabWidth: 3,
	useTabs: true,
	semi: false,
	singleQuote: true,
	jsxSingleQuote: true,
	quoteProps: "consistent",
	arrowParens: "avoid",
} satisfies Partial<Prettier.RequiredOptions>

// dir must be absolute bc. from where would we resolve it?
export async function writeꓽwebᝍpropertyᝍfiles(
	bundle: Immutable<WebPropertyBundle>,
	targetDir: PathⳇAbsolute,
	options: {
		includesꓽlogs?: boolean
	} = {},
): Promise<Immutable<WebPropertyBundle>> {
	const ǃ = assert_from({ writeꓽwebᝍpropertyᝍfiles })

	targetDir = NodePath.normalize(targetDir)
	console.log(`📁 ${targetDir}`)
	ǃ.forⵧparam({ targetDir }).require(NodePath.isAbsolute(targetDir), `dir must be absolute, got "${targetDir}"`)

	const toserve_inventory = Object.entries(bundle.files).reduce(
		(acc, [path, _]) => {
			if (path.startsWith(bundle.meta.serve_me‿relpath)) {
				const served_path = NodePath.relative(bundle.meta.serve_me‿relpath, path)
				acc[served_path] = {
					// TODO 1D props as needed
				}
			}

			return acc
		},
		{} as Record<PathⳇRelative, {}>,
	)

	const files: FilesMap = {
		...bundle.files,
		...(options.includesꓽlogs && {
			"~~logs/spec.json": { content: JSON.stringify(bundle.meta.spec, undefined, "	") },
		}),
		[NodePath.join(bundle.meta.serve_me‿relpath, "_served_inventory.json")]: {
			content: JSON.stringify(toserve_inventory),
		},
	}

	return Promise.all(
		Object.keys(files)
			.sort()
			.map(async (relpath) => {
				const file__path = NodePath.join(targetDir, relpath)
				let file__content = files[relpath]!.content
				console.log(`↳ 📄 ${relpath}`)

				try {
					switch (NodePath.extname(file__path)) {
						case ".html":
							assert(typeof file__content === "string", `file ${file__path} should be a string!`)
							file__content = await Prettier.format(file__content, { ...PRETTIER_OPTIONS, parser: "html" })
							break
						case ".css":
							assert(typeof file__content === "string", `file ${file__path} should be a string!`)
							file__content = await Prettier.format(file__content, { ...PRETTIER_OPTIONS, parser: "css" })
							break
						case ".json":
						case ".jsonc":
							assert(typeof file__content === "string", `file ${file__path} should be a string!`)
							file__content = await Prettier.format(file__content, { ...PRETTIER_OPTIONS, parser: "json" })
							break
						case ".ts":
							assert(typeof file__content === "string", `file ${file__path} should be a string!`)
							file__content = await Prettier.format(file__content, { ...PRETTIER_OPTIONS, parser: "typescript" })
							//file__content = await Prettier.format(file__content, { ...PRETTIER_OPTIONS, parser: "acorn" })
							break
						default:
							break
					}
				} catch (prettier_err) {
					console.warn(`Error while formatting ${file__path}`, prettier_err)
					console.error("------\ncontent:\n", file__content, "\n------")
					// swallow the error, write the un-minified content for resilience
				}

				// privacy + avoid undeterministic entropy sources
				if (typeof file__content === "string")
					file__content = file__content.replaceAll(process.env["HOME"] ?? "$HOME", "~")

				return await ೱoutputꓽfile(file__path, file__content, {
					...(typeof file__content === "string" && { encoding: "utf8" }),
				}).catch((err: any) => {
					console.error(`Error while writing ${file__path}`, err)
					throw err
				})
			}),
	).then(() => bundle)
}

/////////////////////////////////////////////////

export async function generateꓽwebᝍproperty(
	spec: Immutable<WebPropertySpec>,
	targetDir: PathⳇAbsolute,
	options: {
		rm?: boolean
	} = {},
): Promise<Immutable<WebPropertyBundle>> {
	const entries = getꓽwebᝍpropertyᝍbundle(spec)

	if (options.rm) {
		await fs.rm(targetDir, { recursive: true, force: true })
	}

	return writeꓽwebᝍpropertyᝍfiles(entries, targetDir)
}

/////////////////////////////////////////////////

// content is always a Buffer: lossless for any file type (js, png, webp…) and round-trips
// byte-for-byte through writeꓽwebᝍpropertyᝍfiles, which writes non-string content raw.
export async function loadꓽfiles(serveDir: PathⳇAbsolute): Promise<FilesMap> {
	const ǃ = assert_from({ loadꓽfiles })

	serveDir = NodePath.normalize(serveDir)
	ǃ.forⵧparam({ serveDir }).require(NodePath.isAbsolute(serveDir), `dir must be absolute, got "${serveDir}"`)

	const relpaths = lsFilesRecursiveSync(serveDir, { full_path: false })

	const entries = await Promise.all(
		relpaths.map(async (relpath: PathⳇRelative) => {
			const content = await fs.readFile(NodePath.join(serveDir, relpath))

			return [relpath, { content }] as const
		}),
	)

	return Object.fromEntries(entries)
}

/////////////////////////////////////////////////
import * as fs from "node:fs/promises"
import * as NodePath from "node:path"

import * as Prettier from "prettier"

import { assert_from, assert } from "@monorepo-private/assert"
import { lsFilesRecursiveSync } from "@monorepo-private/fs--ls"
import { ೱoutputꓽfile } from "@monorepo-private/fs--output-file"
import type { Immutable, PathⳇAbsolute, PathⳇRelative } from "@monorepo-private/ts--types"

import generateꓽbuild_badges from "./generate--build-badges/index.ts"
import generateꓽhtml from "./generate--html/index.ts"
import generateꓽicons from "./generate--icons/index.ts"
import generateꓽmisc_root_files from "./generate--misc-root-files/index.ts"
import generateꓽsource_code from "./generate--src/index.ts"
import generateꓽwebmanifest from "./generate--webmanifest/index.ts"
import generateꓽwell_known from "./generate--well-known/index.ts"
import {
	needsꓽwebmanifest,
	getꓽbasenameⵧwebmanifest,
	shouldꓽgenerateꓽjscode,
	getꓽdirⵧfiles_to_serve,
} from "./selectors/index.ts"
import type { FilesMap, WebPropertyBundle, WebPropertySpec } from "./types.ts"
