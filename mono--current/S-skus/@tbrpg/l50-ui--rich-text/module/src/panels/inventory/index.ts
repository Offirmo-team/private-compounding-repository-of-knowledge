import { type State } from "@tbrpg/state"

import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽrecap, renderꓽfull_inventory } from "../../sub-elements/index.ts"

/////////////////////////////////////////////////

export { renderꓽpanelꘌequipment }

/////////////////////////////////////////////////

function renderꓽpanelꘌequipment(state: Immutable<State>, {}: {} = {}): RichText.Document {
	const builder = RichText.fragmentⵧblock()

	builder.pushSubNodes({ inventory: renderꓽfull_inventory(state.u_state.inventory, state.u_state.wallet) })

	return builder.done()
}

/////////////////////////////////////////////////
