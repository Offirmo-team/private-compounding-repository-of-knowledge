import { xxx_internal_reset_prng_cache } from "@oh-my-rpg/state--prng"
import { create, play } from "@tbrpg/state"
import { expect } from "chai"

import * as RichText from "@monorepo-private/rich-text-format"

import { LIB } from "../../consts.ts"

import { getꓽrecap } from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} - engagement - recap`, function () {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe("getꓽrecap()", function () {
		context("when the user has just started a new game", function () {
			it("should return an intro", () => {
				const state = create()
				const doc = getꓽrecap(state.u_state)
				const str = renderⵧto_text(doc)
				expect(str).to.include("Congratulations, you were chosen")
			})
		})

		context("when the user has already played", function () {
			// TODO
			it("should recap current status")
		})
	})
})
