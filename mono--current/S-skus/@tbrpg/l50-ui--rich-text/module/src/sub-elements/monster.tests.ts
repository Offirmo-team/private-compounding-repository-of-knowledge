import { generate_random_demo_monster } from "@tbrpg/logic--monsters"
import { expect } from "chai"

import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { render_monster } from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - monster`, function () {
	describe("demo", function () {
		it("shows off", () => {
			for (let i = 0; i < 10; ++i) {
				const m = generate_random_demo_monster()
				const $doc = render_monster(m)
				//console.log(prettifyꓽjson($doc))
				const str = renderⵧto_text($doc)
				// should just not throw
			}
		})
	})
})
