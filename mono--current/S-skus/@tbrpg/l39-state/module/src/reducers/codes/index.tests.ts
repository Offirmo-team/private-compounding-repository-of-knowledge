import { xxx_internal_reset_prng_cache } from "@oh-my-rpg/state--prng"
import { expect } from "chai"

import { enforceꓽimmutable } from "@monorepo-private/state-utils"

import { LIB } from "../../consts.ts"
import { type State } from "../../types.ts"
import { create, re_seed, attempt_to_redeem_code } from "../index.ts"
import { _lose_all_energy, _ack_all_engagements } from "../internal.ts"

describe(`${LIB} - reducer - codes`, function () {
	beforeEach(() => xxx_internal_reset_prng_cache())

	const CODES = [
		"TESTNOTIFS",
		"TESTACH",
		"BORED",
		"XYZZY",
		"PLUGH",
		"REBORNX",
		"REBORN",
		"ALPHATWINK",
	] /*.filter(c => c === 'REBORNX')*/

	CODES.forEach((code) => {
		describe(`good code "${code}"`, function () {
			it("should not cause a crash", function () {
				const initial_state = enforceꓽimmutable<State>(
					_ack_all_engagements(
						_lose_all_energy(
							// for BORED
							re_seed(create()),
						),
					),
				)

				let state = initial_state
				state = attempt_to_redeem_code(state, code)

				const notif = state.u_state.engagement.queue.filter((e) => e.hints?.["success"] === true)
				//console.log(notif)
				expect(notif.length).to.equal(1)
				expect(notif).to.have.nested.property("template.flow", "main")
				expect(notif).to.have.nested.property("params.code", code)

				// 2nd attempt, sometimes shows bugs
				state = attempt_to_redeem_code(state, code)
			})
		})
	})

	describe("good code with redemption limit", function () {
		// bug seen, v0.59
		it("should correctly crash on second attempt", () => {
			const initial_state = enforceꓽimmutable<State>(_ack_all_engagements(re_seed(create())))

			let state = initial_state
			const CODE = "alphatwink"
			//console.log('attempt #1')
			state = attempt_to_redeem_code(state, CODE)
			//console.log('attempt #2')
			state = attempt_to_redeem_code(state, CODE)
			const notif = state.u_state.engagement.queue.filter((e) => e.hints?.["success"] === false)
			//console.log(notif)
			expect(notif.length).to.equal(1)
			expect(notif).to.have.nested.property("template.flow", "main")
			expect(notif).to.have.nested.property("params.code", CODE)
		})
	})

	describe("bad code", function () {
		it("should cause a crash", function () {
			const initial_state = enforceꓽimmutable<State>(_ack_all_engagements(re_seed(create())))

			let state = initial_state
			const CODE = "irsetuisretuisrt"
			state = attempt_to_redeem_code(state, "irsetuisretuisrt")

			const notif = state.u_state.engagement.queue.filter((e) => e.hints?.["success"] === false)
			//console.log(notif)
			expect(notif.length).to.equal(1)
			expect(notif).to.have.nested.property("template.flow", "main")
			expect(notif).to.have.nested.property("params.code", CODE)
		})
	})
})
