import { xxx_internal_reset_prng_cache } from "@oh-my-rpg/state--prng"
import { InventorySlot } from "@tbrpg/definitions"
import { type Armor, matches as matches_armor } from "@tbrpg/logic--armors"
import { type Weapon, matches as matches_weapon } from "@tbrpg/logic--weapons"
import { expect } from "chai"

import { dumpꓽanyⵧprettified } from "@monorepo-private/prettify-any"

import { LIB } from "../consts.ts"
import { is_inventory_full } from "../selectors/index.ts"

import { _autoplay } from "./autoplay.ts"
import { STARTING_WEAPON_SPEC, STARTING_ARMOR_SPEC, create } from "./create.ts"

describe(`${LIB} - reducer`, function () {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe("autoplay", function () {
		it("should allow playing a huge number of time (repeated invocation)", () => {
			let state = create()

			try {
				for (let i = 0; i < 1000; ++i) {
					state = _autoplay(state, {
						DEBUG: false,
						target_good_play_count: i + 1,
					})
				}
			} catch (err) {
				dumpꓽanyⵧprettified("crash", state)
				throw err
			}

			//dumpꓽanyⵧprettified('success', state)
			expect(state.u_state.progress.statistics.good_play_count).to.equal(1000)
			expect(state.u_state.progress.statistics.bad_play_count).to.equal(0)
		})

		it("should automatically make good decisions (bulk)", () => {
			let state = create()

			try {
				state = _autoplay(state, {
					target_good_play_count: 1000,
				})
			} catch (err) {
				dumpꓽanyⵧprettified("crash", state)
				throw err
			}

			//dumpꓽanyⵧprettified('success', state)
			expect(state.u_state.progress.statistics.good_play_count).to.equal(1000)
			expect(state.u_state.progress.statistics.bad_play_count).to.equal(0)

			expect(state.u_state.avatar.klass).not.to.equal("novice")
			expect(is_inventory_full(state.u_state), "inventory full").to.be.false
			const equipped_armor: Armor = state.u_state.inventory.slotted[InventorySlot.armor]!
			const equipped_weapon: Weapon = state.u_state.inventory.slotted[InventorySlot.weapon]!
			//console.log({ equipped_armor, STARTING_ARMOR_SPEC })
			//console.log(state.u_state.inventory)
			expect(matches_weapon(equipped_weapon, STARTING_WEAPON_SPEC), "no longer starting weapon").to.be.false
			expect(matches_armor(equipped_armor, STARTING_ARMOR_SPEC), "no longer starting armor").to.be.false
		})

		it("should allow auto-looping with good and bad (bulk)", () => {
			let state = create()

			try {
				state = _autoplay(state, {
					target_good_play_count: 2000,
					target_bad_play_count: 100,
				})
			} catch (err) {
				dumpꓽanyⵧprettified("crash", state)
				throw err
			}

			//dumpꓽanyⵧprettified('success', state)
			expect(state.u_state.progress.statistics.good_play_count).to.equal(2000)
			expect(state.u_state.progress.statistics.bad_play_count).to.equal(100)
		})
	})
})
