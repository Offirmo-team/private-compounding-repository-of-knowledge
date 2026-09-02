import { expect } from "chai"

import { assertꓽshape } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/type-detection -- shape", function () {
	describe("assertꓽshape()", function () {
		const REFERENCE = {
			foo: "bar",
			baz: 42,
		}
		const MATCHING__EXACT = {
			// same props, same types
			foo: "baz",
			baz: -1,
		}
		const MATCHING__WITH_EXTRA = {
			...MATCHING__EXACT,
			gloups: "gnokman", // extra prop
		}
		const MATCHING__PARTIAL = {
			foo: "baz", // only one prop
		}
		const MATCHING__PARTIAL__WITH_EXTRA = {
			foo: "baz", // only one prop
			gloups: "gnokman", // extra prop
		}

		const NOT_MATCHING__TYPE = {
			foo: "baz",
			baz: "oh no!",
		}

		describe("default", function () {
			it("should work", () => {
				// should always match
				expect(() => assertꓽshape(REFERENCE, MATCHING__EXACT), "MATCHING__EXACT").to.not.throw()

				// extra allowed by default
				expect(() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA), "MATCHING__WITH_EXTRA").to.not.throw()

				// partial not allowed by default
				expect(() => assertꓽshape(REFERENCE, MATCHING__PARTIAL), "MATCHING__PARTIAL").to.throw()
				expect(
					() => assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA),
					"MATCHING__PARTIAL__WITH_EXTRA",
				).to.throw()

				// mismatching type
				expect(() => assertꓽshape(REFERENCE, NOT_MATCHING__TYPE), "NOT_MATCHING__TYPE").to.throw()
			})
		})

		it("should work -- allow_extra_props = true", () => {
			const allow_extra_props = true
			expect(
				() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { allow_extra_props }),
				"MATCHING__WITH_EXTRA",
			).to.not.throw()
			expect(
				() =>
					assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA, {
						allow_extra_props,
						match_reference_props: "some",
					}),
				"MATCHING__PARTIAL__WITH_EXTRA",
			).to.not.throw()
		})

		it("should work -- allow_extra_props = false", () => {
			const allow_extra_props = false
			expect(() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { allow_extra_props })).to.throw("gloups")
			expect(() =>
				assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA, {
					allow_extra_props,
					match_reference_props: "some",
				}),
			).to.throw("gloups")
		})

		it("should work -- match_reference_props = some", () => {
			const match_reference_props = "some"

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__EXACT, { match_reference_props }),
				"MATCHING__EXACT",
			).to.not.throw()

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { match_reference_props }),
				"MATCHING__WITH_EXTRA",
			).to.not.throw()

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__PARTIAL, { match_reference_props }),
				"MATCHING__PARTIAL",
			).to.not.throw()
			expect(
				() => assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA, { match_reference_props }),
				"MATCHING__PARTIAL__WITH_EXTRA",
			).to.not.throw()

			expect(
				() => assertꓽshape(REFERENCE, NOT_MATCHING__TYPE, { match_reference_props }),
				"NOT_MATCHING__TYPE",
			).to.throw()
		})

		it("[BUG] should report the actual extra key in the error message when allow_extra_props=false", () => {
			try {
				assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { allow_extra_props: false })
				expect.fail("should have thrown")
			} catch (err: any) {
				expect(err.message).to.include("extraneous")
				// The error message should mention "EXTRA_KEY" (the actual extra key), not "foo" (a ref key)
				expect(err.message, "error message should cite the extra key, not a ref key").to.include("gloups")
			}
		})

		it("should work -- match_reference_props = all", () => {
			const match_reference_props = "all"

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__EXACT, { match_reference_props }),
				"MATCHING__EXACT",
			).to.not.throw()

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { match_reference_props }),
				"MATCHING__WITH_EXTRA",
			).to.not.throw()

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__PARTIAL, { match_reference_props }),
				"MATCHING__PARTIAL",
			).to.throw()
			expect(
				() => assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA, { match_reference_props }),
				"MATCHING__PARTIAL__WITH_EXTRA",
			).to.throw()

			expect(
				() => assertꓽshape(REFERENCE, NOT_MATCHING__TYPE, { match_reference_props }),
				"NOT_MATCHING__TYPE",
			).to.throw()
		})
	})
})
