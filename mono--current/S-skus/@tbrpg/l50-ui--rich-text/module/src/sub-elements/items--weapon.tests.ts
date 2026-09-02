import { generate_random_demo_weapon, DEMO_WEAPON_1, DEMO_WEAPON_2 } from "@tbrpg/logic--weapons"
import { expect } from "chai"

import { dumpꓽanyⵧprettified } from "@monorepo-private/prettify-any"
import * as RichText from "@monorepo-private/rich-text-format"
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { render_weapon_detailed } from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - items -- weapon`, function () {
	context("when not enhanced", function () {
		it("should render properly", () => {
			const $doc = render_weapon_detailed(DEMO_WEAPON_1)
			const str = renderⵧto_text($doc)
			expect(str).to.be.a("string")
			expect(str).to.include("Axe")
			expect(str).to.include("Admirable")
			expect(str).to.include("Adjudicator’s")
			expect(str).not.to.include("+")
		})
	})

	context("when enhanced", function () {
		it("should render properly", () => {
			const $doc = render_weapon_detailed(DEMO_WEAPON_2)
			const str = renderⵧto_text($doc)
			expect(str).to.be.a("string")
			expect(str).to.include("Bow")
			expect(str).to.include("Arcanic")
			expect(str).to.include("Ambassador’s")
			expect(str).to.include("+8")
		})
	})

	describe("demos", function () {
		it("shows off weapons", () => {
			const doc1 = render_weapon_detailed(DEMO_WEAPON_1, 2000)
			//dumpꓽanyⵧprettified(doc1)
			let str = renderⵧto_text(doc1)
			// should just not throw

			const doc2 = render_weapon_detailed(DEMO_WEAPON_2, 2000)
			//dumpꓽanyⵧprettified(doc2)
			str = renderⵧto_text(doc2)
			// should just not throw

			for (let i = 0; i < 10; ++i) {
				const item = generate_random_demo_weapon()
				const $doc = render_weapon_detailed(item, 2000)
				//dumpꓽanyⵧprettified($doc)
				const str = renderⵧto_text($doc)
				//console.log(str)
				// should just not throw
			}
		})
	})
})
