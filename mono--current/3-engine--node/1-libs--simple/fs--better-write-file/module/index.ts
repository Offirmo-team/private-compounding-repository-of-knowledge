/////////////////////////////////////////////////

// TODO 1D make it configurable
const PRETTIER_OPTIONS = {
	printWidth: 120,
	tabWidth: 3,
	useTabs: true,
	semi: false,
	singleQuote: true,
	jsxSingleQuote: true,
	quoteProps: "consistent",
	arrowParens: "avoid",
} satisfies Partial<PrettierRequiredOptions>

/////////////////////////////////////////////////

// TODO 1D extend
type Options = Parameters<typeof fs.writeFile>[2]

// Extras:
// - auto-create parent dir
// - auto-format some recognized files
export async function ೱwriteꓽfile(
	file: Parameters<typeof fs.writeFile>[0],
	data: Parameters<typeof fs.writeFile>[1],
	options?: Options,
): ReturnType<typeof fs.writeFile> {
	const file_path = typeof file === "string" ? file : undefined
	const file__ext = typeof file === "string" ? nodeꓽpath.extname(file) : undefined
	let file__content = data

	if (file_path) {
		await fs.mkdir(nodeꓽpath.dirname(file_path), { recursive: true })
	}

	if (
		file__ext &&
		[
			// the stuff we format
			".html",
			".css",
			".json",
			".jsonc",
			".ts",
			// the stuff we sanitize
			".json",
			".jsonc",
			".json5",
			".log",
		].includes(file__ext)
	) {
		// all text files we care about: a Buffer here is utf8 text, decode it once so the
		// formatting + sanitizing below can assume a string.
		// Anything exotic → not expected in this codebase, crash loudly on encountering it
		if (Buffer.isBuffer(file__content)) file__content = file__content.toString("utf8")
		assert(typeof file__content === "string", `data to write "${file_path}" is in an exotic format not yet supported`)
	}

	try {
		switch (file__ext) {
			case ".html":
				assert(typeof file__content === "string", `file "${file_path}" should be a string at this stage`)
				file__content = await formatWithPrettier(file__content, { ...PRETTIER_OPTIONS, parser: "html" })
				break
			case ".css":
				assert(typeof file__content === "string", `file "${file_path}" should be a string at this stage`)
				file__content = await formatWithPrettier(file__content, { ...PRETTIER_OPTIONS, parser: "css" })
				break
			case ".json":
			case ".jsonc":
				assert(typeof file__content === "string", `file "${file_path}" should be a string at this stage`)
				file__content = await formatWithPrettier(file__content, { ...PRETTIER_OPTIONS, parser: "json" })
				break
			case ".ts":
				assert(typeof file__content === "string", `file "${file_path}" should be a string at this stage`)
				file__content = await formatWithPrettier(file__content, { ...PRETTIER_OPTIONS, parser: "typescript" })
				//file__content = await formatWithPrettier(file__content, { ...PRETTIER_OPTIONS, parser: "acorn" })
				break
			default:
				break
		}
	} catch (prettier_err) {
		console.warn(`Error while formatting ${file}`, prettier_err)
		console.error("------\ncontent:\n", file__content, "\n------")
		// swallow the error, write the unchanged content for resilience
	}

	// privacy + avoid undeterministic entropy sources
	if (process.env["HOME"]) {
		if (file__ext && [".json", ".jsonc", ".json5", ".log"].includes(file__ext)) {
			assert(typeof file__content === "string", `file "${file_path}" should be a string at this stage`)
			file__content = file__content.replaceAll(process.env["HOME"], "~")
		}
	}

	return await fs.writeFile(file, file__content, options)
}

/////////////////////////////////////////////////

export interface FilesMap {
	[relpath: PathⳇRelative]: {
		content: string | Buffer
	}
}

// dir must be absolute bc. from where would we resolve it?
export async function ೱwriteꓽfile_map(
	files: Immutable<FilesMap>,
	targetDir: PathⳇAbsolute,
	options: {
		rm?: boolean
	} = {},
): Promise<void> {
	const ǃ = assert_from({ ೱwriteꓽfile_map })

	targetDir = nodeꓽpath.normalize(targetDir)
	ǃ.forⵧparam({ targetDir }).require(
		nodeꓽpath.isAbsolute(targetDir),
		`target dir must be absolute, got "${targetDir}"`,
	)

	if (options.rm) {
		await fs.rm(targetDir, { recursive: true, force: true })
	}

	await Promise.all(
		Object.keys(files)
			.sort()
			.map(async (relpath) => {
				const file__path = nodeꓽpath.join(targetDir, relpath)
				let file__content = files[relpath]!.content
				console.log(`↳ 📄 ${relpath}`)

				return await ೱwriteꓽfile(file__path, file__content).catch((err: any) => {
					console.error(`Error while writing ${file__path}`, err)
					throw err
				})
			}),
	)
}

/////////////////////////////////////////////////

import * as fs from "node:fs/promises"
import * as nodeꓽpath from "node:path"

import { type RequiredOptions as PrettierRequiredOptions, format as formatWithPrettier } from "prettier"

import { assert, assert_from } from "@monorepo-private/assert"
import type { Immutable, PathⳇAbsolute, PathⳇRelative } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////
