/////////////////////////////////////////////////

import type { Immutable } from "@monorepo-private/ts--types"

export interface BaseOptions {
	replacer: Replacer
	onꓽnonᝍjson: "throw" | "warn" | "convert"
	onꓽcycle: "throw" | "replace"
}

export const DEFAULT_BASE_OPTIONS: BaseOptions = {
	replacer: (key, value) => value,
	onꓽnonᝍjson: "throw",
	onꓽcycle: "throw",
}

type Replacer = (this: Immutable<JSONode>, key: JSOKey, value: Immutable<JSONode>) => Immutable<JSONode>

export type JSOKey = string | number
export type JSONode = Parameters<JSON["stringify"]>[0]

/////////////////////////////////////////////////
