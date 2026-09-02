import { expect } from "chai"

import { LIB } from "../consts.ts"

import type { Node } from "./types.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- types`, function () {
	describe("Node", function () {
		it("should be lax with properties", () => {
			const n1: Node = {}
			const n2a: Node = { $content: "foo" }
			const n2b: Node = { $content: ["foo"] }
		})

		it("should not accept extra properties", () => {
			// @ts-expect-error TS2322
			const n: Node = { foo: 42 }
		})
	})
})
