import { manifestꓽᐧgitignore } from "@infinite-monorepo/plugin--git"
import type { State, Plugin } from "@infinite-monorepo/state"
import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent } from "@infinite-monorepo/state"
import { type Node, type NodeⳇWorkspace } from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

// TODO turbo.jsonc

/////////////////////////////////////////////////

const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧgitignore)
		state.pkg_infos_resolver.preload("turbo")

		return state
	},

	onꓽnodeⵧdiscoveredⵧfirst_time(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		return state
	},

	onꓽnodeⵧrefine(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		switch (node?.type) {
			case "monorepo": {
				state = StateLib.addꓽdependency<NodeⳇWorkspace>(state, node, "turbo", { type: "dev" })
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
				const output_spec: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧgitignore,
					intent: "present--containing",
					content: {
						entries: [`## contains auto-generated content from @infinite-monorepo/plugin--turborepo`, `.turbo/`],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_spec)
				break
			}
			default:
				break
		}

		return state
	},
}

/////////////////////////////////////////////////

export default PLUGIN
