import type { JSONObject } from "@monorepo-private/ts--types"

export const STRUCTURED_FILE_FORMATS = [
	// in order of preference

	/////// TS
	// TODO review: TS is flexible but risk code injection (cf. contractor hiding a process exfiltration payload in a config file)
	"default-export", // js/ts exporting a default JSONObject
	// TODO ad-hoc defineConfig()

	/////// JSON
	"json5", // https://json5.org/
	"jsonc", // https://jsonc.org/ but missing trailing comma 🤯
	"jsoncⵧwith_trailing_comma", // common extension
	"json", // https://www.json.org

	/////// xML
	"yaml",
	"toml",

	/////// document markup languages https://en.wikipedia.org/wiki/Comparison_of_document_markup_languages
	"markupⵧmarkdown", // with optional frontmatter
	"markupⵧmediawiki", // with optional frontmatter

	///////
	// csv TODO 1D
	// ini TODO 1D
	//| 'kv-simple' // multiple lines `k v` ex. .yarnrc
	"list", // multiple lines ex. .gitignore WILL STRIP COMMENTS
	"single-value", // single line, ex .nvmrc

	// last resort
	"text", // no known or supported structure, just text with EOL and trailing line
	"unknown",
] as const
export type StructuredFileFormat = (typeof STRUCTURED_FILE_FORMATS)[number]

export const STRUCTURED_FILE_FORMATS__PARSERS = [
	"default-export", // js/ts exporting a default JSONObject
	"json5", // can handle any JSON flavor
	"yaml",
	"toml", // https://toml.io/
	"markupⵧmarkdown",
	"markupⵧmediawiki",
	"list", // multiple lines ex. .gitignore ⚠️ WILL STRIP COMMENTS (TODO improve)
	"single-value", // single line, ex .nvmrc
	"text", // no structure, just text
] as const
export type StructuredFileFormatⳇParser = (typeof STRUCTURED_FILE_FORMATS__PARSERS)[number]

export interface StructuredContent {
	dataⵧraw: string
	dataⵧjson: JSONObject
	dataⵧx?: never // TODO advanced data format saving comments, position of elements, etc.

	// TODO schema

	_format: StructuredFileFormat
	_parser: StructuredFileFormatⳇParser
}

export type ContentⳇDefaultExport = JSONObject
export type ContentⳇJson5 = JSONObject
export type ContentⳇYaml = JSONObject
export type ContentⳇList = { entries: string[] }
export type ContentⳇSingleValue = { value: string }
export type ContentⳇText = { text: string }
export type ContentⳇMarkup = { text: string; frontmatter?: JSONObject }
