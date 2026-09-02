import { expect } from "chai"

import { toꓽstring } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/ts--utils -- stringify", function () {
	describe("compare()", function () {
		it("should work -- empty", () => {
			expect(toꓽstring(undefined)).to.equal("undefined")
			expect(toꓽstring(null)).to.equal("null")
			expect(toꓽstring(0)).to.equal("0")
			expect(toꓽstring(-0)).to.equal("-0")
			expect(toꓽstring("")).to.equal('""')
			expect(toꓽstring([])).to.equal("[]")
			expect(toꓽstring({})).to.equal("{}")
		})

		it("should work -- not empty -- primitives", () => {
			expect(toꓽstring(1)).to.equal("1")
			expect(toꓽstring("foo")).to.equal('"foo"')
		})
	})
})
