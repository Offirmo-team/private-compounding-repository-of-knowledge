import { describe, it, expect } from "vitest"

import { assertꓽshape } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/type-detection -- shape", () => {
	describe("assertꓽshape()", () => {
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

		describe("default", () => {
			it("should work", () => {
				// should always match
				expect(() => assertꓽshape(REFERENCE, MATCHING__EXACT), "MATCHING__EXACT").not.toThrow()

				// extra allowed by default
				expect(() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA), "MATCHING__WITH_EXTRA").not.toThrow()

				// partial not allowed by default
				expect(() => assertꓽshape(REFERENCE, MATCHING__PARTIAL), "MATCHING__PARTIAL").toThrow()
				expect(
					() => assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA),
					"MATCHING__PARTIAL__WITH_EXTRA",
				).toThrow()

				// mismatching type
				expect(() => assertꓽshape(REFERENCE, NOT_MATCHING__TYPE), "NOT_MATCHING__TYPE").toThrow()
			})
		})

		it("should work -- allow_extra_props = true", () => {
			const allow_extra_props = true
			expect(
				() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { allow_extra_props }),
				"MATCHING__WITH_EXTRA",
			).not.toThrow()
			expect(
				() =>
					assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA, {
						allow_extra_props,
						match_reference_props: "some",
					}),
				"MATCHING__PARTIAL__WITH_EXTRA",
			).not.toThrow()
		})

		it("should work -- allow_extra_props = false", () => {
			const allow_extra_props = false
			expect(() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { allow_extra_props })).toThrow("gloups")
			expect(() =>
				assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA, {
					allow_extra_props,
					match_reference_props: "some",
				}),
			).toThrow("gloups")
		})

		it("should work -- match_reference_props = some", () => {
			const match_reference_props = "some"

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__EXACT, { match_reference_props }),
				"MATCHING__EXACT",
			).not.toThrow()

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { match_reference_props }),
				"MATCHING__WITH_EXTRA",
			).not.toThrow()

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__PARTIAL, { match_reference_props }),
				"MATCHING__PARTIAL",
			).not.toThrow()
			expect(
				() => assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA, { match_reference_props }),
				"MATCHING__PARTIAL__WITH_EXTRA",
			).not.toThrow()

			expect(
				() => assertꓽshape(REFERENCE, NOT_MATCHING__TYPE, { match_reference_props }),
				"NOT_MATCHING__TYPE",
			).toThrow()
		})

		it("[BUG] should report the actual extra key in the error message when allow_extra_props=false", () => {
			const assert_with_extra_prop = () =>
				assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { allow_extra_props: false })

			expect(assert_with_extra_prop).toThrow("extraneous")
			// The error message should mention "EXTRA_KEY" (the actual extra key), not "foo" (a ref key)
			expect(assert_with_extra_prop, "error message should cite the extra key, not a ref key").toThrow("gloups")
		})

		it("should work -- match_reference_props = all", () => {
			const match_reference_props = "all"

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__EXACT, { match_reference_props }),
				"MATCHING__EXACT",
			).not.toThrow()

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__WITH_EXTRA, { match_reference_props }),
				"MATCHING__WITH_EXTRA",
			).not.toThrow()

			expect(
				() => assertꓽshape(REFERENCE, MATCHING__PARTIAL, { match_reference_props }),
				"MATCHING__PARTIAL",
			).toThrow()
			expect(
				() => assertꓽshape(REFERENCE, MATCHING__PARTIAL__WITH_EXTRA, { match_reference_props }),
				"MATCHING__PARTIAL__WITH_EXTRA",
			).toThrow()

			expect(
				() => assertꓽshape(REFERENCE, NOT_MATCHING__TYPE, { match_reference_props }),
				"NOT_MATCHING__TYPE",
			).toThrow()
		})
	})
})
