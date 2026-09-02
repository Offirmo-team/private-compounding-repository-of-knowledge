import { stripVTControlCharacters } from "node:util"

import { xxx_internal_reset_prng_cache } from "@oh-my-rpg/state--prng"
import {
	DEMO_ADVENTURE_01,
	DEMO_ADVENTURE_02,
	DEMO_ADVENTURE_03,
	DEMO_ADVENTURE_04,
} from "@tbrpg/logic--adventure--resolved"
import { ALL_GOOD_ADVENTURE_ARCHETYPES, ALL_BAD_ADVENTURE_ARCHETYPES } from "@tbrpg/logic--adventures"
import { create, play } from "@tbrpg/state"
import { expect } from "chai"

import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { renderꓽresolved_adventure } from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - adventure`, function () {
	it("should render properly - with gain of skills", () => {
		const $doc = renderꓽresolved_adventure(DEMO_ADVENTURE_01)
		//console.log(prettifyꓽjson($doc))

		const str = stripVTControlCharacters(renderⵧto_text($doc))
		//console.log(str)
		expect(str).to.be.a("string")
		expect(str).to.include("You were attacked and nearly killed")
		expect(str).to.include("L7")
		expect(str).to.include("Elite")
		expect(str).to.include("Chicken")
		expect(str).to.include("+1 luck!")
	})

	it("should render properly - with gain of coins", () => {
		const $doc = renderꓽresolved_adventure(DEMO_ADVENTURE_02)
		//console.log(prettifyꓽjson($doc))

		const str = stripVTControlCharacters(renderⵧto_text($doc))
		//console.log(str)
		expect(str).to.be.a("string")
		expect(str).to.include("A dying man on the street left you everything he had.")
		expect(str).to.include("You gain")
		expect(str).to.include("1234 coins")
	})

	it("should render properly - with gain of item(s)", () => {
		const $doc = renderꓽresolved_adventure(DEMO_ADVENTURE_03)
		//console.log(prettifyꓽjson($doc))

		const str = stripVTControlCharacters(renderⵧto_text($doc))
		console.log(str)
		expect(str).to.be.a("string")
		expect(str).to.include("You come across an old man with eccentric apparel")
		expect(str).to.include("Adjudicator’s Admirable Axe")
	})

	it("should render properly - with gain of item improvement", () => {
		const $doc = renderꓽresolved_adventure(DEMO_ADVENTURE_04)
		//console.log(prettifyꓽjson($doc))

		const str = stripVTControlCharacters(renderⵧto_text($doc))
		//console.log(str)
		expect(str).to.be.a("string")
		expect(str).to.include("You won’t take back the princess!")
		expect(str).to.include("123 coins")
		expect(str).to.include("enchant")
	})

	describe("adventures", function () {
		beforeEach(() => xxx_internal_reset_prng_cache())

		ALL_GOOD_ADVENTURE_ARCHETYPES.forEach(({ hid, good }, index) => {
			describe(`✅  adventure #${index} "${hid}"`, function () {
				it("should be render-able", () => {
					let state = create()
					state = play(state, { explicit_adventure_archetype_hid: hid })

					const $doc = renderꓽresolved_adventure(state.u_state.last_adventure!)
					//console.log(prettifyꓽjson($doc))

					// should just not throw
					const str = renderⵧto_text($doc)
					//console.log(str)
				})
			})
		})

		ALL_BAD_ADVENTURE_ARCHETYPES.forEach(({ hid, good }, index) => {
			describe(`❎  adventure #${index} "${hid}"`, function () {
				it("should be render-able", () => {
					let state = create()

					state = play(state)
					state = play(state)
					state = play(state)
					state = play(state)
					state = play(state)
					state = play(state)
					state = play(state)

					state = play(state, { explicit_adventure_archetype_hid: hid })

					const $doc = renderꓽresolved_adventure(state.u_state.last_adventure!)
					//console.log(prettifyꓽjson($doc))

					// should just not throw
					const str = renderⵧto_text($doc)
					//console.log(str)
				})
			})
		})
	})
})
