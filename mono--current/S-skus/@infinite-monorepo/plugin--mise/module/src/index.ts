/////////////////////////////////////////////////

const miseᐧtoml__path‿ar: MonorepoPathⳇRelative = `${PATHVARⵧROOTⵧMONOREPO}/mise.toml`
export const manifestꓽmiseᐧtoml: StructuredFsⳇFileManifest = {
	path‿ar: miseᐧtoml__path‿ar,
	doc: ["https://mise.jdx.dev/configuration.html"],
}

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
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
						min_version: "2026.9.14",

						// https://mise.jdx.dev/tasks/monorepo.html
						monorepo_root: true,
						monorepo: {
							// explicitly states our sub-configs = only the main one
							config_roots: ["."],
						},

						// #################################################
						// https://mise.jdx.dev/configuration/settings.html
						settings: {
							experimental: true,
							idiomatic_version_file_enable_tools: [
								//## https://mise.jdx.dev/configuration.html#idiomatic-version-files
								"node",
							],
						},

						// #################################################
						// https://mise.jdx.dev/dev-tools/
						tools: {
							// NO:
							//"npm:corepack": { version: "latest", postinstall: "corepack enable" },
							// - not needed if using mise? (Or maybe corepack is simpler? TODO review)
							//
							// NO:
							// "npm:@antfu/ni"
							// - it's up to the user to decide to use ni (most likely working with multiple repos other than this one)
							// - Also a mise-pinned ni shadows the global one and, installed via pnpm, breaks whenever the pnpm store is wiped
							//
							// NO:
							// turbo = "latest"
							// - root devDependency instead, cf. plugin--turborepo
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
export default PLUGIN

/////////////////////////////////////////////////

import { manifestꓽᐧgitignore } from "@infinite-monorepo/plugin--git"
import type { State } from "@infinite-monorepo/state"
import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent } from "@infinite-monorepo/state"
import {
	type Plugin,
	PATHVARⵧROOTⵧNODE,
	type StructuredFsⳇFileManifest,
	type Node,
	type NodePathⳇRelative,
	type RepoPathⳇRelative,
	PATHVARⵧROOTⵧREPO,
	type MonorepoPathⳇRelative,
	PATHVARⵧROOTⵧMONOREPO,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"
