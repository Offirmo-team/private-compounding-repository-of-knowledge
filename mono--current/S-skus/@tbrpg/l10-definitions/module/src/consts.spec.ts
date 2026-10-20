import { expect } from "chai"

import { LIB, ITEM_QUALITIES, ITEM_QUALITIES_TO_INT, ITEM_SLOTS, ITEM_SLOTS_TO_INT } from "./consts.ts"
import { InventorySlot } from "./types.ts"

describe(`${LIB} - constants`, function () {
	describe("item quality", function () {
		describe("mapping to int", function () {
			it("should be up-to-date", () => {
				expect(Object.keys(ITEM_QUALITIES_TO_INT)).to.have.lengthOf(ITEM_QUALITIES.length)
			})
		})
	})

	describe("inventory slots", function () {
		describe("mapping to int", function () {
			it("should be up-to-date", () => {
				expect(Object.keys(ITEM_SLOTS_TO_INT).filter((s) => s !== InventorySlot.none)).to.have.lengthOf(
					ITEM_SLOTS.length,
				)
			})
		})
	})
})
