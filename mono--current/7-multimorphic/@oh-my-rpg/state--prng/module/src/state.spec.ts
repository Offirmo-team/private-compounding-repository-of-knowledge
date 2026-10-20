import { expect } from "chai"

import { getꓽrandom } from "@monorepo-private/random"
import { xxx_test_unrandomize_element } from "@monorepo-private/uuid"

import { LIB, SCHEMA_VERSION } from "./consts.ts"

import { DEFAULT_SEED, create, update_use_count, getꓽprng, xxx_internal_reset_prng_cache, type State } from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} - state`, function () {
	beforeEach(xxx_internal_reset_prng_cache)
	const gen = getꓽrandom.generator_of.integer.between(0, 10)

	describe("🆕  initial value", function () {
		it("should have correct defaults", function () {
			const state = xxx_test_unrandomize_element(create())

			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				uuid: "uu1~test~test~test~test~",
				revision: 0,

				prng_state: {
					algorithm_id: "ISAAC32",
					seed: DEFAULT_SEED,
					call_count: 0,
				},

				recently_encountered_by_id: {},
			} satisfies State)
		})
	})

	describe("🌰  set seed", function () {
		it("should work and reset use count")
	})

	describe("update after use", function () {
		it("should correctly persist prng state", function () {
			let state = create()

			const prng = getꓽprng(state)

			/*
			console.log(gen(prng))
			console.log(gen(prng))
			console.log(gen(prng))
			*/

			expect(gen(prng), "random 1").to.equal(1)
			expect(gen(prng), "random 2").to.equal(2)

			state = update_use_count(state, prng)
			expect(state.prng_state.call_count).to.equal(2)
		})
	})
})
