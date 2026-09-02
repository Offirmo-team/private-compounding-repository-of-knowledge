import { expect } from "chai"

import { enforceꓽimmutable } from "@monorepo-private/state-utils"

import { type CodesConditions, CODESPECS_BY_KEY } from "./__fixtures/index.ts"
import { LIB, SCHEMA_VERSION } from "./consts.ts"
import { getꓽSXC } from "./sec.ts"

import { create, attempt_to_redeem_code } from "./index.ts"

describe(`${LIB} - state`, function () {
	describe("🆕 create()", function () {
		it("should have correct defaults", function () {
			const state = create(getꓽSXC())
			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				redeemed_codes: {},
			})
		})
	})

	describe("code redemption", function () {
		const BASE_INFOS = enforceꓽimmutable<CodesConditions>({
			has_energy_depleted: false,
			good_play_count: 0,
			is_alpha_player: true,
			is_player_since_alpha: true,
		})

		context("when the code is unknown or when the conditions are NOT met", function () {
			// no need to test detailed, see selectors
			it("should reject and not update the state", () => {
				const state = create()
				const code_spec = CODESPECS_BY_KEY["TESTNEVER"]!

				const do_it = () => attempt_to_redeem_code(state, code_spec, BASE_INFOS)
				expect(do_it).to.throw("This code is either non-existing or non redeemable at the moment")
				expect(state.redeemed_codes).to.deep.equal({})
				expect(state.revision).to.equal(0)
			})
		})

		context("when the conditions are met", function () {
			it("should update the state", () => {
				let state = create()
				const code_spec = CODESPECS_BY_KEY["TESTALWAYS"]!
				const code = code_spec.code

				state = attempt_to_redeem_code(state, code_spec, BASE_INFOS)

				expect(state.redeemed_codes).to.have.property(code)
				expect(state.redeemed_codes[code]).to.have.property("redeem_count", 1)
				expect(state.redeemed_codes[code]).to.have.property("last_redeem_date_minutes")
				expect(state.revision).to.equal(1)

				state = attempt_to_redeem_code(state, code_spec, BASE_INFOS)

				expect(state.redeemed_codes).to.have.property(code)
				expect(state.redeemed_codes[code]).to.have.property("redeem_count", 2)
				expect(state.redeemed_codes[code]).to.have.property("last_redeem_date_minutes")
				expect(state.revision).to.equal(2)
			})
		})
	})
})
