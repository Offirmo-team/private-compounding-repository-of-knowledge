import { manifestꓽᐧgitignore } from "@infinite-monorepo/plugin--git"
import type { State, Plugin } from "@infinite-monorepo/state"
import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent } from "@infinite-monorepo/state"
import {
	PATHVARⵧROOTⵧNODE,
	type StructuredFsⳇFileManifest,
	type Node,
	type NodePathⳇRelative,
	type RepoPathⳇRelative,
	PATHVARⵧROOTⵧREPO,
	type MonorepoPathⳇRelative,
	PATHVARⵧROOTⵧMONOREPO,
} from "@infinite-monorepo/types-for-plugins"
import * as semver from "semver"

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const miseᐧtoml__path‿ar: MonorepoPathⳇRelative = `${PATHVARⵧROOTⵧMONOREPO}/mise.toml`
const manifestꓽmiseᐧtoml: StructuredFsⳇFileManifest = {
	path‿ar: miseᐧtoml__path‿ar,
	doc: ["https://mise.jdx.dev/configuration.html"],
}

/////////////////////////////////////////////////

const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧgitignore)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽmiseᐧtoml)

		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		switch (node?.type) {
			case "monorepo": {
				const output_specꓽmiseᐧtoml: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽmiseᐧtoml,
					intent: "present--containing",
					content: {
						min_version: "2026.4.18",
						experimental_monorepo_root: true,

						settings: {
							experimental: true,
							idiomatic_version_file_enable_tools: [
								//## https://mise.jdx.dev/configuration.html#idiomatic-version-files
								"node",
							],
						},

						tools: {
							"npm:corepack": { version: "latest", postinstall: "corepack enable" },
						},

						env: {
							"_.file": ".env",
						},
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽmiseᐧtoml)

				const output_spec: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧgitignore,
					intent: "present--containing",
					content: {
						entries: [`## contains auto-generated content from @infinite-monorepo/plugin--mise`, `.mise/`],
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
export { manifestꓽmiseᐧtoml }
