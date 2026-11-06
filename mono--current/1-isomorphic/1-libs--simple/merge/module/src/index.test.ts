import { describe, it, expect } from "vitest"

import { freezeⵧdeep } from "@monorepo-private/freeze"

import { mergeⵧdeepⵧno_conflict } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/merge", () => {
	describe("mergeⵧdeepⵧno_conflict()", () => {
		describe("handling of undefined (= unknown/missing, yields to the other value)", () => {
			it("should return the other side as-is (no copy)", () => {
				const x = freezeⵧdeep({ x: 1 })
				expect(mergeⵧdeepⵧno_conflict<any>(x, undefined)).toBe(x)
				expect(mergeⵧdeepⵧno_conflict<any>(undefined, x)).toBe(x)
				expect(mergeⵧdeepⵧno_conflict<any>(undefined, undefined)).toBeUndefined()
			})
		})

		describe("primitives", () => {
			it("should accept identical primitives", () => {
				expect(mergeⵧdeepⵧno_conflict<any>("foo", "foo")).toBe("foo")
				expect(mergeⵧdeepⵧno_conflict<any>(null, null)).toBeNull()
			})

			it("should throw on conflicting primitives", () => {
				expect(() => mergeⵧdeepⵧno_conflict<any>(1, 2)).toThrow("conflicting")
				expect(() => mergeⵧdeepⵧno_conflict<any>("1", 1)).toThrow("conflicting")
				expect(() => mergeⵧdeepⵧno_conflict<any>(42, null)).toThrow("conflicting")
			})
		})

		describe("mismatched types (should throw)", () => {
			it("should throw when merging null with a container", () => {
				expect(() => mergeⵧdeepⵧno_conflict<any>(null, freezeⵧdeep({ x: 1 }))).toThrow("different JSON types")
				expect(() => mergeⵧdeepⵧno_conflict<any>(freezeⵧdeep([1]), null)).toThrow("different JSON types")
			})

			it("should throw when merging an array with an object", () => {
				expect(() => mergeⵧdeepⵧno_conflict<any>(freezeⵧdeep([1]), freezeⵧdeep({ x: 1 }))).toThrow(
					"different JSON types",
				)
			})

			it("should throw on non-JSON values", () => {
				expect(() => mergeⵧdeepⵧno_conflict<any>(new Date(), new Date())).toThrow("Incorrect JSON")
				expect(() =>
					mergeⵧdeepⵧno_conflict<any>(
						() => 1,
						() => 1,
					),
				).toThrow("Incorrect JSON")
			})
		})

		describe("arrays (merged with deduplication by value ===)", () => {
			it("should merge and deduplicate", () => {
				expect(mergeⵧdeepⵧno_conflict<any>(freezeⵧdeep(["a", "b"]), freezeⵧdeep(["b", "c"]))).toStrictEqual([
					"a",
					"b",
					"c",
				])
			})
		})

		describe("plain objects", () => {
			it("should merge nested objects recursively, with sorted keys", () => {
				const a = freezeⵧdeep({ z: 1, nested: { y: 2 } })
				const b = freezeⵧdeep({ a: 3, nested: { x: 4, y: 2 } })
				const result = mergeⵧdeepⵧno_conflict<any>(a, b)
				expect(result).toStrictEqual({ a: 3, nested: { x: 4, y: 2 }, z: 1 })
				expect(Object.keys(result)).toStrictEqual(["a", "nested", "z"])
				expect(Object.keys(result.nested)).toStrictEqual(["x", "y"])
			})

			it("should throw on a nested conflict", () => {
				const a = freezeⵧdeep({ tools: { turbo: "latest" } })
				const b = freezeⵧdeep({ tools: { turbo: "2.0" } })
				expect(() => mergeⵧdeepⵧno_conflict<any>(a, b)).toThrow("conflicting")
			})
		})
	})
})
