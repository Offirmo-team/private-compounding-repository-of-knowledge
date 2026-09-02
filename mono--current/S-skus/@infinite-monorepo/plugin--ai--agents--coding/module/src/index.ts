/////////////////////////////////////////////////

const AGENTSᐧmd__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/AGENTS.md`
const manifestꓽAGENTSᐧmd: StructuredFsⳇFileManifest = {
	path‿ar: AGENTSᐧmd__path‿ar,
	doc: ["https://agents.md/"],
}

const ᐧaiignore__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/.aiignore`
const manifestꓽᐧaiignore: StructuredFsⳇFileManifest = {
	path‿ar: ᐧaiignore__path‿ar,
	doc: [
		"https://www.jetbrains.com/help/ai-assistant/disable-ai-assistant.html#restrict-ai-assistant-usage-in-specific-files-or-folders",
	],
}

const CLAUDEᐧmd__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/.claude/CLAUDE.md`
const manifestꓽCLAUDEᐧmd: StructuredFsⳇFileManifest = {
	path‿ar: CLAUDEᐧmd__path‿ar,
	doc: ["https://claude.md/", "https://code.claude.com/docs/en/memory"],
}

/////////////////////////////////////////////////

// TODO https://gastownhall.github.io/beads/cli-reference/create

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽAGENTSᐧmd)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽCLAUDEᐧmd)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧaiignore)

		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		switch (node?.type) {
			case "monorepo": {
				const output_specꓽAGENTSᐧmd: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽAGENTSᐧmd,
					intent: "present",
					content: {
						// TODO review
						text: `
# AGENTS.md

## Project overview

## Build and test commands

## Code style guidelines

## Testing instructions

## Security considerations
`,
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽAGENTSᐧmd)

				const output_specꓽᐧagentsⳇskillsⳇ: FileOutputPresent = {
					parent_node: node,
					manifest: {
						path‿ar: `${PATHVARⵧROOTⵧNODE}/.agents/skills/.keep`,
						doc: ["https://code.claude.com/docs/en/skills", "https://github.com/bgreenwell/dotagents"],
					},
					intent: "present",
					content: {
						entries: [`https://code.claude.com/docs/en/skills`],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧagentsⳇskillsⳇ)

				const output_specꓽCLAUDEᐧmd: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽCLAUDEᐧmd,
					intent: "present--exact", // plugins should use AGENTS.md
					content: {
						text: "@../AGENTS.md", // cf. https://code.claude.com/docs/en/memory#agents-md
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽCLAUDEᐧmd)

				const output_specꓽᐧaiignore: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧaiignore,
					intent: "present--containing",
					content: {
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--ai--agents--coding`,
							`## https://www.jetbrains.com/help/ai-assistant/disable-ai-assistant.html#restrict-ai-assistant-usage-in-specific-files-or-folders`,
						],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧaiignore)
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

import type { State, Plugin } from "@infinite-monorepo/state"
import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent } from "@infinite-monorepo/state"
import {
	PATHVARⵧROOTⵧNODE,
	type StructuredFsⳇFileManifest,
	type Node,
	type NodePathⳇRelative,
} from "@infinite-monorepo/types-for-plugins"
import * as semver from "semver"

import type { Immutable } from "@monorepo-private/ts--types"
