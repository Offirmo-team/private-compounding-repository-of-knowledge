import { DEMO_ARMOR_1 } from "@tbrpg/logic--armors"
import { DEMO_WEAPON_1 } from "@tbrpg/logic--weapons"
import { expect } from "chai"

import { appraise_sell_value } from "./index.ts"

describe("@tbrpg/logic--shop - selectors:", function () {
	describe("appraisal", function () {
		context("of armors", function () {
			it("should work", () => {
				const price = appraise_sell_value(DEMO_ARMOR_1)
				expect(price).to.be.a("number")
				expect(price).to.equal(495)
			})
		})

		context("of weapons", function () {
			it("should work", () => {
				const price = appraise_sell_value(DEMO_WEAPON_1)
				expect(price).to.be.a("number")
				expect(price).to.equal(742)
			})
		})
	})
})
