import { InventorySlot, ItemQuality } from "@tbrpg/definitions"
import { generate_random_demo_armor, DEMO_ARMOR_1, DEMO_ARMOR_2 } from "@tbrpg/logic--armors"
import { generate_random_demo_weapon, DEMO_WEAPON_1, DEMO_WEAPON_2 } from "@tbrpg/logic--weapons"
import { expect } from "chai"

import * as RichText from "@monorepo-private/rich-text-format"
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { render_item_short, render_item_detailed } from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - items`, function () {
	describe("render_item_short()", function () {
		it("should render properly")
	})

	describe("render_item_detailed()", function () {
		it("should render properly")
	})
})
