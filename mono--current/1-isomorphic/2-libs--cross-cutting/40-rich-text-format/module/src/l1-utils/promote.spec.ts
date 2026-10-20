/////////////////////////////////////////////////

describe(`${LIB} -- promoteꓽto_node`, () => {
	it("should promote a string to an inline fragment node", () => {
		const result = promoteꓽto_node("hello")
		expect(result).toStrictEqual({
			$type: "fragmentⵧinline",
			$content: "hello",
		})
	})

	it("should promote a number to an inline fragment node with string content", () => {
		const result = promoteꓽto_node(42)
		expect(result).toStrictEqual({
			$type: "fragmentⵧinline",
			$content: "42",
		})
	})

	it("should pass through a valid Node unchanged", () => {
		const node: Node = { $content: "foo", $type: "strong" }
		const result = promoteꓽto_node(node)
		expect(result).toBe(node) // same reference
	})

	it("should reject invalid objects", () => {
		expect(() => promoteꓽto_node({ foo: 42 } as any)).toThrow()
	})

	it("should reject non-object non-primitive values", () => {
		expect(() => promoteꓽto_node(null as any)).toThrow()
		expect(() => promoteꓽto_node(undefined as any)).toThrow()
		expect(() => promoteꓽto_node(true as any)).toThrow()
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import { LIB } from "../consts.ts"
import type { Node } from "../l1-types/types.ts"

import { promoteꓽto_node } from "./promote.ts"
