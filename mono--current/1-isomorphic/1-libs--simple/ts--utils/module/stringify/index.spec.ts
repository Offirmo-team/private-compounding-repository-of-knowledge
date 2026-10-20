import { describe, it, expect } from "vitest"

import { toꓽstring } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/ts--utils -- stringify", () => {
	describe("compare()", () => {
		it("should work -- empty", () => {
			expect(toꓽstring(undefined)).toBe("undefined")
			expect(toꓽstring(null)).toBe("null")
			expect(toꓽstring(0)).toBe("0")
			expect(toꓽstring(-0)).toBe("-0")
			expect(toꓽstring("")).toBe('""')
			expect(toꓽstring([])).toBe("[]")
			expect(toꓽstring({})).toBe("{}")
		})

		it("should work -- not empty -- primitives", () => {
			expect(toꓽstring(1)).toBe("1")
			expect(toꓽstring("foo")).toBe('"foo"')
		})
	})
})
