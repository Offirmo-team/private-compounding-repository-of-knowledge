import { describe, it, expect } from "vitest"

import { freezeⵧdeep } from "@monorepo-private/freeze"

import { mergeⵧdeep } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/merge", () => {
	describe("mergeⵧdeep()", () => {
		describe("handling of undefined (= unknown/missing, yields to previous defined value)", () => {
			it("should return a when b is undefined", () => {
				expect(mergeⵧdeep<any>(42, undefined)).toBe(42)
			})

			it("should return b when a is undefined", () => {
				expect(mergeⵧdeep<any>(undefined, 42)).toBe(42)
			})

			it("should handle both undefined", () => {
				expect(mergeⵧdeep<any>(undefined, undefined)).toBeUndefined()
			})
		})

		describe("handling of null (= intentional, does NOT yield to undefined but yields to a previous defined value)", () => {
			it("should return null when a is null and b is undefined", () => {
				expect(mergeⵧdeep<any>(null, undefined)).toBeNull()
			})

			it("should return null when b is null and a is undefined", () => {
				expect(mergeⵧdeep<any>(undefined, null)).toBeNull()
			})

			it("should return null when both are null", () => {
				expect(mergeⵧdeep<any>(null, null)).toBeNull()
			})

			it("should not yield to a previous defined value", () => {
				expect(mergeⵧdeep<any>(42, null)).toBeNull()
			})

			it("should be overridden by b when b is a defined value", () => {
				expect(mergeⵧdeep<any>(null, 42)).toBe(42)
			})
		})

		describe("primitives", () => {
			it("should return b when both are defined primitives (b wins)", () => {
				expect(mergeⵧdeep<any>("foo", "bar")).toBe("bar")
			})

			it("should work with numbers", () => {
				expect(mergeⵧdeep<any>(1, 2)).toBe(2)
			})

			it("should work with booleans", () => {
				expect(mergeⵧdeep<any>(true, false)).toBe(false)
			})
		})

		describe("plain objects", () => {
			it("should merge two simple objects", () => {
				const a = freezeⵧdeep({ x: 1 })
				const b = freezeⵧdeep({ y: 2 })
				expect(mergeⵧdeep<any>(a, b)).toStrictEqual({ x: 1, y: 2 })
			})

			it("should let b override a for overlapping keys", () => {
				const a = freezeⵧdeep({ x: 1, y: 2 })
				const b = freezeⵧdeep({ y: 3 })
				expect(mergeⵧdeep<any>(a, b)).toStrictEqual({ x: 1, y: 3 })
			})

			it("should skip undefined values in b (yielding to a)", () => {
				const a = freezeⵧdeep({ x: 1, y: 2 })
				const b = freezeⵧdeep({ y: undefined })
				expect(mergeⵧdeep<any>(a, b)).toStrictEqual({ x: 1, y: 2 })
			})

			it("should NOT skip null values in b when a has a defined value", () => {
				const a = freezeⵧdeep({ x: 1, y: 2 })
				const b = freezeⵧdeep({ y: null })
				expect(mergeⵧdeep<any>(a, b)).toStrictEqual({ x: 1, y: null })
			})

			it("should keep null values in b when a has undefined for that key", () => {
				const a = freezeⵧdeep({ x: 1, y: undefined })
				const b = freezeⵧdeep({ y: null })
				expect(mergeⵧdeep<any>(a, b)).toStrictEqual({ x: 1, y: null })
			})

			it("should merge nested objects recursively", () => {
				const a = freezeⵧdeep({ nested: { x: 1, y: 2 } })
				const b = freezeⵧdeep({ nested: { y: 3, z: 4 } })
				expect(mergeⵧdeep<any>(a, b)).toStrictEqual({ nested: { x: 1, y: 3, z: 4 } })
			})

			it("should merge deeply nested objects", () => {
				const a = freezeⵧdeep({ l1: { l2: { l3: { x: 1 } } } })
				const b = freezeⵧdeep({ l1: { l2: { l3: { y: 2 } } } })
				expect(mergeⵧdeep<any>(a, b)).toStrictEqual({ l1: { l2: { l3: { x: 1, y: 2 } } } })
			})
		})

		describe("arrays (merged with deduplication by value ===)", () => {
			it("should merge arrays and deduplicate by value", () => {
				expect(mergeⵧdeep<any>(freezeⵧdeep([1, 2, 3]), freezeⵧdeep([2, 3, 4]))).toStrictEqual([1, 2, 3, 4])
			})

			it("should handle identical arrays", () => {
				expect(mergeⵧdeep<any>(freezeⵧdeep([1, 2]), freezeⵧdeep([1, 2]))).toStrictEqual([1, 2])
			})

			it("should handle disjoint arrays", () => {
				expect(mergeⵧdeep<any>(freezeⵧdeep([1, 2]), freezeⵧdeep([3, 4]))).toStrictEqual([1, 2, 3, 4])
			})

			it("should handle empty arrays", () => {
				expect(mergeⵧdeep<any>(freezeⵧdeep([]), freezeⵧdeep([1, 2]))).toStrictEqual([1, 2])
				expect(mergeⵧdeep<any>(freezeⵧdeep([1, 2]), freezeⵧdeep([]))).toStrictEqual([1, 2])
				expect(mergeⵧdeep<any>(freezeⵧdeep([]), freezeⵧdeep([]))).toStrictEqual([])
			})

			it("should deduplicate strings", () => {
				expect(mergeⵧdeep<any>(freezeⵧdeep(["a", "b"]), freezeⵧdeep(["b", "c"]))).toStrictEqual(["a", "b", "c"])
			})

			it("should NOT deduplicate objects (=== comparison)", () => {
				const obj1 = freezeⵧdeep({ x: 1 })
				const obj2 = freezeⵧdeep({ x: 1 })
				const result = mergeⵧdeep(freezeⵧdeep([obj1]), freezeⵧdeep([obj2]))
				expect(result).toHaveLength(2)
			})

			it("should deduplicate same object references", () => {
				const obj = freezeⵧdeep({ x: 1 })
				expect(mergeⵧdeep<any>(freezeⵧdeep([obj]), freezeⵧdeep([obj]))).toHaveLength(1)
			})
		})

		describe("mismatched container types (should throw)", () => {
			it("should throw when merging an array with an object", () => {
				expect(() => mergeⵧdeep<any>(freezeⵧdeep([1, 2]), freezeⵧdeep({ x: 1 }))).toThrow()
			})

			it("should throw when merging an object with an array", () => {
				expect(() => mergeⵧdeep<any>(freezeⵧdeep({ x: 1 }), freezeⵧdeep([1, 2]))).toThrow()
			})

			it("should NOT throw when one side is undefined (undefined yields)", () => {
				expect(() => mergeⵧdeep<any>(undefined, freezeⵧdeep([1, 2]))).not.toThrow()
				expect(() => mergeⵧdeep<any>(freezeⵧdeep({ x: 1 }), undefined)).not.toThrow()
			})

			it("should NOT throw when one side is null (null is intentional)", () => {
				expect(() => mergeⵧdeep<any>(null, freezeⵧdeep([1, 2]))).not.toThrow()
				expect(() => mergeⵧdeep<any>(freezeⵧdeep({ x: 1 }), null)).not.toThrow()
			})
		})

		describe("not creating copies unless active merge", () => {
			it("should return a directly when b is undefined (no copy)", () => {
				const a = freezeⵧdeep({ x: 1 })
				expect(mergeⵧdeep<any>(a, undefined)).toBe(a)
			})

			it("should return b directly when a is undefined (no copy)", () => {
				const b = freezeⵧdeep({ x: 1 })
				expect(mergeⵧdeep<any>(undefined, b)).toBe(b)
			})
		})
	})
})
