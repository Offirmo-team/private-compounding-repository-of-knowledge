import { expect } from "chai"

import { LIB } from "../consts.ts"
import type { Node } from "../l1-types/types.ts"

import { promoteꓽto_node } from "./promote.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- promoteꓽto_node`, function () {
	it("should promote a string to an inline fragment node", () => {
		const result = promoteꓽto_node("hello")
		expect(result).to.deep.equal({
			$type: "fragmentⵧinline",
			$content: "hello",
		})
	})

	it("should promote a number to an inline fragment node with string content", () => {
		const result = promoteꓽto_node(42)
		expect(result).to.deep.equal({
			$type: "fragmentⵧinline",
			$content: "42",
		})
	})

	it("should pass through a valid Node unchanged", () => {
		const node: Node = { $content: "foo", $type: "strong" }
		const result = promoteꓽto_node(node)
		expect(result).to.equal(node) // same reference
	})

	it("should reject invalid objects", () => {
		expect(() => promoteꓽto_node({ foo: 42 } as any)).to.throw()
	})

	it("should reject non-object non-primitive values", () => {
		expect(() => promoteꓽto_node(null as any)).to.throw()
		expect(() => promoteꓽto_node(undefined as any)).to.throw()
		expect(() => promoteꓽto_node(true as any)).to.throw()
	})
})
