/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		//state = StateLib.declareꓽfile_manifest(state, manifestꓽpackageᐧjson)

		return state
	},

	onꓽnodeⵧrefine(state: Immutable<State>, node: Immutable<Node>) {
		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		const ǃ = assert_from({ onꓽapply: PLUGIN.onꓽapply! })

		return state
	},
}
export default PLUGIN

/////////////////////////////////////////////////

import type { Plugin, Node, State } from "@infinite-monorepo/types-for-plugins"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
