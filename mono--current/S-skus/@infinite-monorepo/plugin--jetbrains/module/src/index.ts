/////////////////////////////////////////////////

const ᐧideaⳇᐧgitignore__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/.idea/.gitignore`
export const manifestꓽᐧideaⳇᐧgitignore: StructuredFsⳇFileManifest = {
	path‿ar: ᐧideaⳇᐧgitignore__path‿ar,
	doc: ["https://git-scm.com/docs/gitignore"],
}

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧideaⳇᐧgitignore)

		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		switch (node?.type) {
			case "monorepo": {
				const output_specꓽᐧgitignore: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧideaⳇᐧgitignore,
					intent: "present--containing",
					content: {
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--jetbrains`,

							// from default WebStorm
							"/shelf/",
							"/workspace.xml",

							// personal, pragmatic additions
							// last review 2026/09
							"*.iml", // contains local infos
						],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧgitignore)
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

import { type State, type FileOutputAbsent, type FileOutputPresent } from "@infinite-monorepo/state"
import * as StateLib from "@infinite-monorepo/state"
import {
	type StructuredFsⳇFileManifest,
	type Node,
	type Plugin,
	PATHVARⵧROOTⵧPACKAGE,
	type PackagePathⳇRelative,
	type NodeⳇPackage,
	type NodeⳇWorkspace,
	type NodePathⳇRelative,
	PATHVARⵧROOTⵧNODE,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"
