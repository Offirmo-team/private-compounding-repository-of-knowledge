import { generate_random_demo_armor, DEMO_ARMOR_1, DEMO_ARMOR_2 } from "@tbrpg/logic--armors"
import { expect } from "chai"

import * as RichText from "@monorepo-private/rich-text-format"
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { render_armor_detailed } from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - items -- armor`, function () {
	context("when not enhanced", function () {
		it("should render properly", () => {
			const $doc = render_armor_detailed(DEMO_ARMOR_1)
			const str = renderⵧto_text($doc)
			expect(str).to.be.a("string")
			expect(str).to.include("Armguards")
			expect(str).to.include("Of the ancients")
			expect(str).to.include("Bone")
			expect(str).not.to.include("+")
		})
	})

	context("when enhanced", function () {
		it("should render properly", () => {
			const $doc = render_armor_detailed(DEMO_ARMOR_2)
			const str = renderⵧto_text($doc)
			expect(str).to.be.a("string")
			expect(str).to.include("Belt")
			expect(str).to.include("Brass")
			expect(str).to.include("Apprentice’s")
			expect(str).to.include("+8")
		})
	})

	describe("demos", function () {
		it("shows off armors", () => {
			const doc1 = render_armor_detailed(DEMO_ARMOR_1)
			//console.log(prettifyꓽjson(doc1))
			let str = renderⵧto_text(doc1)
			// should just not throw

			const doc2 = render_armor_detailed(DEMO_ARMOR_2)
			//console.log(prettifyꓽjson(doc2))
			str = renderⵧto_text(doc2)
			// should just not throw

			for (let i = 0; i < 10; ++i) {
				const item = generate_random_demo_armor()
				const $doc = render_armor_detailed(item)
				//console.log(prettifyꓽjson($doc))
				const str = renderⵧto_text($doc)
				// should just not throw
			}
		})
	})
})
