/////////////////////////////////////////////////

export async function ↆimportꓽjson5() {
	return await import("json5").then((x) => (x as any).default as typeof import("json5"))
}

export async function ↆimportꓽtoml() {
	return await import("smol-toml").then((x) => (x as any).default as typeof import("smol-toml"))
}

export async function ↆimportꓽyaml() {
	return await import("yaml").then((x) => (x as any).default as typeof import("yaml"))
}

/////////////////////////////////////////////////

export function inferꓽformatⵧfrom_path(file_path: FilePathⳇAny): StructuredFileFormat | undefined {
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
		// repo-level git config
		case file_path.endsWith(".git/info/attributes"):
			return "list"
		default:
			break
	}

	return undefined
}

/////////////////////////////////////////////////

import * as path from "node:path"

import type { FilePathⳇAny } from "@monorepo-private/ts--types"

import type { StructuredFileFormat } from "../types.ts"
