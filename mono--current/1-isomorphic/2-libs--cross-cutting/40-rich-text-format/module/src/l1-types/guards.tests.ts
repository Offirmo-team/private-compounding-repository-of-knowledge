import { expect } from "chai"

import { LIB } from "../consts.ts"

import { isꓽNode, isꓽNodeLike } from "./guards.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- type guards`, function () {
	describe("isꓽNode()", function () {
		it("should work -- false", () => {
			expect(isꓽNode(null)).to.be.false
			expect(isꓽNode(undefined)).to.be.false
			expect(isꓽNode({})).to.be.false
			expect(isꓽNode("foo")).to.be.false
			expect(isꓽNode(42)).to.be.false
			expect(isꓽNode({ foo: 42 })).to.be.false
		})

		it("should work -- true", () => {
			expect(isꓽNode({ $v: 1 })).to.be.true
			expect(isꓽNode({ $content: "foo" })).to.be.true
			expect(isꓽNode({ $content: ["foo"] })).to.be.true // block variant
		})

		describe("[BUG#2] should accept numeric $content (number is a valid NodeLike)", () => {
			it("should accept a node with $content as a number", () => {
				// NodeLike = string | number | Node, so $content: 42 is valid per the type
				// but the guard uses a string reference, causing a type mismatch
				expect(isꓽNode({ $content: 42 })).to.be.true
			})
		})

		describe("[BUG#3] should accept numeric $heading (number is a valid NodeLike)", () => {
			it("should accept a node with $heading as a number", () => {
				// $heading: NodeLike | null, so a number should be valid
				expect(isꓽNode({ $heading: 42, $content: ["foo"] })).to.be.true
			})
		})

		describe("[R01] should accept Node-typed $content and $heading (Node is a valid NodeLike)", () => {
			it("should accept a node with $content as a Node object", () => {
				// NodeLike = string | number | Node, so $content: Node should be valid
				expect(isꓽNode({ $content: { $content: "nested" } })).to.be.true
			})

			it("should accept a node with $content as a deep nested Node", () => {
				expect(isꓽNode({ $content: { $content: { $content: "deep" } } })).to.be.true
			})

			it("should accept a node with $heading as a Node object", () => {
				// $heading: NodeLike | null, so a Node object should be valid
				expect(isꓽNode({ $heading: { $content: "section title" }, $content: ["foo"] })).to.be.true
			})

			it("should accept a node with both $content and $heading as Node objects", () => {
				expect(
					isꓽNode({
						$heading: { $content: "title", $type: "strong" },
						$content: [{ $content: "body" }],
					}),
				).to.be.true
			})
		})

		describe("[BUG#2b] should reject an invalid $type value", () => {
			it("should reject a node with a $type not in NodeType enum", () => {
				// 'banana' is not a valid NodeType, yet the guard does not validate $type values
				expect(isꓽNode({ $type: "banana", $content: "hello" })).to.be.false
			})
		})
	})

	describe("isꓽNodeLike()", function () {
		it("should work -- false", () => {
			expect(isꓽNodeLike(null)).to.be.false
			expect(isꓽNodeLike(undefined)).to.be.false
			expect(isꓽNodeLike(true)).to.be.false
			expect(isꓽNodeLike({ foo: 42 })).to.be.false
		})

		it("should work -- true", () => {
			expect(isꓽNodeLike("hello")).to.be.true
			expect(isꓽNodeLike(42)).to.be.true
			expect(isꓽNodeLike({ $content: "foo" })).to.be.true
		})
	})
})
