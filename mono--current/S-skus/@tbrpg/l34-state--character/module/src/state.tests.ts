import { expect } from "chai"

import { SCHEMA_VERSION, LIB } from "./consts.ts"
import { getꓽSXC } from "./sxc.ts"

import { CharacterAttribute, CharacterClass, create, increase_stat } from "./index.ts"

describe(`${LIB} - state`, function () {
	describe("🆕  create()", function () {
		it("should have correct defaults", function () {
			const state = create(getꓽSXC())
			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				name: "[new player]",
				klass: CharacterClass.novice,
				attributes: {
					level: 1,

					health: 1,
					mana: 0,

					strength: 1,
					agility: 1,
					charisma: 1,
					wisdom: 1,
					luck: 1,
				},
			})
		})
	})

	describe("⬆ stat increase", function () {
		it("should fail on invalid amount", function () {
			let state = create(getꓽSXC())

			function increase_0() {
				state = increase_stat(getꓽSXC(), state, CharacterAttribute.agility, 0)
			}
			expect(increase_0).to.throw("invalid amount!")

			function decrease() {
				state = increase_stat(getꓽSXC(), state, CharacterAttribute.agility, -1)
			}
			expect(decrease).to.throw("invalid amount!")
		})

		it("should work in nominal case", function () {
			let state = create(getꓽSXC())

			state = increase_stat(getꓽSXC(), state, CharacterAttribute.agility)
			expect(state.attributes.agility).to.equal(2)
			expect(state.attributes).to.deep.equal({
				level: 1,

				health: 1,
				mana: 0,

				strength: 1,
				agility: 2,
				charisma: 1,
				wisdom: 1,
				luck: 1,
			})

			state = increase_stat(getꓽSXC(), state, CharacterAttribute.agility, 2)
			expect(state.attributes.agility).to.equal(4)

			expect(state.attributes).to.deep.equal({
				level: 1,

				health: 1,
				mana: 0,

				strength: 1,
				agility: 4,
				charisma: 1,
				wisdom: 1,
				luck: 1,
			})

			state = increase_stat(getꓽSXC(), state, CharacterAttribute.agility)
			expect(state.attributes.agility).to.equal(5)

			expect(state.attributes).to.deep.equal({
				level: 1,

				health: 1,
				mana: 0,

				strength: 1,
				agility: 5,
				charisma: 1,
				wisdom: 1,
				luck: 1,
			})
		})

		it("should cap")
	})
})
