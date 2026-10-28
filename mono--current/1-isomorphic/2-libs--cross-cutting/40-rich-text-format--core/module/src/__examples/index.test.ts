/////////////////////////////////////////////////

describe(`${LIB} -- examples`, () => {
	describe("complete nodes", () => {
		it.each(Object.entries({ $EXAMPLE_COMPLETE_NODEⵧBLOCK, $EXAMPLE_COMPLETE_NODEⵧINLINE }))(
			"%s should satisfy the node invariants",
			(_name, $node) => {
				expect(() => assertꓽNodeInvariants($node)).not.toThrow()
			},
		)
	})

	describe("all exported examples", () => {
		it.each(Object.entries(EXAMPLES))("%s should satisfy the node invariants", (_name, $example) => {
			assert(!isꓽNodeⳇPromotable($example), "examples should be full nodes, not primitives")
			expect(() => assertꓽNodeInvariants($example)).not.toThrow()
		})
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import { assert } from "@monorepo-private/assert"

import { LIB } from "../consts.ts"
import { assertꓽNodeInvariants, isꓽNodeⳇPromotable } from "../l1-types/index.ts"

import * as EXAMPLES from "./index.ts"
import { $EXAMPLE_COMPLETE_NODEⵧBLOCK, $EXAMPLE_COMPLETE_NODEⵧINLINE } from "./index.ts"
