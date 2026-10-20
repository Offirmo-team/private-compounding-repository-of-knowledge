import { describe, it, expect } from "vitest"

import { isꓽThenable } from "./index.ts"

describe("@monorepo-private/type-detection -- thenable", () => {
	describe("isꓽthenable()", () => {
		it("should work", () => {
			// completely unrelated types
			expect(isꓽThenable(null)).toBe(false)
			expect(isꓽThenable(undefined)).toBe(false)
			expect(isꓽThenable(NaN)).toBe(false)
			expect(isꓽThenable(5)).toBe(false)
			expect(isꓽThenable("foo")).toBe(false)

			// closer types
			expect(isꓽThenable([])).toBe(false)
			expect(isꓽThenable({ foo: 42 })).toBe(false)

			// final
			expect(isꓽThenable({ then: () => 42 })).toBe(true)
			expect(isꓽThenable(Promise.resolve(42))).toBe(true)
		})
	})
})
