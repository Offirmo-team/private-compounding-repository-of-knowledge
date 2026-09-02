import { xxx_internal_reset_prng_cache } from "@oh-my-rpg/state--prng"
import { CharacterClass } from "@tbrpg/state--character"
import { expect } from "chai"

import { enforceꓽimmutable } from "@monorepo-private/state-utils"
import { TEST_TIMESTAMP_MS } from "@monorepo-private/timestamps"

import { LIB } from "../consts.ts"
import { create, type State } from "../index.ts"
import { _lose_all_energy } from "../reducers/internal.ts"

import { getꓽavailable_classes, will_next_play_be_good_at } from "./game.ts"

describe(`${LIB} - selectors - game`, function () {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe("getꓽavailable_classes()", function () {
		it("should return class strings", () => {
			const { u_state } = enforceꓽimmutable<State>(create())

			const klasses = getꓽavailable_classes(u_state)

			expect(klasses).to.be.an("array")
			klasses.forEach((k) => {
				expect(k, k).to.be.a("string")
				expect(k.length, k).to.be.above(3)
			})
		})

		it("should filter out novice", () => {
			const { u_state } = enforceꓽimmutable<State>(create())

			const klasses = getꓽavailable_classes(u_state)

			expect(klasses.includes(CharacterClass.novice)).to.be.false
		})
	})

	describe("will_next_play_be_good_at()", function () {
		it("should return a correct boolean", () => {
			const now_ms = TEST_TIMESTAMP_MS
			let state = enforceꓽimmutable<State>(create(undefined, { now_ms }))

			expect(will_next_play_be_good_at(state, now_ms)).to.be.true

			state = _lose_all_energy(state, now_ms)
			expect(will_next_play_be_good_at(state, now_ms)).to.be.false
		})

		it("should properly take into account the regen over time", () => {
			const now_ms = TEST_TIMESTAMP_MS
			let state = enforceꓽimmutable<State>(create(undefined, { now_ms }))

			state = _lose_all_energy(state, now_ms)
			expect(will_next_play_be_good_at(state, now_ms)).to.be.false

			expect(will_next_play_be_good_at(state, now_ms + 4 * 3600 * 1000)).to.be.true
		})
	})
})
