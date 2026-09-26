// TODO move UT related stuff here from offirmo and package.json

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state.pkg_infos_resolver.preload("vitest")
		state.pkg_infos_resolver.preload("chai")
		state.pkg_infos_resolver.preload("sinon")
		state.pkg_infos_resolver.preload("@types/sinon")
		state.pkg_infos_resolver.preload("mocha")
		state.pkg_infos_resolver.preload("@types/mocha")
		state.pkg_infos_resolver.preload("@types/node")

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
