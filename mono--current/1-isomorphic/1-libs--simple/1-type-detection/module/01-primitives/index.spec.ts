import { describe, it, expect } from "vitest"

import { isꓽobjectⵧplain, isꓽnegative_zero, isꓽexact_stringified_number } from "./index.ts"

describe("@monorepo-private/type-detection -- primitives", () => {
	describe("isꓽnegative_zero()", () => {
		it("should work", () => {
			// completely unrelated types
			// @ts-expect-error
			expect(isꓽnegative_zero(null)).toBe(false)
			// @ts-expect-error
			expect(isꓽnegative_zero(undefined)).toBe(false)
			// @ts-expect-error
			expect(isꓽnegative_zero("foo")).toBe(false)
			// @ts-expect-error
			expect(isꓽnegative_zero(["foo"])).toBe(false)
			// @ts-expect-error
			expect(isꓽnegative_zero({ a: 1 })).toBe(false)

			// closer types
			expect(isꓽnegative_zero(NaN)).toBe(false)
			expect(isꓽnegative_zero(5)).toBe(false)
			expect(isꓽnegative_zero(0)).toBe(false)

			// final
			expect(isꓽnegative_zero(-0)).toBe(true)
		})
	})

	describe("isꓽobjectⵧplain()", () => {
		it("should work", () => {
			// completely unrelated types
			expect(isꓽobjectⵧplain(null)).toBe(false)
			expect(isꓽobjectⵧplain(undefined)).toBe(false)
			expect(isꓽobjectⵧplain(NaN)).toBe(false)
			expect(isꓽobjectⵧplain(5)).toBe(false)
			expect(isꓽobjectⵧplain("foo")).toBe(false)

			// closer types
			expect(isꓽobjectⵧplain(["foo"])).toBe(false)
			expect(isꓽobjectⵧplain(new Boolean(1)), "primitive wrapper -- bool").toBe(false)
			expect(isꓽobjectⵧplain(new String("foo")), "primitive wrapper -- string").toBe(false)
			expect(isꓽobjectⵧplain(/regex/), "regex").toBe(false)

			// final
			expect(isꓽobjectⵧplain({})).toBe(true)
			expect(isꓽobjectⵧplain({ foo: 42 })).toBe(true)
		})
	})

	describe("isꓽexact_stringified_number()", () => {
		it("should work", () => {
			// completely unrelated types
			expect(isꓽexact_stringified_number(null as any)).toBe(false)
			expect(isꓽexact_stringified_number(undefined as any)).toBe(false)
			expect(isꓽexact_stringified_number(NaN as any)).toBe(false)
			expect(isꓽexact_stringified_number(5 as any)).toBe(false)
			expect(isꓽexact_stringified_number("foo")).toBe(false)

			// closer types
			expect(isꓽexact_stringified_number("01")).toBe(false)
			expect(isꓽexact_stringified_number("42b")).toBe(false)
			expect(isꓽexact_stringified_number("0.10")).toBe(false)
			expect(isꓽexact_stringified_number("NaN")).toBe(false) // bc NOT a number

			// final
			expect(isꓽexact_stringified_number("42")).toBe(true)
			expect(isꓽexact_stringified_number("0.1")).toBe(true)
		})
	})
})
