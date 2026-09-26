/////////////////////////////////////////////////

// TODO turbo.jsonc

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
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
				const output_specꓽᐧgitignore: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧgitignore,
					intent: "present--containing",
					content: {
						entries: [`## contains auto-generated content from @infinite-monorepo/plugin--turborepo`, `.turbo/`],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧgitignore)

				const output_specꓽmiseᐧtoml: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽmiseᐧtoml,
					intent: "present--containing",
					content: {
						tools: {
							turbo: "latest", // TODO pin?
						},
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽmiseᐧtoml)

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

import { manifestꓽᐧgitignore } from "@infinite-monorepo/plugin--git"
import { manifestꓽmiseᐧtoml } from "@infinite-monorepo/plugin--mise"
import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent } from "@infinite-monorepo/state"
import type { State, Plugin, Node, NodeⳇWorkspace } from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"
