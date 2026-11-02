/////////////////////////////////////////////////

const ᐧideaⳇᐧgitignore__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/.idea/.gitignore`
export const manifestꓽᐧideaⳇᐧgitignore: StructuredFsⳇFileManifest = {
	path‿ar: ᐧideaⳇᐧgitignore__path‿ar,
	doc: ["https://git-scm.com/docs/gitignore"],
}

const ᐧideaⳇrequired_plugins__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/.idea/required_plugins.xml`
export const manifestꓽᐧideaⳇrequired_plugins: StructuredFsⳇFileManifest = {
	path‿ar: ᐧideaⳇrequired_plugins__path‿ar,
	doc: ["https://www.jetbrains.com/help/idea/managing-plugins.html#required-plugins"],
}

const webstormⳇtestsⵧunit__path‿ar: PackagePathⳇRelative = `${PATHVARⵧROOTⵧPACKAGE}/webstorm--tests--unit.run.xml`
export const manifestꓽwebstormⳇtestsⵧunit: StructuredFsⳇFileManifest = {
	path‿ar: webstormⳇtestsⵧunit__path‿ar,
	format: "text", // .xml is not inferrable
	doc: [
		"https://www.jetbrains.com/help/webstorm/vitest.html",
		"https://www.jetbrains.com/help/webstorm/run-debug-configuration.html#share-configurations",
	],
}

// keep in sync with the "test--vitest" script from @infinite-monorepo/plugin--pm--package-json
const VITEST_OPTIONS = `--dir module --exclude **/~~*/**` // no shell = no quotes needed

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧideaⳇᐧgitignore)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧideaⳇrequired_plugins)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽwebstormⳇtestsⵧunit)

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
							"vcs.xml", // VCS infos, IDE can regen on its own
							"modules.xml", // contains dirs added to the project, personal IMO
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
