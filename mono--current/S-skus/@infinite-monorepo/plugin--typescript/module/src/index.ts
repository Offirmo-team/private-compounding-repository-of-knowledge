/////////////////////////////////////////////////

const tsconfigᐧjson__path‿ar: PackagePathⳇRelative = `${PATHVARⵧROOTⵧPACKAGE}/tsconfig.json`
export const manifestꓽtsconfigᐧjson: StructuredFsⳇFileManifest = {
	path‿ar: tsconfigᐧjson__path‿ar,
	doc: ["https://www.typescriptlang.org/docs/handbook/tsconfig-json.html", "https://www.typescriptlang.org/tsconfig/"],
	$schema: "https://json.schemastore.org/tsconfig",
}

/////////////////////////////////////////////////

const PLUGIN_ENTRY = Symbol("typescript")

const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧgitignore)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽtsconfigᐧjson)
		state.pkg_infos_resolver.preload("tslib")
		state.pkg_infos_resolver.preload("typescript")

		state = StateLib.reduceꓽplugin_area(state, PLUGIN_ENTRY, () => {
			return {
				config_node: undefined,
			} satisfies PluginStateⳇSpec
		})

		return state
	},

	onꓽnodeⵧdiscoveredⵧfirst_time(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		switch (node?.type) {
			case "monorepo": {
				// TODO 1D auto create config package
				break
			}

			case "package": {
				if (node.path‿ar.includes("/config--typescript")) {
					// take note
					state = StateLib.reduceꓽplugin_area(state, PLUGIN_ENTRY, () => {
						return {
							config_node: node,
						} satisfies PluginStateⳇSpec
					})
				}
				break
			}
			default:
				break
		}
		return state
	},

	onꓽnodeⵧdiscoveredⵧbfs(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		return state
	},

	onꓽnodeⵧrefine(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		switch (node?.type) {
			case "monorepo":
				state = StateLib.addꓽdependency<NodeⳇWorkspace>(state, node, "typescript", { type: "dev" })
				break

			case "package":
				if (node.details.languages.has("ts")) {
					state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "tslib", {
						type: node.details.isꓽapp ? "normal" : "peer",
					})
					state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "typescript", { type: "dev" })
					state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "@monorepo-private/config--typescript", {
						type: "dev",
					})
				}
				break

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
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--typescript`,
							`*.tsbuildinfo`, // https://www.typescriptlang.org/tsconfig/#tsBuildInfoFile
						],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧgitignore)
				break
			}

			case "package": {
				const pkg_details = node.details
				if (pkg_details._error) {
					break
				}

				const output_specꓽtsconfigᐧjson = (() => {
					if (!pkg_details.languages.has("ts")) {
						return {
							parent_node: node,
							path‿ar: manifestꓽtsconfigᐧjson.path‿ar,
							intent: "not-present",
						} satisfies FileOutputAbsent
					}

					// core, base one
					const tsconfig = {
						$schema: "https://json.schemastore.org/tsconfig",

						extends: "@monorepo-private/config--typescript/module/isomorphic/tsconfig.json",
						compilerOptions: {
							lib: [
								"ES2025", // update marker
							],
							pretty: true, // placeholder for adding stuff / helping diffs
						},
						include: [`module/**/*.ts`],
						exclude: ["**/~~*/**/*"],
					}

					// tweak
					const s = state.plugin_area[PLUGIN_ENTRY] as PluginStateⳇSpec
					if (s.config_node) {
						tsconfig.include.unshift(
							"./node_modules/@monorepo-private/config--typescript/module/_custom-typings/*.d.ts",
							//path.relative(node.path‿abs, path.resolve(s.config_node.path‿abs, "module/_custom-typings")) + "/*.d.ts",
						)
					}

					if (pkg_details.target === "browser") {
						tsconfig.compilerOptions.lib.push("DOM")
						tsconfig.include.push(`module/**/*.tsx`)
					}

					// TODO 1D improve with multi tsconfigs
					if (pkg_details.target === "browser") {
						tsconfig.extends = "@monorepo-private/config--typescript/module/dom/tsconfig.json"
					} else /* if (pkg_details.depsⵧdev.has("@types/node") || pkg_details.hasꓽtestsⵧunit)*/ {
						// TODO 1D split unit tests from isomorphic
						// default to node for unit tests
						tsconfig.extends = "@monorepo-private/config--typescript/module/node/tsconfig.json"
					}

					// TODO more clever
					if (tsconfig.compilerOptions.lib.join(",") === "ES2025") {
						// noise
						delete tsconfig.compilerOptions.lib
					}

					return {
						parent_node: node,
						manifest: manifestꓽtsconfigᐧjson,
						intent: "present--containing",
						content: tsconfig,
					} satisfies FileOutputPresent
				})()
				state = StateLib.requestꓽfile_output(state, output_specꓽtsconfigᐧjson)

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

interface PluginStateⳇSpec {
	config_node: undefined | Immutable<NodeⳇPackage> // TODO remove unneeded
}

/////////////////////////////////////////////////

import { manifestꓽᐧgitignore } from "@infinite-monorepo/plugin--git"
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
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"
