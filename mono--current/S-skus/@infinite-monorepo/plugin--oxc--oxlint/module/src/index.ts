import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent, State } from "@infinite-monorepo/state"
import {
	PATHVARⵧROOTⵧNODE,
	type StructuredFsⳇFileManifest,
	type NodePathⳇRelative,
	type Node,
	type NodeⳇWorkspace,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const oxlintᐧconfigᐧts__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/oxlint.config.ts`

const manifestꓽoxlintᐧconfigᐧts: StructuredFsⳇFileManifest = {
	path‿ar: oxlintᐧconfigᐧts__path‿ar,
	format: "text", // for now TODO improve 1D
	doc: ["https://oxc.rs/docs/guide/usage/linter/config-file-reference.html"],
}

/////////////////////////////////////////////////

// TODO meta/config--oxlint

const PLUGIN: Plugin = {
	onꓽload(state: Immutable<StateLib.State>): Immutable<StateLib.State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽoxlintᐧconfigᐧts)
		state.pkg_infos_resolver.preload("oxlint")
		state.pkg_infos_resolver.preload("oxlint-tsgolint")

		return state
	},

	onꓽnodeⵧdiscoveredⵧfirst_time(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		switch (node?.type) {
			case "monorepo": {
				// TODO 1D auto create config package
				break
			}
			default:
				break
		}
		return state
	},

	onꓽnodeⵧrefine(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		switch (node?.type) {
			case "monorepo": {
				state = StateLib.addꓽdependency<NodeⳇWorkspace>(state, node, "oxlint", { type: "dev" })
				state = StateLib.addꓽdependency<NodeⳇWorkspace>(state, node, "oxlint-tsgolint", { type: "dev" })
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
				// important to help IDE when opened on the monorepo subdir = won't inherit the git level one
				const output_spec: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽoxlintᐧconfigᐧts,
					intent: "present--exact",
					content: {
						// TODO make dynamic, internal namespaces, matching editorconfig
						text: `
import { defineConfig } from "oxlint"

export default defineConfig({})
						`,
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
export { PLUGIN }
