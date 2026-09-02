import { expect } from "chai"

import { isꓽobjectⵧliteral, isꓽnegative_zero, isꓽexact_stringified_number } from "./index.ts"

describe("@monorepo-private/type-detection -- primitives", function () {
	describe("isꓽnegative_zero()", function () {
		it("should work", () => {
			// completely unrelated types
			// @ts-expect-error
			expect(isꓽnegative_zero(null)).to.be.false
			// @ts-expect-error
			expect(isꓽnegative_zero(undefined)).to.be.false
			// @ts-expect-error
			expect(isꓽnegative_zero("foo")).to.be.false
			// @ts-expect-error
			expect(isꓽnegative_zero(["foo"])).to.be.false
			// @ts-expect-error
			expect(isꓽnegative_zero({ a: 1 })).to.be.false

			// closer types
			expect(isꓽnegative_zero(NaN)).to.be.false
			expect(isꓽnegative_zero(5)).to.be.false
			expect(isꓽnegative_zero(0)).to.be.false

			// final
			expect(isꓽnegative_zero(-0)).to.be.true
		})
	})

	describe("isꓽobjectⵧliteral()", function () {
		it("should work", () => {
			// completely unrelated types
			expect(isꓽobjectⵧliteral(null)).to.be.false
			expect(isꓽobjectⵧliteral(undefined)).to.be.false
			expect(isꓽobjectⵧliteral(NaN)).to.be.false
			expect(isꓽobjectⵧliteral(5)).to.be.false
			expect(isꓽobjectⵧliteral("foo")).to.be.false

			// closer types
			expect(isꓽobjectⵧliteral(["foo"])).to.be.false
			expect(isꓽobjectⵧliteral(new Boolean(1)), "primitive wrapper -- bool").to.be.false
			expect(isꓽobjectⵧliteral(new String("foo")), "primitive wrapper -- string").to.be.false
			expect(isꓽobjectⵧliteral(/regex/), "regex").to.be.false

			// final
			expect(isꓽobjectⵧliteral({})).to.be.true
			expect(isꓽobjectⵧliteral({ foo: 42 })).to.be.true
		})
	})

	describe("isꓽexact_stringified_number()", function () {
		it("should work", () => {
			// completely unrelated types
			expect(isꓽexact_stringified_number(null as any)).to.be.false
			expect(isꓽexact_stringified_number(undefined as any)).to.be.false
			expect(isꓽexact_stringified_number(NaN as any)).to.be.false
			expect(isꓽexact_stringified_number(5 as any)).to.be.false
			expect(isꓽexact_stringified_number("foo")).to.be.false

			// closer types
			expect(isꓽexact_stringified_number("01")).to.be.false
			expect(isꓽexact_stringified_number("42b")).to.be.false
			expect(isꓽexact_stringified_number("0.10")).to.be.false
			expect(isꓽexact_stringified_number("NaN")).to.be.false // bc NOT a number

			// final
			expect(isꓽexact_stringified_number("42")).to.be.true
			expect(isꓽexact_stringified_number("0.1")).to.be.true
		})
	})
})
