import { create, play, getꓽachievements_snapshot } from "@tbrpg/state"
import { expect } from "chai"

import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { renderꓽachievements_snapshot } from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - achievements`, function () {
	it("should render properly - demo", () => {
		const state = play(create())

		const $doc = renderꓽachievements_snapshot(getꓽachievements_snapshot(state.u_state))
		//console.log(prettifyꓽjson($doc))
		const str = renderⵧto_text($doc)
		//console.log(str)
		expect(str).to.be.a("string")
		expect(str).to.include("Achievements")
		expect(str).to.include("✔")
		expect(str).to.include("???")
	})
})
