/////////////////////////////////////////////////

export async function ೱwriteꓽfile(
	file_path: FilePathⳇAny,
	content: Immutable<JSONObject>,
	format?: StructuredFileFormat | undefined, // SSoT: format will be inferred from extension if absent
	{}: {} = {},
): Promise<void> {
	format ||=
		inferꓽformat_from_path(file_path) ||
		(() => {
			// infer from content
			throw new Error(`ೱwriteꓽfile format detection`)
		})()

	switch (format) {
		case "default-export":
			return await ೱwriteꓽfileⵧdefault_export(file_path, content)
		case "json5":
			return await ೱwriteꓽfileⵧjson5(file_path, content)
		case "json":
			return await ೱwriteꓽfileⵧjson(file_path, content)
		case "toml":
			return await ೱwriteꓽfileⵧtoml(file_path, content)
		case "yaml":
			return await ೱwriteꓽfileⵧyaml(file_path, content)
		case "list":
			return await ೱwriteꓽfileⵧlist(file_path, content as any)
		case "single-value":
			return await ೱwriteꓽfileⵧsingle_value(file_path, content as any)
		case "text":
			return await ೱwriteꓽfileⵧtext(file_path, content as any)
		case "markupⵧmarkdown":
			return await ೱwriteꓽfileⵧtext(file_path, content as any)
		default:
			throw new Error(`Writing to format ${format} not implemented!`)
	}
}

/////////////////////////////////////////////////

export async function ೱwriteꓽfileⵧjson5(file_path: FilePathⳇAny, content: Immutable<ContentⳇJson5>): Promise<void> {
	const pkgꓽjson5 = await ↆimportꓽjson5()
	content = sort_before_stringify(content)
	const content_serialized = pkgꓽjson5.stringify(content, null, 2)
	await _ↆwrite_raw(file_path, content_serialized)
}

export async function ೱwriteꓽfileⵧjson(file_path: FilePathⳇAny, content: Immutable<JSONObject>): Promise<void> {
	const content_serialized = stringifyⵧstable(content, {
		indent: "\t", // TODO configurable write-json-file used to auto detect, should we use it?
	})
	await _ↆwrite_raw(file_path, content_serialized)
}

export async function ೱwriteꓽfileⵧtoml(file_path: FilePathⳇAny, content: Immutable<ContentⳇYaml>): Promise<void> {
	const pkgꓽtoml = await ↆimportꓽtoml()
	content = sort_before_stringify(content)
	const content_serialized = pkgꓽtoml.stringify(content)
	await _ↆwrite_raw(file_path, content_serialized)
}

export async function ೱwriteꓽfileⵧyaml(file_path: FilePathⳇAny, content: Immutable<ContentⳇYaml>): Promise<void> {
	const pkgꓽyaml = await ↆimportꓽyaml()
	content = sort_before_stringify(content)
	const content_serialized = pkgꓽyaml.stringify(content)
	await _ↆwrite_raw(file_path, content_serialized)
}

export async function ೱwriteꓽfileⵧlist(file_path: FilePathⳇAny, content: Immutable<ContentⳇList>): Promise<void> {
	// assume it's a set
	// TODO 1D options
	const entries = new Set<string>(content.entries.map((s) => s.trim()))
	const content_serialized = Array.from(entries.keys()).sort().join("\n") + "\n"
	await _ↆwrite_raw(file_path, content_serialized)
}

export async function ೱwriteꓽfileⵧsingle_value(
	file_path: FilePathⳇAny,
	content: Immutable<ContentⳇSingleValue>,
): Promise<void> {
	const content_serialized = `${content.value}\n`
	await _ↆwrite_raw(file_path, content_serialized)
}

export async function ೱwriteꓽfileⵧtext(file_path: FilePathⳇAny, content: Immutable<ContentⳇText>): Promise<void> {
	const content_serialized = `${content.text}`
	await _ↆwrite_raw(file_path, content_serialized)
}

export async function ೱwriteꓽfileⵧdefault_export(
	file_path: FilePathⳇAny,
	content: Immutable<ContentⳇText>,
): Promise<void> {
	const pkgꓽjson5 = await ↆimportꓽjson5()
	const content_serialized = `const data = ${pkgꓽjson5.stringify(content, null, 2)}

export default data`
	await _ↆwrite_raw(file_path, content_serialized)
}

/////////////////////////////////////////////////

async function _ↆwrite_raw(file_path: FilePathⳇAny, content_serialized: string): Promise<void> {
	const abs_path = path.resolve(process.cwd(), file_path)
	await fs.mkdir(path.dirname(abs_path), { recursive: true })
	await fs.writeFile(abs_path, _post_process_text(content_serialized), { encoding: "utf8" })
}

// TODO details EOL / trailing
function _post_process_text(text: string): string {
	text = text.trim() + "\n" // ensure trailing newline
	return text
}

/////////////////////////////////////////////////

export { type StructuredFileFormat }
export { mergeꓽjson } from "../common/index.ts" // for convenience

/////////////////////////////////////////////////

import * as fs from "node:fs/promises"
import * as path from "node:path"

import { stringifyⵧstable, sort_before_stringify } from "@monorepo-private/json-stable-stringify"
import type { JSONObject, FilePathⳇAny, Immutable } from "@monorepo-private/ts--types"

import { inferꓽformat_from_path, ↆimportꓽjson5, ↆimportꓽtoml, ↆimportꓽyaml } from "../common/index.ts"
import type {
	ContentⳇJson5,
	ContentⳇList,
	ContentⳇSingleValue,
	ContentⳇText,
	ContentⳇYaml,
	StructuredFileFormat,
} from "../types.ts"
