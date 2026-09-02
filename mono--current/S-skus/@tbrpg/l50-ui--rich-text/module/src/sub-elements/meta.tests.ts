import { DEMO_STATE } from "@oh-my-rpg/state--meta"
import { expect } from "chai"

import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import {
	//render_account_info,
	renderꓽgame_info,
} from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - meta`, function () {
	describe("game infos", function () {
		it("works", () => {
			const $doc = renderꓽgame_info()
			//console.log(prettifyꓽjson($doc))
			const str = renderⵧto_text($doc)
			// should just not throw
			//console.log(str)
		})
	})
})
