import { manifestꓽᐧgitignore } from "@infinite-monorepo/plugin--git"
import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent, State } from "@infinite-monorepo/state"
import {
	PATHVARⵧROOTⵧNODE,
	type StructuredFsⳇFileManifest,
	type NodePathⳇRelative,
	type Node,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"

import { CONFIGⵧDEFAULT } from "./config/index.ts"

/////////////////////////////////////////////////

const ᐧeditorconfig__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/.editorconfig`

const manifestꓽᐧeditorconfig: StructuredFsⳇFileManifest = {
	path‿ar: ᐧeditorconfig__path‿ar,
	doc: [
		"https://editorconfig.org/",
		"https://spec.editorconfig.org/",
		"https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties",
	],
}

/////////////////////////////////////////////////

const PLUGIN: Plugin = {
	onꓽload(state: Immutable<StateLib.State>): Immutable<StateLib.State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧeditorconfig)

		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		switch (node?.type) {
			case "repository": {
				const output_spec: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧeditorconfig,
					intent: "present--exact",
					content: {
						text: CONFIGⵧDEFAULT,
					},
				}
				state = StateLib.requestꓽfile_output(state, output_spec)
				break
			}

			case "monorepo": {
				// important to help IDE when opned on the monorepo subdir = won't inherit the git level one
				const output_spec: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧeditorconfig,
					intent: "present--exact",
					content: {
						text: CONFIGⵧDEFAULT,
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
export { PLUGIN, manifestꓽᐧeditorconfig }
