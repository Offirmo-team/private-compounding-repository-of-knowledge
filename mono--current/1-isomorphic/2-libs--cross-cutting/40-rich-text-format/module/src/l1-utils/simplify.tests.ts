import { expect } from "chai"

import { LIB } from "../consts.ts"
import type { Node } from "../l1-types/types.ts"

import { simplifyꓽnode } from "./simplify.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- simplifyꓽnode`, function () {
	describe("inline", function () {
		it("should pass through primitives unchanged", () => {
			expect(simplifyꓽnode("hello")).to.equal("hello")
			expect(simplifyꓽnode(42)).to.equal(42)
		})

		it("should properly handle falsy primitives", () => {
			expect(simplifyꓽnode("")).to.equal("")
			expect(simplifyꓽnode(0)).to.equal(0)
		})

		it("should collapse a trivial inline fragment to a string", () => {
			expect(simplifyꓽnode({ $content: "hello" })).to.equal("hello")
			expect(simplifyꓽnode({ $content: 42 })).to.equal(42)
		})

		it("should deep collapse a trivial inline fragment to a string", () => {
			expect(simplifyꓽnode({ $content: { $content: "hello" } })).to.equal("hello")
			expect(simplifyꓽnode({ $content: { $content: 42 } })).to.equal(42)
		})

		it("should preserve semantic types", () => {
			const result = simplifyꓽnode({ $type: "strong", $content: "bold" })
			expect(result).to.deep.include({ $type: "strong", $content: "bold" })
		})
	})

	describe("block", function () {
		// KEY INVARIANT: block-level nodes MUST always have Array $content
		// even with a single child. This is how 'auto' $type resolution works.

		it("should keep $content as an array even with a single child", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: ["only child"],
			}) as Node
			expect(result.$content).to.be.an("array")
			expect(result.$content).to.deep.equal(["only child"])
		})

		it("should keep $content as an array for ol/ul with a single child", () => {
			const result = simplifyꓽnode({
				$type: "ol",
				$content: ["single item"],
			}) as Node
			expect(result.$content).to.be.an("array")
			expect(result.$content).to.deep.equal(["single item"])
			expect(result.$type).to.equal("ol")
		})

		it("should remove redundant fragmentⵧblock type (array $content implies block)", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: ["first", "second"],
			}) as Node
			expect(result.$type).to.be.undefined
			expect(result.$content).to.deep.equal(["first", "second"])
		})

		it("should remove redundant fragmentⵧblock type even with a single child", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: ["only child"],
			}) as Node
			// Array implies block, so fragmentⵧblock is redundant
			expect(result.$type).to.be.undefined
			expect(result.$content).to.deep.equal(["only child"])
		})

		it("should preserve non-fragment block types", () => {
			const result = simplifyꓽnode({
				$type: "ul",
				$content: ["a", "b", "c"],
			}) as Node
			expect(result.$type).to.equal("ul")
			expect(result.$content).to.deep.equal(["a", "b", "c"])
		})

		it("should simplify inner nodes recursively", () => {
			const result = simplifyꓽnode({
				$type: "ul",
				$content: [
					{ $type: "fragmentⵧinline", $content: "simplified away" },
					{ $type: "strong", $content: "kept" },
				],
			}) as Node
			expect(result.$type).to.equal("ul")
			const content = result.$content as Array<any>
			expect(content[0]).to.equal("simplified away")
			expect(content[1]).to.deep.include({ $type: "strong", $content: "kept" })
		})

		it("should simplify inner node to string but keep array wrapper", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: [{ $type: "fragmentⵧinline", $content: "hello" }],
			}) as Node
			// Inner node collapses to 'hello', but outer $content stays an array
			expect(result.$content).to.deep.equal(["hello"])
		})

		it("should handle empty array content", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: [],
			}) as Node
			expect(result.$content).to.deep.equal([])
		})

		it("should handle nested block inside single-element array", () => {
			const result = simplifyꓽnode({
				$type: "fragmentⵧblock",
				$content: [{ $type: "ul", $content: ["a", "b"] }],
			}) as Node
			// $content stays as array, inner node is simplified but stays a node
			expect(result.$content).to.be.an("array")
			const inner = (result.$content as Array<any>)[0] as Node
			expect(inner.$type).to.equal("ul")
			expect(inner.$content).to.deep.equal(["a", "b"])
		})
	})
})
