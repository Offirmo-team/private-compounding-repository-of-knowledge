import { DEMO_STATE } from "@tbrpg/state--character"
import { expect } from "chai"

import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { renderꓽattributes, renderꓽcharacter_sheet } from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - attributes`, function () {
	describe("full character sheet rendering", function () {
		describe("demo", function () {
			it("shows off", () => {
				const $doc = renderꓽcharacter_sheet(DEMO_STATE)
				const str = renderⵧto_text($doc)
				// should just not throw
			})
		})
	})
})
