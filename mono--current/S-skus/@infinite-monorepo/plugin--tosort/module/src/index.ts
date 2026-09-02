/////////////////////////////////////////////////

const PLUGIN_ENTRY = Symbol("tosort")

interface PluginStateⳇSpec {}

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		//state = StateLib.declareꓽfile_manifest(state, manifestꓽpnpmᝍworkspaceᐧyaml)
		return state
	},

	onꓽnodeⵧdiscoveredⵧfirst_time(state: Immutable<State>, node: Immutable<Node>): Immutable<State> {
		// at this stage, we may not even know whether we're using pnpm or not

		switch (node.type) {
			case "monorepo": {
				break
			}
			default:
				break
		}

		return state
	},

	onꓽnodeⵧdiscoveredⵧbfs(state: Immutable<State>, node: Immutable<Node>): Immutable<State> {
		switch (node.type) {
			case "monorepo": {
				break
			}
			default:
				break
		}

		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		switch (node?.type) {
			case "monorepo": {
				break
			}
			case "package": {
				const pkg_details = node.details
				if (pkg_details._error) {
					break
				}

				if (pkg_details.depsⵧvendored.size > 0) {
					throw new Error(`Not implemented!`)
				}
				break
			}
			default:
				break
		}

		return state
	},
}

export default PLUGIN

/////////////////////////////////////////////////

import type { Plugin, Node, State } from "@infinite-monorepo/types-for-plugins"
