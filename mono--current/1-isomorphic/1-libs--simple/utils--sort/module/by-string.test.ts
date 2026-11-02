/////////////////////////////////////////////////

describe("@monorepo-private/utils--sort -- by string", () => {
	describe("compareꓽstringsⵧfast_good_enough()", () => {
		it("should follow the comparator contract", () => {
			expect(compareꓽstringsⵧfast_good_enough("a", "a")).toBe(0)
			expect(compareꓽstringsⵧfast_good_enough("a", "b")).toBeLessThan(0)
			expect(compareꓽstringsⵧfast_good_enough("b", "a")).toBeGreaterThan(0)
			expect(compareꓽstringsⵧfast_good_enough("", "a")).toBeLessThan(0)
		})

		it("should sort", () => {
			expect(["b/", "a/b/", "a/", "c"].toSorted(compareꓽstringsⵧfast_good_enough)).toEqual(["a/", "a/b/", "b/", "c"])
		})

		it("should NOT be locale-aware (documented limitations)", () => {
			expect(["a", "B"].toSorted(compareꓽstringsⵧfast_good_enough)).toEqual(["B", "a"])
			expect(["9-foo", "10-foo"].toSorted(compareꓽstringsⵧfast_good_enough)).toEqual(["10-foo", "9-foo"])
		})
	})
})

/////////////////////////////////////////////////

import { describe, it, expect } from "vitest"

import { compareꓽstringsⵧfast_good_enough } from "./by-string.ts"
