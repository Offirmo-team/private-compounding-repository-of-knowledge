/////////////////////////////////////////////////

describe(`${LIB} -- simplifyꓽnode`, () => {
	describe("inline", () => {
		it("should pass through primitives unchanged", () => {
			expect(simplifyꓽnode("hello")).toBe("hello")
			expect(simplifyꓽnode(42)).toBe(42)
		})

		it("should properly handle falsy primitives", () => {
			expect(simplifyꓽnode("")).toBe("")
			expect(simplifyꓽnode(0)).toBe(0)
		})

		it("should collapse a trivial inline fragment to a string", () => {
			expect(simplifyꓽnode({ $content: "hello" })).toBe("hello")
			expect(simplifyꓽnode({ $content: 42 })).toBe(42)
		})

		it("should deep collapse a trivial inline fragment to a string", () => {
			expect(simplifyꓽnode({ $content: { $content: "hello" } })).toBe("hello")
			expect(simplifyꓽnode({ $content: { $content: 42 } })).toBe(42)
		})

		it("should preserve semantic types", () => {
			const result = simplifyꓽnode({ $type: "strong", $content: "bold" })
			expect(result).toMatchObject({ $type: "strong", $content: "bold" })
		})
	})

	describe("block", () => {
		// KEY INVARIANT: block-level nodes MUST always have Array $content
		// even with a single child. This is how 'auto' $type resolution works.

		it("should keep $content as an array even with a single child", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: ["only child"],
			}) as Node
			expect(result.$content).toBeInstanceOf(Array)
			expect(result.$content).toStrictEqual(["only child"])
		})

		it("should keep $content as an array for ol/ul with a single child", () => {
			const result = simplifyꓽnode({
				$type: "ol",
				$content: ["single item"],
			}) as Node
			expect(result.$content).toBeInstanceOf(Array)
			expect(result.$content).toStrictEqual(["single item"])
			expect(result.$type).toBe("ol")
		})

		it("should remove redundant fragmentⵧblock type (array $content implies block)", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: ["first", "second"],
			}) as Node
			expect(result.$type).toBeUndefined()
			expect(result.$content).toStrictEqual(["first", "second"])
		})

		it("should remove redundant fragmentⵧblock type even with a single child", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: ["only child"],
			}) as Node
			// Array implies block, so fragmentⵧblock is redundant
			expect(result.$type).toBeUndefined()
			expect(result.$content).toStrictEqual(["only child"])
		})

		it("should preserve non-fragment block types", () => {
			const result = simplifyꓽnode({
				$type: "ul",
				$content: ["a", "b", "c"],
			}) as Node
			expect(result.$type).toBe("ul")
			expect(result.$content).toStrictEqual(["a", "b", "c"])
		})

		it("should simplify inner nodes recursively", () => {
			const result = simplifyꓽnode({
				$type: "ul",
				$content: [
					{ $type: "fragmentⵧinline", $content: "simplified away" },
					{ $type: "strong", $content: "kept" },
				],
			}) as Node
			expect(result.$type).toBe("ul")
			const content = result.$content as Array<any>
			expect(content[0]).toBe("simplified away")
			expect(content[1]).toMatchObject({ $type: "strong", $content: "kept" })
		})

		it("should simplify inner node to string but keep array wrapper", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: [{ $type: "fragmentⵧinline", $content: "hello" }],
			}) as Node
			// Inner node collapses to 'hello', but outer $content stays an array
			expect(result.$content).toStrictEqual(["hello"])
		})

		it("should handle empty array content", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: [],
			}) as Node
			expect(result.$content).toStrictEqual([])
		})

		it("should handle nested block inside single-element array", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: [{ $type: "ul", $content: ["a", "b"] }],
			}) as Node
			// $content stays as array, inner node is simplified but stays a node
			expect(result.$content).toBeInstanceOf(Array)
			const inner = (result.$content as Array<any>)[0] as Node
			expect(inner.$type).toBe("ul")
			expect(inner.$content).toStrictEqual(["a", "b"])
		})
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import { LIB } from "../consts.ts"
import type { Node } from "../l1-types/types.ts"

import { simplifyꓽnode } from "./simplify.ts"
