import { generate_random_demo_armor, DEMO_ARMOR_1, DEMO_ARMOR_2 } from "@tbrpg/logic--armors"
import { generate_random_demo_weapon, DEMO_WEAPON_1, DEMO_WEAPON_2 } from "@tbrpg/logic--weapons"
import { create as create_inventory, equip_item, add_item, remove_item_from_unslotted } from "@tbrpg/state--inventory"
import { Currency, create as create_wallet, add_amount } from "@tbrpg/state--wallet"
import { expect } from "chai"

import * as RichText from "@monorepo-private/rich-text-format"
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { renderꓽbackpack, renderꓽequipment, renderꓽfull_inventory } from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - inventory`, function () {
	describe("backpack rendering", function () {
		context("when empty", function () {
			it("should render properly", () => {
				const inventory = create_inventory()
				const $doc = renderꓽbackpack(inventory)
				const str = renderⵧto_text($doc)

				expect(str).to.be.a("string")
				expect(str).to.contain("empty")
			})
		})

		context("when not empty", function () {
			it("should render properly", () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = remove_item_from_unslotted(inventory, inventory.unslotted[4]!.uuid)

				const $doc = renderꓽbackpack(inventory)
				const str = renderⵧto_text($doc)

				expect(str).to.be.a("string")
				expect(str).not.to.contain("0.")
				expect(str).to.contain(" 1.")
				expect(str).to.contain(" 5.")
				expect(str).not.to.contain("6.")
			})
		})

		describe("demo", function () {
			it("shows off", () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = remove_item_from_unslotted(inventory, inventory.unslotted[4]!.uuid)

				const $doc = renderꓽbackpack(inventory)
				//console.log(prettifyꓽjson($doc))
				const str = renderⵧto_text($doc)
				// should just not throw
				//console.log(str)
			})
		})
	})

	describe("active equipment rendering", function () {
		context("when empty", function () {
			it("should render properly", () => {
				const inventory = create_inventory()
				const $doc = renderꓽequipment(inventory)
				const str = renderⵧto_text($doc)
				expect(str).to.be.a("string")
				expect(str).to.contain("armor: -")
				expect(str).to.contain("weapon: -")
			})
		})

		context("when not empty", function () {
			it("should render properly", () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, DEMO_WEAPON_1)
				inventory = add_item(inventory, DEMO_ARMOR_2)
				inventory = equip_item(inventory, DEMO_WEAPON_1.uuid)
				inventory = equip_item(inventory, DEMO_ARMOR_2.uuid)

				const $doc = renderꓽequipment(inventory)
				const str = renderⵧto_text($doc)
				expect(str).to.be.a("string")
				expect(str).to.contain("armor: Apprentice’s Brass Belt +8")
				expect(str).to.contain("weapon: Adjudicator’s Admirable Axe")
			})
		})

		describe("demo", function () {
			it("shows off", () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, DEMO_WEAPON_1)
				inventory = add_item(inventory, DEMO_ARMOR_2)
				inventory = equip_item(inventory, DEMO_WEAPON_1.uuid)
				inventory = equip_item(inventory, DEMO_ARMOR_2.uuid)

				const $doc = renderꓽequipment(inventory)
				const str = renderⵧto_text($doc)
				// should just not throw
			})
		})
	})

	describe("full inventory rendering", function () {
		describe("demo", function () {
			it("shows off", () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, DEMO_WEAPON_1)
				inventory = add_item(inventory, DEMO_ARMOR_2)
				inventory = equip_item(inventory, DEMO_WEAPON_1.uuid)
				inventory = equip_item(inventory, DEMO_ARMOR_2.uuid)
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = remove_item_from_unslotted(inventory, inventory.unslotted[4]!.uuid)

				let wallet = create_wallet()
				wallet = add_amount(wallet, Currency.coin, 12345)
				wallet = add_amount(wallet, Currency.token, 67)

				const $doc = renderꓽfull_inventory(inventory, wallet)
				const str = renderⵧto_text($doc)
				// should just not throw
			})
		})
	})
})
