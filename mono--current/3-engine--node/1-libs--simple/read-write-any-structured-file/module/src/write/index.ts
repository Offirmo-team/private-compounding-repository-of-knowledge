/////////////////////////////////////////////////

export type Options = {
	// TODO 1D options trailing EOL, EOL format etc.
}
export async function ೱwriteꓽfile(
	file_path: FilePathⳇAny,
	content: Immutable<JsonⳇObject>,
	format?: StructuredFileFormat | undefined, // SSoT: format will be inferred from extension if absent
	options: Partial<Options> = {},
): Promise<void> {
	format ||=
		inferꓽformatⵧfrom_path(file_path) ||
		(() => {
			// TODO 1D infer from content
			// but this should be seldom needed
			console.error(`inferꓽformat_from_path() couldn't infer for "${file_path}"!`)
			throw new Error(`ೱwriteꓽfile format detection`)
		})()

	switch (format) {
		// TODO 1D dynamically check content and remove "as any"
		case "default-export":
			return await ೱwriteꓽfileⵧdefault_export(file_path, content as any, options)
		case "json5":
			return await ೱwriteꓽfileⵧjson5(file_path, content, options)
		case "json":
			return await ೱwriteꓽfileⵧjson(file_path, content, options)
		case "toml":
			return await ೱwriteꓽfileⵧtoml(file_path, content, options)
		case "yaml":
			return await ೱwriteꓽfileⵧyaml(file_path, content, options)
		case "list":
			return await ೱwriteꓽfileⵧlist(file_path, content as any, options)
		case "single-value":
			return await ೱwriteꓽfileⵧsingle_value(file_path, content as any, options)
		case "text":
			return await ೱwriteꓽfileⵧtext(file_path, content as any, options)
		case "markupⵧmarkdown": {
			const { frontmatter, text } = content as ContentⳇMarkup
			const content‿text: ContentⳇText = {
				text: [frontmatter || "", text].filter((s) => !!s).join("\n\n"),
			}
			return await ೱwriteꓽfileⵧtext(file_path, content‿text, options)
		}
		default:
			throw new Error(`Writing to format ${format} not implemented!`)
	}
}

export { type StructuredFileFormat }

/////////////////////////////////////////////////

export async function ೱwriteꓽfileⵧjson5(
	file_path: FilePathⳇAny,
	content: Immutable<ContentⳇJson5>,
	options: Partial<Options> = {},
): Promise<void> {
	const pkgꓽjson5 = await ↆimportꓽjson5()
	content = sort_before_stringify(content)
	const content_serialized = pkgꓽjson5.stringify(content, null, 2)
	await _ↆwriteꓽfileⵧtextⵧraw(file_path, content_serialized, options)
}

export async function ೱwriteꓽfileⵧjson(
	file_path: FilePathⳇAny,
	content: Immutable<JsonⳇObject>,
	options: Partial<Options> = {},
): Promise<void> {
	const content_serialized = stringifyⵧstable(content, {
		indent: "\t", // TODO configurable write-json-file used to auto detect, should we use it?
	})
	await _ↆwriteꓽfileⵧtextⵧraw(file_path, content_serialized, options)
}

export async function ೱwriteꓽfileⵧtoml(
	file_path: FilePathⳇAny,
	content: Immutable<ContentⳇYaml>,
	options: Partial<Options> = {},
): Promise<void> {
	const pkgꓽtoml = await ↆimportꓽtoml()
	content = sort_before_stringify(content)
	const content_serialized = pkgꓽtoml.stringify(content)
	await _ↆwriteꓽfileⵧtextⵧraw(file_path, content_serialized, options)
}

export async function ೱwriteꓽfileⵧyaml(
	file_path: FilePathⳇAny,
	content: Immutable<ContentⳇYaml>,
	options: Partial<Options> = {},
): Promise<void> {
	const pkgꓽyaml = await ↆimportꓽyaml()
	content = sort_before_stringify(content)
	const content_serialized = pkgꓽyaml.stringify(content)
	await _ↆwriteꓽfileⵧtextⵧraw(file_path, content_serialized, options)
}

export async function ೱwriteꓽfileⵧlist(
	file_path: FilePathⳇAny,
	content: Immutable<ContentⳇList>,
	options: Partial<Options> = {},
): Promise<void> {
	// assume it's a set
	// TODO 1D options
	const entries = new Set<string>(content.entries.map((s) => s.trim()))
	const content_serialized = Array.from(entries.keys()).sort().join("\n") + "\n"
	await _ↆwriteꓽfileⵧtextⵧraw(file_path, content_serialized, options)
}

export async function ೱwriteꓽfileⵧsingle_value(
	file_path: FilePathⳇAny,
	content: Immutable<ContentⳇSingleValue>,
	options: Partial<Options> = {},
): Promise<void> {
	const content_serialized = `${content.value}\n`
	await _ↆwriteꓽfileⵧtextⵧraw(file_path, content_serialized, options)
}

export async function ೱwriteꓽfileⵧtext(
	file_path: FilePathⳇAny,
	content: Immutable<ContentⳇText>,
	options: Partial<Options> = {},
): Promise<void> {
	const content_serialized = `${content.text}`
	await _ↆwriteꓽfileⵧtextⵧraw(file_path, content_serialized, options)
}

export async function ೱwriteꓽfileⵧdefault_export(
	file_path: FilePathⳇAny,
	content: Immutable<ContentⳇText>,
	options: Partial<Options> = {},
): Promise<void> {
	const pkgꓽjson5 = await ↆimportꓽjson5()
	const content_serialized = `const data = ${pkgꓽjson5.stringify(content, null, 2)}

export default data`
	await _ↆwriteꓽfileⵧtextⵧraw(file_path, content_serialized, options)
}

/////////////////////////////////////////////////

async function _ↆwriteꓽfileⵧtextⵧraw(
	file_path: FilePathⳇAny,
	content_serialized: string,
	options: Partial<Options> = {},
): Promise<void> {
	const abs_path = path.resolve(process.cwd(), file_path)
	await fs.mkdir(path.dirname(abs_path), { recursive: true })
	await fs.writeFile(abs_path, _post_process_text(content_serialized, options), { encoding: "utf8" })
}

function _post_process_text(text: string, {}: Options): string {
	text = text.trim() + "\n" // ensure trailing newline
	return text
}

/////////////////////////////////////////////////

import * as fs from "node:fs/promises"
import * as path from "node:path"

import { stringifyⵧstable, sort_before_stringify } from "@monorepo-private/json-stable-stringify"
import type { JsonⳇObject, FilePathⳇAny, Immutable } from "@monorepo-private/ts--types"

import { inferꓽformatⵧfrom_path, ↆimportꓽjson5, ↆimportꓽtoml, ↆimportꓽyaml } from "../common/index.ts"
import type {
	ContentⳇJson5,
	ContentⳇList,
	ContentⳇMarkup,
	ContentⳇSingleValue,
	ContentⳇText,
	ContentⳇYaml,
	StructuredFileFormat,
} from "../types.ts"
