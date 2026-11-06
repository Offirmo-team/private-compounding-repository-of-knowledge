// TODO 1D follow extends?

/////////////////////////////////////////////////

export async function ↆreadꓽfile(
	file_path: FilePathⳇAny,
	hints?: Partial<{ format: StructuredFileFormat | undefined }>,
): Promise<StructuredContent> {
	const result: StructuredContent = {
		dataⵧraw: "",
		dataⵧjson: {},

		_format: "text",
		_parser: "text",
	}

	const ↆdataⵧraw = _readꓽfileⵧtextⵧraw(file_path)

	const format: StructuredFileFormat | undefined = await (hints?.format ||
		inferꓽformatⵧfrom_path(file_path) ||
		(async () => {
			// load the content and try to recognize it
			switch (true) {
				case (await ↆdataⵧraw).startsWith("{"):
					return "json5"
				case (await ↆdataⵧraw).startsWith("%"):
					return "yaml"
				default:
					break
			}

			return undefined
		})())
	if (!format) {
		throw new Error(`File format not recognized! Please extend this lib or provide a hint! [${file_path}]`)
	}

	result._format = format
	switch (format) {
		case "default-export":
			result.dataⵧjson = await ↆloadꓽfileⵧdefault_export(file_path)
			break
		case "json5":
		case "jsonc":
		case "json":
			result._parser = "json5"
			result.dataⵧjson = await ↆreadꓽfileⵧjson5(file_path, ↆdataⵧraw)
			break
		case "yaml":
			result._parser = "yaml"
			result.dataⵧjson = await ↆreadꓽfileⵧyaml(file_path, ↆdataⵧraw)
			break
		case "toml":
			result._parser = "toml"
			result.dataⵧjson = await ↆreadꓽfileⵧtoml(file_path, ↆdataⵧraw)
			break
		case "list":
			result._parser = "list"
			result.dataⵧjson = await ↆreadꓽfileⵧlist(file_path, ↆdataⵧraw)
			break
		case "single-value":
			result._parser = "single-value"
			result.dataⵧjson = await ↆreadꓽfileⵧsingle_value(file_path, ↆdataⵧraw)
			break
		case "markupⵧmarkdown":
			result._parser = "markupⵧmarkdown"
			result.dataⵧjson = await ↆreadꓽfileⵧmarkdown(file_path, ↆdataⵧraw)
			break
		case "text":
			result._parser = "text"
			result.dataⵧjson = await ↆreadꓽfileⵧtext(file_path, ↆdataⵧraw)
			break

		default:
			throw new Error(`Parser for format "${format}" not implemented!`)
	}

	result.dataⵧraw = await ↆdataⵧraw

	return result
}

/////////////////////////////////////////////////

export { type StructuredFileFormatⳇParser }

/////////////////////////////////////////////////

export async function ↆloadꓽfileⵧdefault_export(file_path: FilePathⳇAny): Promise<ContentⳇDefaultExport> {
	const ೱdata = import(path.resolve(process.cwd(), file_path)).then((x) => x.default as any)
	return await ೱdata
}

export async function ↆreadꓽfileⵧjson5(
	file_path: FilePathⳇAny,
	content_hint?: Promise<string> | string,
): Promise<ContentⳇJson5> {
	const ↆpkgꓽjson5 = ↆimportꓽjson5()
	const ↆcontent‿raw = _readꓽfileⵧtextⵧraw(file_path, content_hint)
	const [JSON5, content] = await Promise.all([ↆpkgꓽjson5, ↆcontent‿raw])
	return JSON5.parse(content) as JsonⳇObject
}

export async function ↆreadꓽfileⵧyaml(
	file_path: FilePathⳇAny,
	content_hint?: Promise<string> | string,
): Promise<ContentⳇYaml> {
	const ↆpkgꓽyaml = ↆimportꓽyaml()
	const ↆcontent‿raw = _readꓽfileⵧtextⵧraw(file_path, content_hint)
	const [yaml, content] = await Promise.all([ↆpkgꓽyaml, ↆcontent‿raw])
	return yaml.parse(content) as JsonⳇObject
}

export async function ↆreadꓽfileⵧtoml(
	file_path: FilePathⳇAny,
	content_hint?: Promise<string> | string,
): Promise<ContentⳇToml> {
	const ↆpkgꓽtoml = ↆimportꓽtoml()
	const ↆcontent‿raw = _readꓽfileⵧtextⵧraw(file_path, content_hint)
	const [toml, content] = await Promise.all([ↆpkgꓽtoml, ↆcontent‿raw])
	// smol-toml yields null-prototype objects + TomlDate instances, which are NOT plain JSON (rejected by merge etc.)
	// => normalizing through JSON, TOML dates becoming ISO strings
	return JSON.parse(JSON.stringify(toml.parse(content))) as JsonⳇObject
}

export async function ↆreadꓽfileⵧlist(
	file_path: FilePathⳇAny,
	content_hint?: Promise<string> | string,
): Promise<ContentⳇList> {
	const ↆcontent‿raw = _readꓽfileⵧtextⵧraw(file_path, content_hint)
	const content = await ↆcontent‿raw
	const lines = split_lines(content)
		.map((l) => l.trim())
		.filter((l) => !l.startsWith("//") && !l.startsWith("#")) // TODO 1D keep comments
	return {
		entries: lines.map((l) => l.trim()).filter((l) => !!l),
	}
}

export async function ↆreadꓽfileⵧsingle_value(
	file_path: FilePathⳇAny,
	content_hint?: Promise<string> | string,
): Promise<ContentⳇSingleValue> {
	let lines = (await ↆreadꓽfileⵧlist(file_path, content_hint)).entries
	assert(lines.length > 0, `Single-value file is empty!`)
	assert(lines.length === 1, `Single-value file has multiple lines!`)

	return {
		value: lines[0]!,
	}
}

export async function ↆreadꓽfileⵧmarkdown(
	file_path: FilePathⳇAny,
	content_hint?: Promise<string> | string,
): Promise<ContentⳇMarkup> {
	const ↆcontent‿raw = _readꓽfileⵧtextⵧraw(file_path, content_hint)
	const content‿raw = await ↆcontent‿raw
	if (content‿raw.startsWith("---")) {
		// yaml frontmatter
		const ↆpkgꓽyaml = ↆimportꓽyaml()
		const end_of_frontmatter = content‿raw.indexOf("\n---\n", 3)
		assert(end_of_frontmatter > 0, "Invalid frontmatter: missing closing ---")
		const frontmatter_raw = content‿raw.slice(3, end_of_frontmatter)
		const text = content‿raw.slice(end_of_frontmatter + 5)
		const yaml = await ↆpkgꓽyaml
		return {
			text,
			frontmatter: yaml.parse(frontmatter_raw) as JsonⳇObject,
		}
	}

	if (content‿raw.startsWith("+++")) {
		throw new Error("TOML frontmatter not supported yet!")
	}

	return {
		text: content‿raw,
	}
}

export async function ↆreadꓽfileⵧtext(
	file_path: FilePathⳇAny,
	content_hint?: Promise<string> | string,
): Promise<ContentⳇText> {
	return {
		text: await _readꓽfileⵧtextⵧraw(file_path, content_hint),
	}
}

/////////////////////////////////////////////////

async function _readꓽfileⵧtextⵧraw(file_path: FilePathⳇAny, content_hint?: Promise<string> | string): Promise<string> {
	return await (content_hint
		? Promise.resolve(content_hint)
		: fs
				.readFile(path.resolve(process.cwd(), file_path), { encoding: "utf8" })
				.then((x) => x.trim())
				.then(strip_bom)
				.then((x) => x.trim()))
}

/////////////////////////////////////////////////

import { strict as assert } from "node:assert"
import * as fs from "node:fs/promises"
import * as path from "node:path"

import split_lines from "split-lines"
import strip_bom from "strip-bom"

import type { JsonⳇObject, FilePathⳇAny } from "@monorepo-private/ts--types"

import { inferꓽformatⵧfrom_path, ↆimportꓽjson5, ↆimportꓽtoml, ↆimportꓽyaml } from "../common/index.ts"
import type {
	ContentⳇJson5,
	ContentⳇList,
	ContentⳇSingleValue,
	ContentⳇDefaultExport,
	ContentⳇText,
	ContentⳇToml,
	ContentⳇYaml,
	StructuredFileFormatⳇParser,
	StructuredFileFormat,
	StructuredContent,
	ContentⳇMarkup,
} from "../types.ts"
