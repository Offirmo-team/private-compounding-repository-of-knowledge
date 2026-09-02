import { type State } from "@tbrpg/state"

import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽrecap, renderꓽresolved_adventure, renderꓽstatus } from "../../sub-elements/index.ts"

/////////////////////////////////////////////////

export { renderꓽpanelꘌadventure }

/////////////////////////////////////////////////

function renderꓽpanelꘌadventure(
	state: Immutable<State>,
	{ mode }: { mode?: "recap" | "last_adventure" } = {},
): RichText.Document {
	const builder = RichText.fragmentⵧblock()

	if (!state.u_state.last_adventure || mode === "recap") {
		builder.pushSubNodes({ recap: getꓽrecap(state.u_state) })
	} else {
		builder.pushSubNodes({ last_adventure: renderꓽresolved_adventure(state.u_state.last_adventure) })
	}

	builder.pushHorizontalRule()

	builder.pushSubNodes({ status: renderꓽstatus(state) })

	return builder.done()
}

/////////////////////////////////////////////////
