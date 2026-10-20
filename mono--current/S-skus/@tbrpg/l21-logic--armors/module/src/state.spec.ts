import { InventorySlot, ItemQuality, ElementType, xxx_test_unrandomize_element } from "@tbrpg/definitions"
import { expect } from "chai"
import { Enum } from "typescript-string-enums"

import { getꓽengine } from "@monorepo-private/random"

import { LIB } from "./consts.ts"

import { type Armor, MAX_ENHANCEMENT_LEVEL, create, generate_random_demo_armor, enhance } from "./index.ts"

function assert_shape(armor: Readonly<Armor>) {
	expect(Object.keys(armor)).to.have.lengthOf(9)

	expect(armor.uuid).to.equal("uu1~test~test~test~test~")

	expect(armor.element_type).to.be.a("string")
	expect(Enum.isType(ElementType, armor.element_type)).to.be.true

	expect(armor.slot).to.be.a("string")
	expect(Enum.isType(InventorySlot, armor.slot)).to.be.true

	expect(armor.base_hid).to.be.a("string")
	expect(armor.base_hid.length).to.have.above(2)

	expect(armor.qualifier1_hid).to.be.a("string")
	expect(armor.qualifier1_hid.length).to.have.above(2)

	expect(armor.qualifier2_hid).to.be.a("string")
	expect(armor.qualifier2_hid.length).to.have.above(2)

	expect(armor.quality).to.be.a("string")
	expect(Enum.isType(ItemQuality, armor.quality)).to.be.true

	expect(armor.base_strength).to.be.a("number")
	expect(armor.base_strength).to.be.at.least(1)
	expect(armor.base_strength).to.be.at.most(5000) // TODO real max

	expect(armor.enhancement_level).to.be.a("number")
	expect(armor.enhancement_level).to.be.at.least(0)
	expect(armor.enhancement_level).to.be.at.most(MAX_ENHANCEMENT_LEVEL)
}

describe(`${LIB} - state`, function () {
	describe("creation", function () {
		it("should allow creating a random armor", function () {
			const rng = getꓽengine.for_unit_tests()
			const armor1 = xxx_test_unrandomize_element<Armor>(create(rng))
			assert_shape(armor1)
			expect(rng.get_state().call_count, "# rng draws 1").to.equal(5)

			const armor2 = xxx_test_unrandomize_element<Armor>(create(rng))
			assert_shape(armor2)
			expect(rng.get_state().call_count, "# rng draws 2").to.equal(10)
			expect(armor2).not.to.deep.equal(armor1)
		})

		it("should allow creating a partially predefined armor", function () {
			const rng = getꓽengine.for_unit_tests()
			const armor = xxx_test_unrandomize_element<Armor>(
				create(rng, {
					base_hid: "socks",
					quality: "artifact",
				}),
			)
			expect(armor).to.deep.equal({
				uuid: "uu1~test~test~test~test~",
				element_type: ElementType.item,
				slot: InventorySlot.armor,
				base_hid: "socks",
				qualifier1_hid: "sapphire",
				qualifier2_hid: "brave",
				quality: ItemQuality.artifact,
				base_strength: 52105,
				enhancement_level: 0,
			})
			expect(rng.get_state().call_count, "# rng draws").to.equal(3) // 2 less random picks
		})
	})

	describe("enhancement", function () {
		it("should allow enhancing a armor", function () {
			let armor = generate_random_demo_armor()
			armor = {
				...armor,
				enhancement_level: 0,
			}

			armor = enhance(armor)
			expect(armor.enhancement_level, "1").to.equal(1)

			for (let i = 2; i <= MAX_ENHANCEMENT_LEVEL; ++i) {
				armor = enhance(armor)
				expect(armor.enhancement_level, String(i)).to.equal(i)
			}

			expect(armor.enhancement_level, "max").to.equal(MAX_ENHANCEMENT_LEVEL)
		})

		it("should fail if armor is already at max enhancement level", () => {
			let armor = generate_random_demo_armor()
			armor = {
				...armor,
				enhancement_level: MAX_ENHANCEMENT_LEVEL,
			}

			function attempt_enhance() {
				armor = enhance(armor)
			}

			expect(attempt_enhance).to.throw("maximal enhancement level!")
		})
	})
})
