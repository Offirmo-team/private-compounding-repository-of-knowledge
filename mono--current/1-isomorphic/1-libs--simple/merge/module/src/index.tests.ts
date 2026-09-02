import { expect } from "chai"
import { freeze } from "icepick"

import { mergeⵧdeep } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/merge", function () {
	describe("mergeⵧdeep()", function () {
		describe("handling of undefined (= unknown/missing, yields to previous defined value)", function () {
			it("should return a when b is undefined", () => {
				expect(mergeⵧdeep<any>(42, undefined)).to.equal(42)
			})

			it("should return b when a is undefined", () => {
				expect(mergeⵧdeep<any>(undefined, 42)).to.equal(42)
			})

			it("should handle both undefined", () => {
				expect(mergeⵧdeep<any>(undefined, undefined)).to.equal(undefined)
			})
		})

		describe("handling of null (= intentional, does NOT yield to undefined but yields to a previous defined value)", function () {
			it("should return null when a is null and b is undefined", () => {
				expect(mergeⵧdeep<any>(null, undefined)).to.equal(null)
			})

			it("should return null when b is null and a is undefined", () => {
				expect(mergeⵧdeep<any>(undefined, null)).to.equal(null)
			})

			it("should return null when both are null", () => {
				expect(mergeⵧdeep<any>(null, null)).to.equal(null)
			})

			it("should not yield to a previous defined value", () => {
				expect(mergeⵧdeep<any>(42, null)).to.equal(null)
			})

			it("should be overridden by b when b is a defined value", () => {
				expect(mergeⵧdeep<any>(null, 42)).to.equal(42)
			})
		})

		describe("primitives", function () {
			it("should return b when both are defined primitives (b wins)", () => {
				expect(mergeⵧdeep<any>("foo", "bar")).to.equal("bar")
			})

			it("should work with numbers", () => {
				expect(mergeⵧdeep<any>(1, 2)).to.equal(2)
			})

			it("should work with booleans", () => {
				expect(mergeⵧdeep<any>(true, false)).to.equal(false)
			})
		})

		describe("plain objects", function () {
			it("should merge two simple objects", () => {
				const a = freeze({ x: 1 })
				const b = freeze({ y: 2 })
				expect(mergeⵧdeep<any>(a, b)).to.deep.equal({ x: 1, y: 2 })
			})

			it("should let b override a for overlapping keys", () => {
				const a = freeze({ x: 1, y: 2 })
				const b = freeze({ y: 3 })
				expect(mergeⵧdeep<any>(a, b)).to.deep.equal({ x: 1, y: 3 })
			})

			it("should skip undefined values in b (yielding to a)", () => {
				const a = freeze({ x: 1, y: 2 })
				const b = freeze({ y: undefined })
				expect(mergeⵧdeep<any>(a, b)).to.deep.equal({ x: 1, y: 2 })
			})

			it("should NOT skip null values in b when a has a defined value", () => {
				const a = freeze({ x: 1, y: 2 })
				const b = freeze({ y: null })
				expect(mergeⵧdeep<any>(a, b)).to.deep.equal({ x: 1, y: null })
			})

			it("should keep null values in b when a has undefined for that key", () => {
				const a = freeze({ x: 1, y: undefined })
				const b = freeze({ y: null })
				expect(mergeⵧdeep<any>(a, b)).to.deep.equal({ x: 1, y: null })
			})

			it("should merge nested objects recursively", () => {
				const a = freeze({ nested: { x: 1, y: 2 } })
				const b = freeze({ nested: { y: 3, z: 4 } })
				expect(mergeⵧdeep<any>(a, b)).to.deep.equal({ nested: { x: 1, y: 3, z: 4 } })
			})

			it("should merge deeply nested objects", () => {
				const a = freeze({ l1: { l2: { l3: { x: 1 } } } })
				const b = freeze({ l1: { l2: { l3: { y: 2 } } } })
				expect(mergeⵧdeep<any>(a, b)).to.deep.equal({ l1: { l2: { l3: { x: 1, y: 2 } } } })
			})
		})

		describe("arrays (merged with deduplication by value ===)", function () {
			it("should merge arrays and deduplicate by value", () => {
				expect(mergeⵧdeep<any>(freeze([1, 2, 3]), freeze([2, 3, 4]))).to.deep.equal([1, 2, 3, 4])
			})

			it("should handle identical arrays", () => {
				expect(mergeⵧdeep<any>(freeze([1, 2]), freeze([1, 2]))).to.deep.equal([1, 2])
			})

			it("should handle disjoint arrays", () => {
				expect(mergeⵧdeep<any>(freeze([1, 2]), freeze([3, 4]))).to.deep.equal([1, 2, 3, 4])
			})

			it("should handle empty arrays", () => {
				expect(mergeⵧdeep<any>(freeze([]), freeze([1, 2]))).to.deep.equal([1, 2])
				expect(mergeⵧdeep<any>(freeze([1, 2]), freeze([]))).to.deep.equal([1, 2])
				expect(mergeⵧdeep<any>(freeze([]), freeze([]))).to.deep.equal([])
			})

			it("should deduplicate strings", () => {
				expect(mergeⵧdeep<any>(freeze(["a", "b"]), freeze(["b", "c"]))).to.deep.equal(["a", "b", "c"])
			})

			it("should NOT deduplicate objects (=== comparison)", () => {
				const obj1 = freeze({ x: 1 })
				const obj2 = freeze({ x: 1 })
				const result = mergeⵧdeep(freeze([obj1]), freeze([obj2]))
				expect(result).to.have.lengthOf(2)
			})

			it("should deduplicate same object references", () => {
				const obj = freeze({ x: 1 })
				expect(mergeⵧdeep<any>(freeze([obj]), freeze([obj]))).to.have.lengthOf(1)
			})
		})

		describe("mismatched container types (should throw)", function () {
			it("should throw when merging an array with an object", () => {
				expect(() => mergeⵧdeep<any>(freeze([1, 2]), freeze({ x: 1 }))).to.throw()
			})

			it("should throw when merging an object with an array", () => {
				expect(() => mergeⵧdeep<any>(freeze({ x: 1 }), freeze([1, 2]))).to.throw()
			})

			it("should NOT throw when one side is undefined (undefined yields)", () => {
				expect(() => mergeⵧdeep<any>(undefined, freeze([1, 2]))).not.to.throw()
				expect(() => mergeⵧdeep<any>(freeze({ x: 1 }), undefined)).not.to.throw()
			})

			it("should NOT throw when one side is null (null is intentional)", () => {
				expect(() => mergeⵧdeep<any>(null, freeze([1, 2]))).not.to.throw()
				expect(() => mergeⵧdeep<any>(freeze({ x: 1 }), null)).not.to.throw()
			})
		})

		describe("not creating copies unless active merge", function () {
			it("should return a directly when b is undefined (no copy)", () => {
				const a = freeze({ x: 1 })
				expect(mergeⵧdeep<any>(a, undefined)).to.equal(a)
			})

			it("should return b directly when a is undefined (no copy)", () => {
				const b = freeze({ x: 1 })
				expect(mergeⵧdeep<any>(undefined, b)).to.equal(b)
			})
		})
	})
})
