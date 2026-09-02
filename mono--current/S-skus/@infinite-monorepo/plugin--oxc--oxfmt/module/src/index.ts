import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent, State } from "@infinite-monorepo/state"
import {
	PATHVARⵧROOTⵧNODE,
	type StructuredFsⳇFileManifest,
	type NodePathⳇRelative,
	type Node,
	type NodeⳇPackage,
	type NodeⳇWorkspace,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const oxfmtᐧconfigᐧts__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/oxfmt.config.ts`

const manifestꓽoxfmtᐧconfigᐧts: StructuredFsⳇFileManifest = {
	path‿ar: oxfmtᐧconfigᐧts__path‿ar,
	format: "text", // for now TODO improve 1D
	doc: ["https://oxc.rs/docs/guide/usage/formatter/config-file-reference.html"],
}

/////////////////////////////////////////////////

const PLUGIN: Plugin = {
	onꓽload(state: Immutable<StateLib.State>): Immutable<StateLib.State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽoxfmtᐧconfigᐧts)
		state.pkg_infos_resolver.preload("oxfmt")

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
				state = StateLib.addꓽdependency<NodeⳇWorkspace>(state, node, "oxfmt", { type: "dev" })
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
					manifest: manifestꓽoxfmtᐧconfigᐧts,
					intent: "present--exact",
					content: {
						// TODO make dynamic, internal namespaces, matching editorconfig
						text: `
import { defineConfig } from "oxfmt"

export default defineConfig({
	sortImports: {
		groups: [
		["style"],
		["value-builtin",  "type-builtin"],
		["value-external", "type-external"],
		["value-internal", "type-internal"],
		["value-parent",   "type-parent"],
		["value-sibling",  "type-sibling"],
		["value-index",    "type-index"],
		"unknown"
		],
		internalPattern: [
			"@monorepo",
			"@monorepo-private",
		],
	},
	sortPackageJson: {
		sortScripts: true,
	},

	ignorePatterns: ["N-notes/", "Z-tosort/", "~~*/", "inactive/", "x-inactive/"],

	// non-defaults

	printWidth: 120,
	proseWrap: "always",

	jsdoc: true,
	semi: false,

	overrides: [
		{
			files: ["**/*.jsonc"],
			options: {
				trailingComma: "none",
			},
		},
		{
			files: ["**/*.md"],
			options: {
				printWidth: 120,
			},
		},
	],
})
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
