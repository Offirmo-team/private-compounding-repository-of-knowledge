/////////////////////////////////////////////////

describe("@monorepo-private/practical-logger--types", () => {
	describe("types", () => {
		it("should compile with no errors and have no runtime exports", () => {
			expect(Object.keys(lib)).toStrictEqual([])
		})
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import * as lib from "./index.ts"
