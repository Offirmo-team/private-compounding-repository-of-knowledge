import { expect } from "chai"

import { LIB } from "./consts.ts"
import { createꓽitemⵧbase, compareꓽitemsⵧby_slot, compareꓽitemsⵧby_quality } from "./item.ts"
import { type Item, InventorySlot, ItemQuality } from "./types.ts"

describe(`${LIB} - item (utilities)`, function () {
	describe("compareꓽitemsⵧby_slot", function () {
		it("should sort correctly", () => {
			const list: Item[] = [
				createꓽitemⵧbase(InventorySlot.weapon),
				createꓽitemⵧbase(InventorySlot.armor),
				createꓽitemⵧbase(InventorySlot.armor),
				createꓽitemⵧbase(InventorySlot.weapon),
			]
			const [w1, a1, a2, w2] = list
			expect([...list].sort(compareꓽitemsⵧby_slot)).to.deep.equal([w1, w2, a1, a2])
		})
	})

	describe("compareꓽitemsⵧby_quality", function () {
		it("should sort correctly", () => {
			const list: Item[] = [
				createꓽitemⵧbase(InventorySlot.weapon, ItemQuality.artifact),
				createꓽitemⵧbase(InventorySlot.weapon, ItemQuality.common),
				createꓽitemⵧbase(InventorySlot.weapon, ItemQuality.uncommon),
				createꓽitemⵧbase(InventorySlot.weapon, ItemQuality.legendary),
				createꓽitemⵧbase(InventorySlot.weapon, ItemQuality.rare),
				createꓽitemⵧbase(InventorySlot.weapon, ItemQuality.epic),
			]
			const [artifact, common, uncommon, legendary, rare, epic] = list

			expect([...list].sort(compareꓽitemsⵧby_quality)).to.deep.equal([
				artifact,
				legendary,
				epic,
				rare,
				uncommon,
				common,
			])
		})
	})
})
