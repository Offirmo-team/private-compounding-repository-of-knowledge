import { describe, it, expect } from "vitest"

import { freezeⵧdeep } from "./index.ts"

/////////////////////////////////////////////////

describe(`freeze`, () => {
	describe("freezeⵧdeep()", () => {
		it("should return primitives as-is", () => {
			;[undefined, null, true, 42, "foo"].forEach((value) => {
				expect(freezeⵧdeep(value)).toBe(value)
			})
		})

		it("should freeze in place and return the same reference", () => {
			const value = { foo: 42 }
			expect(freezeⵧdeep(value)).toBe(value)
			expect(Object.isFrozen(value)).toBe(true)
		})

		it("should freeze nested objects and arrays", () => {
			const value = { a: { b: [{ c: 42 }] } }
			freezeⵧdeep(value)
			expect(Object.isFrozen(value.a)).toBe(true)
			expect(Object.isFrozen(value.a.b)).toBe(true)
			expect(Object.isFrozen(value.a.b[0])).toBe(true)
		})

		it("should make mutation attempts throw (strict mode)", () => {
			const value = freezeⵧdeep({ a: { b: 42 } })
			expect(() => {
				value.a.b = 33
			}).toThrow(TypeError)
		})

		it("should handle reference cycles", () => {
			const value: { self?: unknown } = {}
			value.self = value
			expect(() => freezeⵧdeep(value)).not.toThrow()
			expect(Object.isFrozen(value)).toBe(true)
		})

		it("should NOT traverse already-frozen objects (assumed deep-frozen)", () => {
			const child = { foo: 42 }
			freezeⵧdeep({ shallow_frozen: Object.freeze({ child }) })
			expect(Object.isFrozen(child)).toBe(false)
		})
	})
})
