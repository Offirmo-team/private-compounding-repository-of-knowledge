import { expect } from "chai"

import { assert, assert_from } from "@monorepo-private/assert"

/////////////////////////////////////////////////

describe(`assert lib`, function () {
	function set_hour(h: number): void {
		assert.pre(Number.isSafeInteger(h))
		assert.pre(h >= 0 && h <= 23, "hour must be between 0 and 23")
	}

	describe("generic behavior", function () {
		it("sandbox", () => {
			let foo: number = 0

			// failure with explicit message = not great, dev has work + can be outdated (like a comment)
			expect(() => assert(foo === 42, "foo should eq 42")).to.throw("Assertion failed: foo should eq 42!")
			// failure with auto message = not great, no mention of the bad object name
			expect(() => assert(foo)).to.throw("Assertion failed: should be a non-zero number!")

			let h = 12
			function add_hour(inc‿h: number): void {
				const ǃ = assert_from({ add_hour })
				ǃ.forⵧparam({ inc‿h }).require(Number.isSafeInteger(inc‿h), "isSafeInteger")
				ǃ.forⵧparam({ inc‿h }).require(inc‿h >= 0 && inc‿h <= 23, "should be between 0 and 23")

				h += inc‿h
				ǃ.forⵧvalue({ h }).ensure(h >= 0 && h <= 23, "should be between 0 and 23")
			}
			expect(() => add_hour(-1), "1").to.throw("add_hour(): Invalid argument: inc‿h should be between 0 and 23!")
			expect(() => add_hour(13), "2").to.throw("add_hour(): Post-condition failed: h should be between 0 and 23!")
		})

		it("should properly assert for TypeScript", () => {
			let foo: number | string = 42 as any // any = unknown

			function if_string() {
				assert(typeof foo === "string")
				foo.trim()
				// @ts-expect-error
				foo.toString(16)
			}

			function if_num() {
				assert(typeof foo === "number")
				foo.toString(16)
				// @ts-expect-error
				foo.trim()
			}
		})

		it.skip("should capture a correct stacktrace", () => {
			try {
				set_hour(-1)
				throw new Error("xxx")
			} catch (err: any) {
				console.log("before", err.stack)
				Error.captureStackTrace(err, assert.pre)
				console.log("after", err.stack) // no interest
			}
		})
	})

	describe("assert", function () {
		describe("assert()", function () {
			// TODO 1D test is propagate test info in TS

			const oud = assert

			it("should work in simplest form", () => {
				const foo: number = 42
				expect(() => oud(foo === 42, "foo should eq 42")).not.to.throw()
				expect(() => oud(foo === 43, "foo should eq 43")).to.throw("Assertion failed: foo should eq 43!")
			})

			it("auto-create a message for all types of falsy values", () => {
				expect(() => oud(false), "false").to.throw("Assertion failed: should be true!")
				expect(() => oud(undefined), "undefined").to.throw("Assertion failed: should be defined!")
				expect(() => oud(null), "null").to.throw("Assertion failed: should not be null!")
				expect(() => oud(0), "0").to.throw("Assertion failed: should be a non-zero number!")
				expect(() => oud(-0), "-0").to.throw("Assertion failed: should be a non-zero number!")
				expect(() => oud(0n), "0n").to.throw("Assertion failed: should be a non-zero BigInt!")
				expect(() => oud(""), "<empty string>").to.throw("Assertion failed: should be a non-empty string!")
				expect(() => oud(NaN), "NaN").to.throw("Assertion failed: should not be NaN!")
			})
		})

		it("should provide sugar to pre/post", () => {
			const foo: number | string = 42
			expect(() => assert(foo === 43, "foo should eq 43")).to.throw("Assertion failed: foo should eq 43!")
			expect(() => assert.pre(foo === 43, "foo should eq 43")).to.throw("Pre-condition failed: foo should eq 43!")
			expect(() => assert.post(foo === 43, "foo should eq 43")).to.throw("Post-condition failed: foo should eq 43!")
		})

		describe("assert.pre()", function () {
			const oud = assert.pre

			it("should work in simplest form", () => {
				const foo: number = 42
				expect(() => oud(foo === 42, "foo should eq 42")).not.to.throw()
				expect(() => oud(foo === 43, "foo should eq 43")).to.throw("Pre-condition failed: foo should eq 43!")
			})

			it("auto-create a message for all types of falsy values", () => {
				expect(() => oud(false), "false").to.throw("Pre-condition failed: should be true!")
				expect(() => oud(undefined), "undefined").to.throw("Pre-condition failed: should be defined!")
				expect(() => oud(null), "null").to.throw("Pre-condition failed: should not be null!")
				expect(() => oud(0), "0").to.throw("Pre-condition failed: should be a non-zero number!")
				expect(() => oud(-0), "-0").to.throw("Pre-condition failed: should be a non-zero number!")
				expect(() => oud(0n), "0n").to.throw("Pre-condition failed: should be a non-zero BigInt!")
				expect(() => oud(""), "<empty string>").to.throw("Pre-condition failed: should be a non-empty string!")
				expect(() => oud(NaN), "NaN").to.throw("Pre-condition failed: should not be NaN!")
			})
		})

		describe("assert.post()", function () {
			const oud = assert.post

			it("should work in simplest form", () => {
				const foo: number = 42
				expect(() => oud(foo === 42, "foo should eq 42")).not.to.throw()
				expect(() => oud(foo === 43, "foo should eq 43")).to.throw("Post-condition failed: foo should eq 43!")
			})

			it("auto-create a message for all types of falsy values", () => {
				expect(() => oud(false), "false").to.throw("Post-condition failed: should be true!")
				expect(() => oud(undefined), "undefined").to.throw("Post-condition failed: should be defined!")
				expect(() => oud(null), "null").to.throw("Post-condition failed: should not be null!")
				expect(() => oud(0), "0").to.throw("Post-condition failed: should be a non-zero number!")
				expect(() => oud(-0), "-0").to.throw("Post-condition failed: should be a non-zero number!")
				expect(() => oud(0n), "0n").to.throw("Post-condition failed: should be a non-zero BigInt!")
				expect(() => oud(""), "<empty string>").to.throw("Post-condition failed: should be a non-empty string!")
				expect(() => oud(NaN), "NaN").to.throw("Post-condition failed: should not be NaN!")
			})
		})
	})

	describe("assert_from() ", function () {
		it("when a description is provided, it is used in the error message", () => {
			let h = 12
			function add_hour__with_description(inc: number): void {
				const ǃ = assert_from({ add_hour__with_description })
				h += inc
				ǃ.forⵧvalue({ h }).ensure(h >= 0 && h <= 23, "should be between 0 and 23")
			}

			h = 12
			expect(() => add_hour__with_description(20), "with description").to.throw(
				"add_hour__with_description(): Post-condition failed: h should be between 0 and 23!",
			)
		})

		it("when a description is not provided, a generic one is generated", () => {
			let h = 12
			function add_hour__without_description(inc: number): void {
				const ǃ = assert_from({ add_hour__without_description })
				h += inc
				ǃ.forⵧvalue({ h }).ensure(h >= 0 && h <= 23)
			}

			h = 12
			expect(() => add_hour__without_description(20), "without description").to.throw(
				"add_hour__without_description(): Post-condition failed: assertion about h should be true!",
			)
		})
	})

	describe("thrown error objects", function () {
		function capture_thrown_error(fn: () => void): any {
			try {
				fn()
			} catch (err) {
				return err
			}
			throw new Error("expected the assertion to throw, but it did not")
		}

		it("stay instanceof Error and expose the correct subclass .name", () => {
			const err = capture_thrown_error(() => assert(false))
			expect(err).to.be.an.instanceof(Error)
			expect(err.name, "assert").to.equal("AssertionFailed")

			expect(capture_thrown_error(() => assert.pre(false)).name, "pre").to.equal("PreconditionError")
			expect(capture_thrown_error(() => assert.post(false)).name, "post").to.equal("PostconditionError")

			function f(x: unknown): void {
				const ǃ = assert_from({ f })
				ǃ.forⵧparam({ x }).require(false)
			}
			expect(capture_thrown_error(() => f(1)).name, "param").to.equal("ArgumentError")
		})
	})
})
