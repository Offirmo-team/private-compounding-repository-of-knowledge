import * as path from "node:path"

import type { JSONObject, FilePathⳇAny, Immutable, JSON } from "@monorepo-private/ts--types"
import { isꓽobjectⵧliteral } from "@monorepo-private/type-detection"

import type { StructuredFileFormat } from "../types.ts"

/////////////////////////////////////////////////

async function ↆimportꓽjson5() {
	return await import("json5").then((x) => (x as any).default as typeof import("json5"))
}

async function ↆimportꓽtoml() {
	return await import("smol-toml").then((x) => (x as any).default as typeof import("smol-toml"))
}

async function ↆimportꓽyaml() {
	return await import("yaml").then((x) => (x as any).default as typeof import("yaml"))
}

/////////////////////////////////////////////////

function inferꓽformat_from_path(file_path: FilePathⳇAny): StructuredFileFormat | undefined {
	const basename = path.basename(file_path)
	const basename‿lc = basename.toLowerCase()
	const ᐧext‿lc = path.extname(basename‿lc)

	// extension is the strongest hint
	switch (ᐧext‿lc) {
		case ".json":
			return "json"

		case ".jsonc":
			return "jsonc"

		case ".json5":
			return "json5"

		case ".js":
		case ".cjs":
		case ".mjs":
		case ".ts":
		case ".mts":
			return "default-export"

		case ".toml":
			return "toml"

		case ".yml":
		case ".yaml":
			return "yaml"

		case ".md":
		case ".markdown":
		case ".mdoc":
			return "markupⵧmarkdown"

		case ".mediawiki":
			return "markupⵧmediawiki"

		default:
			break
	}

	// then exact file match
	switch (basename‿lc) {
		case ".parcelrc":
			return "json"
		case ".npmrc":
		case ".keep":
			return "list"
		case ".nvmrc":
			return "single-value"
		case "license":
			return "text"

		// TODO improve
		case ".editorconfig":
			return "text" // more like K/V TODO implement
		case ".gitattributes":
			return "list" // more like K/V TODO implement
		default:
			break
	}

	// other hints
	switch (true) {
		case basename‿lc.endsWith("ignore"):
			// .gitignore .prettierignore etc.
			return "list"
		default:
			break
	}

	return undefined
}

function _getꓽjson__type(a: Immutable<JSON>): "object" | "array" | "primitive" | "undef" {
	if (a === undefined) {
		return "undef"
	}

	if (Array.isArray(a)) {
		return "array"
	}

	if (a === null) return "primitive"
	if (["string", "number", "boolean"].includes(typeof a)) return "primitive"

	if (isꓽobjectⵧliteral(a as any)) {
		return "object"
	}

	throw new Error("Incorrect JSON!")
}

// XXX TODO move to lib
// XXX TODO compare with merge:deep
function mergeꓽjson(a: Immutable<JSON>, b: Immutable<JSON>): Immutable<JSON> {
	if (a === undefined) {
		return b
	}
	if (b === undefined) {
		return a
	}

	const ta = _getꓽjson__type(a)
	const tb = _getꓽjson__type(b)
	if (ta !== tb) {
		throw new Error(`Cannot merge different JSON types: ${ta} vs ${tb}!`)
	}
	switch (ta) {
		case "primitive":
			if (a === b) return a
			throw new Error(`Cannot merge conflicting primitive JSON values: ${a} vs ${b}!`)
		case "array":
			// TODO set for uniqueness!
			return [...(a as JSON[]), ...(b as JSON[])].sort()
		case "object": {
			const result: Immutable<JSONObject> = {}
			const k1 = Object.keys(a as JSONObject)
			const k2 = Object.keys(b as JSONObject)
			const all_keys = Array.from(new Set([...k1, ...k2])).sort()
			for (const k of all_keys) {
				result[k] = mergeꓽjson((a as Immutable<JSONObject>)[k], (b as Immutable<JSONObject>)[k])
			}
			return result
		}
		default:
			throw new Error("Unexpected JSON type!")
	}
}

/////////////////////////////////////////////////

export { ↆimportꓽjson5, ↆimportꓽtoml, ↆimportꓽyaml, inferꓽformat_from_path, mergeꓽjson }
