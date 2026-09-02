/////////////////////////////////////////////////

interface Options extends BaseOptions {
	indent:
		| string // will add EOL
		| null // will NOT add EOL = most compact
}

const DEFAULT_OPTIONS: Options = {
	...DEFAULT_BASE_OPTIONS,
	indent: null, // most compact by default
}

export function json_stable_stringify(
	obj: Immutable<JSONObject>,
	_options: Immutable<Partial<Options>> = {},
): ReturnType<(typeof JSON)["stringify"]> {
	const options: Options = {
		...DEFAULT_OPTIONS,
		..._options,
	}

	const sorted = sort_before_stringify(obj, _options)
	return JSON.stringify(sorted, null, options.indent === null ? undefined : options.indent)
}

/////////////////////////////////////////////////

import type { Immutable, JSONObject } from "@monorepo-private/ts--types"

import {
	type Options as BaseOptions,
	DEFAULT_OPTIONS as DEFAULT_BASE_OPTIONS,
	sort_before_stringify,
} from "../sort/index.ts"
