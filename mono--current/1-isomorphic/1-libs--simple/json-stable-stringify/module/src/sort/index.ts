// "sort" an object (into a new object if change, preserving immu)
// Use cases:
// - prepare for non-JSON stringifiers

/////////////////////////////////////////////////

export interface Options extends BaseOptions {
	cmp: (a: string, b: string) => number // comparison function for sorting object's keys
}

export const DEFAULT_OPTIONS: Options = {
	...DEFAULT_BASE_OPTIONS,
	cmp: default_cmp,
}

export function sort_before_stringify(
	obj: Immutable<JSONObject>,
	_options: Immutable<Partial<Options>> = {},
): Immutable<JSONObject> {
	const options: Options = {
		...DEFAULT_OPTIONS,
		..._options,
	}

	function _sort(parent: JSONode, key: JSOKey, node: JSONode, encountered_nodes: Immutable<Set<JSONode>>): JSONode {
		const input = node

		if (encountered_nodes.has(input)) {
			switch (options.onꓽcycle) {
				case "replace":
					return CYCLES__REPLACEMENT_VALUE
				case "throw":
					throw new Error(CYCLES__ERROR_MESSAGE)
				default:
					assertⵧnever_reached()
			}
		}

		// honor toJSON() like JSON.stringify does (e.g. Date -> ISO string)
		if (typeof node === "object" && typeof node?.toJSON === "function") {
			node = node.toJSON()
			if (encountered_nodes.has(input)) {
				switch (options.onꓽcycle) {
					case "replace":
						return CYCLES__REPLACEMENT_VALUE
					case "throw":
						throw new Error(CYCLES__ERROR_MESSAGE)
					default:
						assertⵧnever_reached()
				}
			}
		}

		node = options.replacer.call(parent, key, node)
		if (encountered_nodes.has(input)) {
			switch (options.onꓽcycle) {
				case "replace":
					return CYCLES__REPLACEMENT_VALUE
				case "throw":
					throw new Error(CYCLES__ERROR_MESSAGE)
				default:
					assertⵧnever_reached()
			}
		}

		// unwrap boxed primitives (new String()/Number()...) to their primitive value,
		// matching JSON.stringify (which serializes them as the primitive, not as an indexed object)
		// NOTE: this test is a bit wide but remember we don't expect any non-json
		if (typeof node === "object" && typeof node?.valueOf === "function") {
			node = node.valueOf()
			if (encountered_nodes.has(input)) {
				switch (options.onꓽcycle) {
					case "replace":
						return CYCLES__REPLACEMENT_VALUE
					case "throw":
						throw new Error(CYCLES__ERROR_MESSAGE)
					default:
						assertⵧnever_reached()
				}
			}
		}

		if (!node) return node

		const is_leaf = typeof node !== "object"
		if (is_leaf) {
			return node
		}

		const new_encountered_nodes = new Set(encountered_nodes)
		new_encountered_nodes.add(input)

		if (Array.isArray(node)) {
			// NOTE: pre-size + forEach (which skips holes) to preserve sparse arrays;
			// reduce/push would collapse holes and diverge from JSON.stringify (→ null).
			const output: JSONode[] = Array.from({ length: node.length })
			node.forEach((v, i) => {
				output[i] = _sort(node, i, v, new_encountered_nodes)
			})
			return output
		}

		// we expect JSON
		if (!isꓽobjectⵧliteral(node)) {
			switch (options.onꓽnonᝍjson) {
				case "convert": {
					if (node instanceof Set) {
						node = Array.from(node.values()).sort()
						break
					} else if (node instanceof Map) {
						node = Object.fromEntries(node.entries())
						break
					} else if (node instanceof Error) {
						node = {
							name: node.name,
							message: node.message,
						}
						break
					}
					throw new Error(NON_JSON__ERROR_MESSAGE)
				}
				case "throw":
					throw new Error(NON_JSON__ERROR_MESSAGE)
				case "warn":
					console.warn(NON_JSON__ERROR_MESSAGE)
					return { warn: "non-json object encountered" }
				default:
					assertⵧnever_reached()
			}
		}

		const output: { [key: JSOKey]: JSONode } = {}
		return Object.keys(node)
			.sort(options.cmp)
			.reduce((sorted, k) => {
				sorted[k] = _sort(node, k, node[k], new_encountered_nodes)
				return sorted
			}, output)
	}

	return _sort({ "": obj }, "", obj, new Set())
}

/////////////////////////////////////////////////

import { assertⵧnever_reached } from "@monorepo-private/assert"
import type { Immutable, JSONObject } from "@monorepo-private/ts--types"
import { isꓽobjectⵧliteral } from "@monorepo-private/type-detection"

import { CYCLES__REPLACEMENT_VALUE, CYCLES__ERROR_MESSAGE, NON_JSON__ERROR_MESSAGE, default_cmp } from "../consts.ts"
import { type JSOKey, type JSONode, type BaseOptions, DEFAULT_BASE_OPTIONS } from "../types.ts"
