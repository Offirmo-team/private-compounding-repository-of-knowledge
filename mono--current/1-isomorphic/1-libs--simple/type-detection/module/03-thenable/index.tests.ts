import { expect } from "chai"

import { isꓽThenable } from "./index.ts"

describe("@monorepo-private/type-detection -- thenable", function () {
	describe("isꓽthenable()", function () {
		it("should work", () => {
			// completely unrelated types
			expect(isꓽThenable(null)).to.be.false
			expect(isꓽThenable(undefined)).to.be.false
			expect(isꓽThenable(NaN)).to.be.false
			expect(isꓽThenable(5)).to.be.false
			expect(isꓽThenable("foo")).to.be.false

			// closer types
			expect(isꓽThenable([])).to.be.false
			expect(isꓽThenable({ foo: 42 })).to.be.false

			// final
			expect(isꓽThenable({ then: () => 42 })).to.be.true
			expect(isꓽThenable(Promise.resolve(42))).to.be.true
		})
	})
})
