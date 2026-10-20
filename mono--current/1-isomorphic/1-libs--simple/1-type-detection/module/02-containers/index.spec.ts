import { describe, it, expect } from "vitest"

import type { Immutable } from "@monorepo-private/ts--types"

import { isꓽarrayⵧempty, isꓽobjectⵧplainⵧempty, isꓽcontainerⵧempty, hasꓽcontent } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/type-detection -- containers", () => {
	describe("isꓽarrayⵧempty()", () => {
		it("should work", () => {
			// completely unrelated types
			// @ts-expect-error
			expect(isꓽarrayⵧempty(null)).toBe(false)
			// @ts-expect-error
			expect(isꓽarrayⵧempty(undefined)).toBe(false)
			// @ts-expect-error
			expect(isꓽarrayⵧempty(NaN)).toBe(false)
			// @ts-expect-error
			expect(isꓽarrayⵧempty(5)).toBe(false)
			// @ts-expect-error
			expect(isꓽarrayⵧempty("foo")).toBe(false)
			// @ts-expect-error
			expect(isꓽarrayⵧempty(new Boolean(1))).toBe(false)

			// closer types
			expect(isꓽarrayⵧempty(["foo"])).toBe(false)
			expect(isꓽarrayⵧempty([,])).toBe(false)

			// final
			expect(isꓽarrayⵧempty([])).toBe(true)
		})
	})

	describe("isꓽobjectⵧempty()", () => {
		it("should work", () => {
			// completely unrelated types
			// @ts-expect-error
			expect(isꓽobjectⵧplainⵧempty(null), "null").toBe(false)
			// @ts-expect-error
			expect(isꓽobjectⵧplainⵧempty(undefined), "undefined").toBe(false)
			// @ts-expect-error
			expect(isꓽobjectⵧplainⵧempty(NaN), "NaN").toBe(false)
			// @ts-expect-error
			expect(isꓽobjectⵧplainⵧempty(5), "number").toBe(false)
			// @ts-expect-error
			expect(isꓽobjectⵧplainⵧempty(""), "empty str").toBe(false)

			// closer types
			expect(isꓽobjectⵧplainⵧempty([]), "empty arr").toBe(false)

			// final
			expect(isꓽobjectⵧplainⵧempty({}), "empty obj").toBe(true)
			expect(isꓽobjectⵧplainⵧempty({ foo: 42 }), "NOT empty obj").toBe(false)
			expect(isꓽobjectⵧplainⵧempty(new Boolean(1)), "NOT object literal").toBe(false)
		})
	})

	describe("isꓽcontainerⵧempty()", () => {
		it("should work", () => {
			// completely unrelated types
			// @ts-expect-error
			expect(isꓽcontainerⵧempty(null)).toBe(false)
			// @ts-expect-error
			expect(isꓽcontainerⵧempty(undefined)).toBe(false)
			// @ts-expect-error
			expect(isꓽcontainerⵧempty(NaN)).toBe(false)
			// @ts-expect-error
			expect(isꓽcontainerⵧempty(5)).toBe(false)
			// @ts-expect-error
			expect(isꓽcontainerⵧempty("foo")).toBe(false)

			// closer types
			expect(isꓽcontainerⵧempty(["foo"]), "non-empty array").toBe(false)
			expect(isꓽcontainerⵧempty({ foo: 42 }), "non-empty obj literal").toBe(false)

			// final
			expect(isꓽcontainerⵧempty([]), "arr").toBe(true)
			expect(isꓽcontainerⵧempty({}), "obj").toBe(true)
		})
	})

	describe("hasꓽcontent()", () => {
		it("should work -- numbers", () => {
			expect(hasꓽcontent(0)).toBe(false)
			expect(hasꓽcontent(-0)).toBe(false)
			expect(hasꓽcontent(0)).toBe(false)
			expect(hasꓽcontent(NaN)).toBe(false)

			expect(hasꓽcontent(1)).toBe(true)
		})

		it("should work -- strings", () => {
			expect(hasꓽcontent("")).toBe(false)
			expect(hasꓽcontent(" ")).toBe(true)
		})

		it("should work -- arrays", () => {
			expect(hasꓽcontent([]), "empty array").toBe(false)
			//expect(hasꓽcontent([,]), 'sparse').toBe(false)
			expect(hasꓽcontent([0]), "NON empty arr").toBe(true)
		})

		it("should work -- objects", () => {
			expect(hasꓽcontent({})).toBe(false)
			expect(hasꓽcontent({ "": 0 })).toBe(true)
		})
	})
})
