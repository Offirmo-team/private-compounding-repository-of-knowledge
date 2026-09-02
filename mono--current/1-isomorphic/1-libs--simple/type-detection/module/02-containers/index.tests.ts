import { expect } from "chai"

import type { Immutable } from "@monorepo-private/ts--types"

import { isꓽarrayⵧempty, isꓽobjectⵧliteralⵧempty, isꓽcontainerⵧempty, hasꓽcontent } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/type-detection -- containers", function () {
	describe("isꓽarrayⵧempty()", function () {
		it("should work", () => {
			// completely unrelated types
			// @ts-expect-error
			expect(isꓽarrayⵧempty(null)).to.be.false
			// @ts-expect-error
			expect(isꓽarrayⵧempty(undefined)).to.be.false
			// @ts-expect-error
			expect(isꓽarrayⵧempty(NaN)).to.be.false
			// @ts-expect-error
			expect(isꓽarrayⵧempty(5)).to.be.false
			// @ts-expect-error
			expect(isꓽarrayⵧempty("foo")).to.be.false
			// @ts-expect-error
			expect(isꓽarrayⵧempty(new Boolean(1))).to.be.false

			// closer types
			expect(isꓽarrayⵧempty(["foo"])).to.be.false
			expect(isꓽarrayⵧempty([,])).to.be.false

			// final
			expect(isꓽarrayⵧempty([])).to.be.true
		})
	})

	describe("isꓽobjectⵧempty()", function () {
		it("should work", () => {
			// completely unrelated types
			// @ts-expect-error
			expect(isꓽobjectⵧliteralⵧempty(null), "null").to.be.false
			// @ts-expect-error
			expect(isꓽobjectⵧliteralⵧempty(undefined), "undefined").to.be.false
			// @ts-expect-error
			expect(isꓽobjectⵧliteralⵧempty(NaN), "NaN").to.be.false
			// @ts-expect-error
			expect(isꓽobjectⵧliteralⵧempty(5), "number").to.be.false
			// @ts-expect-error
			expect(isꓽobjectⵧliteralⵧempty(""), "empty str").to.be.false

			// closer types
			expect(isꓽobjectⵧliteralⵧempty([]), "empty arr").to.be.false

			// final
			expect(isꓽobjectⵧliteralⵧempty({}), "empty obj").to.be.true
			expect(isꓽobjectⵧliteralⵧempty({ foo: 42 }), "NOT empty obj").to.be.false
			expect(isꓽobjectⵧliteralⵧempty(new Boolean(1)), "NOT object literal").to.be.false
		})
	})

	describe("isꓽcontainerⵧempty()", function () {
		it("should work", () => {
			// completely unrelated types
			// @ts-expect-error
			expect(isꓽcontainerⵧempty(null)).to.be.false
			// @ts-expect-error
			expect(isꓽcontainerⵧempty(undefined)).to.be.false
			// @ts-expect-error
			expect(isꓽcontainerⵧempty(NaN)).to.be.false
			// @ts-expect-error
			expect(isꓽcontainerⵧempty(5)).to.be.false
			// @ts-expect-error
			expect(isꓽcontainerⵧempty("foo")).to.be.false

			// closer types
			expect(isꓽcontainerⵧempty(["foo"]), "non-empty array").to.be.false
			expect(isꓽcontainerⵧempty({ foo: 42 }), "non-empty obj literal").to.be.false

			// final
			expect(isꓽcontainerⵧempty([]), "arr").to.be.true
			expect(isꓽcontainerⵧempty({}), "obj").to.be.true
		})
	})

	describe("hasꓽcontent()", function () {
		it("should work -- numbers", () => {
			expect(hasꓽcontent(0)).to.be.false
			expect(hasꓽcontent(-0)).to.be.false
			expect(hasꓽcontent(0)).to.be.false
			expect(hasꓽcontent(NaN)).to.be.false

			expect(hasꓽcontent(1)).to.be.true
		})

		it("should work -- strings", () => {
			expect(hasꓽcontent("")).to.be.false
			expect(hasꓽcontent(" ")).to.be.true
		})

		it("should work -- arrays", () => {
			expect(hasꓽcontent([]), "empty array").to.be.false
			//expect(hasꓽcontent([,]), 'sparse').to.be.false
			expect(hasꓽcontent([0]), "NON empty arr").to.be.true
		})

		it("should work -- objects", () => {
			expect(hasꓽcontent({})).to.be.false
			expect(hasꓽcontent({ "": 0 })).to.be.true
		})
	})
})
