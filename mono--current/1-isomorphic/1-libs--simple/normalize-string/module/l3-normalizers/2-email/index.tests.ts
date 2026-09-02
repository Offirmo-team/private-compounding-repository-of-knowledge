/////////////////////

import { expect } from "chai"

import { LIB } from "../../consts.ts"

import { normalizeꓽemailⵧfull, normalizeꓽemailⵧreasonable } from "./index.ts"

////////////////////////////////////

describe(`${LIB} - email`, function () {
	describe("normalizeꓽemailⵧfull()", function () {
		context("when not correct", () => {
			it('should reject -- "abcd"', () => {
				const TEST_EMAIL = "abcd"
				expect(() => normalizeꓽemailⵧfull(TEST_EMAIL)).to.throw("Invalid email: no @")
			})

			it('should reject -- "abc@def@ghi"', () => {
				const TEST_EMAIL = "abc@def@ghi"
				expect(() => normalizeꓽemailⵧfull(TEST_EMAIL)).to.throw("Invalid email: more than one @")
			})

			it('should reject -- "@"', () => {
				const TEST_EMAIL = "@"
				expect(() => normalizeꓽemailⵧfull(TEST_EMAIL)).to.throw("Invalid email: bad domain")
			})
		})

		context("when correct", () => {
			it("should normalize -- googlemail", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Googlemail. Com"
				expect(normalizeꓽemailⵧfull(TEST_EMAIL)).to.equal("abcdefgh@gmail.com")
			})

			it("should normalize -- gmail", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Gmail. Com"
				expect(normalizeꓽemailⵧfull(TEST_EMAIL)).to.equal("abcdefgh@gmail.com")
			})

			it("should normalize -- hotmail", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Hotmail. Com"
				expect(normalizeꓽemailⵧfull(TEST_EMAIL)).to.equal("abcd.efgh@hotmail.com")
			})

			it("should normalize -- live", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Live. Com"
				expect(normalizeꓽemailⵧfull(TEST_EMAIL)).to.equal("abcdefgh@live.com")
			})

			it("should normalize -- outlook", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Outlook. Com"
				expect(normalizeꓽemailⵧfull(TEST_EMAIL)).to.equal("abcd.efgh@outlook.com")
			})

			it("should normalize -- other", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Foo. Com"
				expect(normalizeꓽemailⵧfull(TEST_EMAIL)).to.equal("abcd.efgh+ijkl@foo.com")
			})
		})
	})

	describe("normalizeꓽemailⵧreasonable()", function () {
		context("when not correct", () => {
			it('should reject -- "abcd"', () => {
				const TEST_EMAIL = "abcd"
				expect(() => normalizeꓽemailⵧreasonable(TEST_EMAIL)).to.throw("Invalid email: no @")
			})

			it('should reject -- "abc@def@ghi"', () => {
				const TEST_EMAIL = "abc@def@ghi"
				expect(() => normalizeꓽemailⵧreasonable(TEST_EMAIL)).to.throw("Invalid email: more than one @")
			})

			it('should reject -- "@"', () => {
				const TEST_EMAIL = "@"
				expect(() => normalizeꓽemailⵧreasonable(TEST_EMAIL)).to.throw("Invalid email: bad domain")
			})
		})

		context("when correct", () => {
			it("should normalize -- googlemail", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Googlemail. Com"
				expect(normalizeꓽemailⵧreasonable(TEST_EMAIL)).to.equal("abcd.efgh@gmail.com")
			})

			it("should normalize -- gmail", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Gmail. Com"
				expect(normalizeꓽemailⵧreasonable(TEST_EMAIL)).to.equal("abcd.efgh@gmail.com")
			})

			it("should normalize -- hotmail", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Hotmail. Com"
				expect(normalizeꓽemailⵧreasonable(TEST_EMAIL)).to.equal("abcd.efgh@hotmail.com")
			})

			it("should normalize -- live", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Live. Com"
				expect(normalizeꓽemailⵧreasonable(TEST_EMAIL)).to.equal("abcd.efgh@live.com")
			})

			it("should normalize -- outlook", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Outlook. Com"
				expect(normalizeꓽemailⵧreasonable(TEST_EMAIL)).to.equal("abcd.efgh@outlook.com")
			})

			it("should normalize -- other", () => {
				const TEST_EMAIL = "Abcd.Efgh+ijkl@Foo. Com"
				expect(normalizeꓽemailⵧreasonable(TEST_EMAIL)).to.equal("abcd.efgh+ijkl@foo.com")
			})
		})
	})
})
