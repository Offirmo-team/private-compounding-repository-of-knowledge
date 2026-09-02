import { expect } from "chai"

import { type CssⳇFilterSpec, getꓽCssⳇfilter__value } from "../index.ts"

/////////////////////////////////////////////////

describe(`Web types -- CSS`, function () {
	describe("selectors", function () {
		describe("getꓽCssⳇfilter__value()", () => {
			it("should work -- empty", () => {
				const spec: CssⳇFilterSpec = []

				expect(getꓽCssⳇfilter__value(spec)).to.equal("none")
			})

			it("should work -- simple", () => {
				const spec: CssⳇFilterSpec = [["blur", "5px"]]

				expect(getꓽCssⳇfilter__value(spec)).to.equal("blur(5px)")
			})

			it("should work -- repeated", () => {
				const spec: CssⳇFilterSpec = [
					["blur", "5px"],
					["hue-rotate", "100deg"],
					["blur", "3px"],
				]

				expect(getꓽCssⳇfilter__value(spec)).to.equal("blur(5px) hue-rotate(100deg) blur(3px)")
			})
		})
	})
})
