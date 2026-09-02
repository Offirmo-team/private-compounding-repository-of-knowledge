import { generate_random_demo_armor } from "@tbrpg/logic--armors"
import { generate_random_demo_weapon } from "@tbrpg/logic--weapons"
import { expect } from "chai"

import { LIB } from "./consts.ts"

import { type Item, compareꓽitemsⵧby_slot_then_strength } from "./index.ts"

describe(`${LIB} - compare`, function () {
	describe("comparison of different types", function () {
		it("should work - equality", function () {
			const DUMMY_ITEM_01: Item = generate_random_demo_weapon()
			const DUMMY_ITEM_02: Item = generate_random_demo_armor()

			expect(compareꓽitemsⵧby_slot_then_strength(DUMMY_ITEM_01, DUMMY_ITEM_01), "equality - 1").to.equal(0)
			expect(compareꓽitemsⵧby_slot_then_strength(DUMMY_ITEM_02, DUMMY_ITEM_02), "equality - 2").to.equal(0)
		})

		it("should work - lower/higher than", function () {
			const DUMMY_ITEM_01: Item = generate_random_demo_weapon()
			const DUMMY_ITEM_02: Item = generate_random_demo_armor()

			expect(compareꓽitemsⵧby_slot_then_strength(DUMMY_ITEM_01, DUMMY_ITEM_02), "diff - 1-2").to.equal(-1)
			expect(compareꓽitemsⵧby_slot_then_strength(DUMMY_ITEM_02, DUMMY_ITEM_01), "diff - 1-2").to.equal(1)
		})
	})
})
