// Trim "dead" leaves from a JS Object before serialization.
// Use cases:
// - config-like object being written to disk, we don't want empty, useless paths e.g. peerDependencies: {} => dropped

/////////////////////////////////////////////////

interface Options extends BaseOptions {
	onꓽmapⵧempty: "drop" | "keep"
}

const DEFAULT_OPTIONS: Options = {
	...DEFAULT_BASE_OPTIONS,
	onꓽmapⵧempty: "drop", // this is the main point of this function
}

export function trim_before_stringify(
	obj: Immutable<JSONObject>,
	_options: Immutable<Partial<Options>> = {},
): Immutable<JSONObject> {
	const options: Options = {
		...DEFAULT_OPTIONS,
		..._options,
	}

	function _on_new_node_value(
		node: JSONode,
		encountered_nodes: Immutable<Set<JSONode>>,
		conversion_behavior: "DO-NOT-convert-non-json" | "may-convert-non-json",
	): JSONode {
		if (encountered_nodes.has(node)) {
			switch (options.onꓽcycle) {
				case "replace":
					return CYCLES__REPLACEMENT_VALUE
				case "throw":
					throw new Error(CYCLES__ERROR_MESSAGE)
				default:
					assertⵧnever_reached()
			}
		}

		// we expect JSON
		if (isꓽobjectⵧkv(node) && !isꓽobjectⵧliteral(node)) {
			switch (options.onꓽnonᝍjson) {
				case "convert": {
					if (conversion_behavior === "DO-NOT-convert-non-json") {
						break
					} else if (node instanceof Set) {
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

		return node
	}
	function _trim(parent: JSONode, key: JSOKey, node: JSONode, encountered_nodes: Immutable<Set<JSONode>>): JSONode {
		const input = node

		node = _on_new_node_value(node, encountered_nodes, "DO-NOT-convert-non-json")

		// honor toJSON() like JSON.stringify does (e.g. Date -> ISO string)
		if (typeof node === "object" && typeof node?.toJSON === "function") {
			node = _on_new_node_value(node.toJSON(), encountered_nodes, "DO-NOT-convert-non-json")
		}

		node = _on_new_node_value(options.replacer.call(parent, key, node), encountered_nodes, "DO-NOT-convert-non-json")

		// unwrap boxed primitives (new String()/Number()...) to their primitive value,
		// matching JSON.stringify (which serializes them as the primitive, not as an indexed object)
		// NOTE: this test is a bit wide but remember we don't expect any non-json
		if (typeof node === "object" && typeof node?.valueOf === "function") {
			node = _on_new_node_value(node.valueOf(), encountered_nodes, "DO-NOT-convert-non-json")
		}

		// finally we allow converting non-json
		node = _on_new_node_value(node, encountered_nodes, "may-convert-non-json")

		if (!node) return node

		const is_leaf = typeof node !== "object"
		if (is_leaf) {
			return node
		}

		const new_encountered_nodes = new Set(encountered_nodes)
		new_encountered_nodes.add(input)

		let [output, entries] = Array.isArray(node)
			? [
					// NOTE: pre-size + forEach (which skips holes) to preserve sparse arrays;
					Array.from({ length: node.length }) as JSONode[],
					[...node.entries()],
				]
			: [{} as { [key: JSOKey]: JSONode }, Object.entries(node)]

		output = entries.reduce((acc, [k, v]) => {
			acc[k] = _trim(node, k, v, new_encountered_nodes)
			return acc
		}, output)

		/*
		if (Array.isArray(node)) {
			// reduce/push would collapse holes and diverge from JSON.stringify (→ null).
			const output: JSONode[] =
			node.forEach((v, i) => {
				output[i] = _trim(node, i, v, new_encountered_nodes)
			})
			return output
		}

		const output: { [key: JSOKey]: JSONode } = {}
		const entries = Object.entries(node)
			.map(([k, v]) => {
				return [k, _trim(node, k, v, new_encountered_nodes)]
			})
			.filter(([, v]) => {
				if (v === undefined) return false
				if (typeof v === "function" || typeof v === "symbol") {
					// stringify would silently omit
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

				return true
			})
			return Object.fromEntries(entries) as JSONode
*/

		if (entries.length === 0 && options.onꓽmapⵧempty === "drop") {
			// THIS
			// clean this useless config leaf
			// This is the whole point of this function
			return undefined // undef will be dropped by JSON.stringify
		}

		return output
	}

	return _trim({ "": obj }, "", obj, new Set())
}

/////////////////////////////////////////////////

import { assertⵧnever_reached } from "@monorepo-private/assert"
import type { Immutable, JSONObject } from "@monorepo-private/ts--types"
import { isꓽobjectⵧkv, isꓽobjectⵧliteral } from "@monorepo-private/type-detection"

import { CYCLES__REPLACEMENT_VALUE, CYCLES__ERROR_MESSAGE, NON_JSON__ERROR_MESSAGE } from "../consts.ts"
import { type JSOKey, type JSONode, type BaseOptions, DEFAULT_BASE_OPTIONS } from "../types.ts"
