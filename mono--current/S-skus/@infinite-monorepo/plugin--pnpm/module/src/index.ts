/////////////////////////////////////////////////

const pnpmᝍworkspaceᐧyaml__path‿ar: MonorepoPathⳇRelative = `${PATHVARⵧROOTⵧMONOREPO}/${WORKSPACE_MANIFEST_FILENAME}`
export const manifestꓽpnpmᝍworkspaceᐧyaml: StructuredFsⳇFileManifest = {
	path‿ar: pnpmᝍworkspaceᐧyaml__path‿ar,
	doc: ["https://pnpm.io/settings", "https://pnpm.io/pnpm-workspace_yaml"],
}

const ᐧpnpmfileᐧmjs__path‿ar: MonorepoPathⳇRelative = `${PATHVARⵧROOTⵧMONOREPO}/.pnpmfile.mjs`
export const manifestꓽᐧpnpmfileᐧmjs: StructuredFsⳇFileManifest = {
	path‿ar: ᐧpnpmfileᐧmjs__path‿ar,
	doc: ["https://pnpm.io/pnpmfile"],
}

/////////////////////////////////////////////////

const PLUGIN_ENTRY = Symbol("pnpm")

type PnpmSpec = JSONObject // TODO

interface PluginStateⳇSpec {
	spec: PnpmSpec
}

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽpnpmᝍworkspaceᐧyaml)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧpnpmfileᐧmjs)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧgitignore)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧgitattributes)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽmiseᐧtoml)
		state.pkg_infos_resolver.preload("pnpm")

		return state
	},

	onꓽnodeⵧdiscoveredⵧfirst_time(state: Immutable<State>, node: Immutable<Node>): Immutable<State> {
		// at this stage, we may not even know whether we're using pnpm or not

		switch (node.type) {
			case "monorepo": {
				// init plugin state
				const plugin_state: PluginStateⳇSpec = {
					spec: {
						...mergeⵧdeep(getꓽconfigⵧv11ⵧRECOMMENDED(), state.specⵧroot.package_manager__config ?? {}),
					},
				}

				state = StateLib.reduceꓽplugin_area(state, PLUGIN_ENTRY, () => plugin_state)

				// read foreign source of truth
				// we need it even if SSoT, some facts are hard to SSoT
				state = StateLib.requestꓽfactsⵧabout_file(state, manifestꓽpnpmᝍworkspaceᐧyaml, node, (state, result) => {
					if (!result) {
						// no file = fact "not using pnpm" (or not set yet)
						return state // don't touch anything
					}

					if (isꓽError(result)) {
						// file present but problem reading it
						// This need higher intervention
						throw result
					}

					// file found, infer pnpm is used + other spec items
					// TODO 1D conflict detection

					if (state.specⵧroot.mode === "SSoT") {
						// no need for discovery of current state
						// but allowBuilds is needed
						state = StateLib.reduceꓽplugin_area<PluginStateⳇSpec>(state, PLUGIN_ENTRY, (ps) => {
							return {
								...ps,
								spec: {
									...ps.spec,
									allowBuilds: {
										...ps.spec.allowBuilds,
										...result.dataⵧjson.allowBuilds,
									},
								},
							}
						})
					} else {
						const { packages } = result
						if (!packages) {
							// @infinite-monorepo is for complex monorepos, this SHOULD be here
							if (!state.specⵧroot.workspaces.length) {
								throw new Error(`pnpm plugin: couldn't find packages/workspace lines!`)
							}
						}

						state = {
							...state,
							spec: {
								...state.specⵧroot,
								package_manager: "pnpm", // TODO 1D detect version
								workspaces_lines: (() => {
									const MONOREPO_WORKSPACES_RELPATHS = packages as string[]
									throw new Error("Not implemented hybrid fusion?")
								})(),
							},
						}
					}

					return state
				})
				break
			}
			default:
				break
		}

		return state
	},

	onꓽnodeⵧdiscoveredⵧbfs(state: Immutable<State>, node: Immutable<Node>): Immutable<State> {
		if (StateLib.getꓽpackage_manager(state).name !== "pnpm") return state

		switch (node.type) {
			case "monorepo": {
				const MONOREPO_WORKSPACES_RELPATHS = StateLib.getꓽworkspace_lines(state)
				// https://pnpm.io/workspaces

				const nodeⵧmonorepo = node

				MONOREPO_WORKSPACES_RELPATHS.forEach((workspace_line) => {
					/* TODO 1D WorkspaceLine (unused atm)
						const line_node: NodeⳇWorkspaceLine = {
									type: "workspace__line",
									parent_id: node.path‿abs,
									path‿ar: `${PATHVARⵧROOTⵧMONOREPO}/${path_rel}`,
									path‿abs: path.join(node.path‿abs, path_rel) + "/",
									plugin_area: {},
								}
														state = StateLib.registerꓽnode(state, line_node)
 */
					const parent_node = nodeⵧmonorepo

					// TODO beware path traversal
					// TODO 1D use the exact same algorithm/blob as pnpm
					const candidates‿Dirent = globSync(workspace_line, {
						cwd: nodeⵧmonorepo.path‿abs,
						// exclude: TODO 1D (supported by pnpm)
						withFileTypes: true, // strange param, returns a more detailed "Dirent" structure allowing to check if folder
					}).filter((d) => d.isDirectory())
					candidates‿Dirent.forEach((dirent) => {
						//console.log(dirent)

						const path‿abs: DirPathⳇAbsolute = path.join(dirent.parentPath, dirent.name) + "/"

						// check if empty (pnpm does it)
						const hasꓽcontentⵧdirs =
							lsDirsSync(path‿abs, {
								full_path: false,
							}).filter((relpath) => {
								// TODO filter out common
								return true
							}).length > 0
						const hasꓽcontentⵧfiles =
							lsFilesSync(path‿abs, {
								full_path: false,
							}).filter((relpath) => {
								// TODO filter out common
								return true
							}).length > 0

						if (!hasꓽcontentⵧdirs && !hasꓽcontentⵧfiles) {
							// empty dir, ignore
							return
						}

						const pkg_node: NodeⳇForꓽregisterꓽnode<NodeⳇPackage> = {
							type: "package",
							path‿abs,
							spec: {},
							details: PkgDetailsLib.create(path‿abs, state.specⵧroot.namespaceⵧprivate),
						}
						state = StateLib.registerꓽnode<NodeⳇPackage>(state, pkg_node, parent_node)
					})
				})
				break
			}
			default:
				break
		}

		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		if (StateLib.getꓽpackage_manager(state).name !== "pnpm") return state

		switch (node?.type) {
			case "monorepo": {
				const { spec } = state.plugin_area[PLUGIN_ENTRY]

				const output_specꓽpnpmᝍworkspaceᐧyaml: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽpnpmᝍworkspaceᐧyaml,
					intent: "present--containing",
					content: {
						...spec,
						packages: [...state.specⵧroot.workspaces],
						catalog: state.pkg_infos_resolver.get_catalogꘌdefault(),
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽpnpmᝍworkspaceᐧyaml)

				const output_specꓽpackageᐧjson: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽpackageᐧjson,
					intent: "present--containing",
					content: {
						// TODO dynamic
						engines: {
							pnpm: ">=11",
						},
						// very important https://turborepo.dev/docs/getting-started/add-to-existing-repository#add-a-packagemanager-field-to-root-packagejson
						packageManager:
							"pnpm@11.10.0+sha512.0b7f8b98060031904c017e3a41eb187a16d40eeb829b95c4f8cb03681761fc4ab53dd219115b9b447f4dce1a05a214764461e7d3703392a9f32f9511ce8c86c8",
						// "pnpm@11.6.0+sha512.9a36518224080c6fe5165afdcfe79bfa118c29be703f3f462b1e32efe1e98e47e8750b148e08286250aad4113cc7993ca413c4e2cd447752708c2ee5751bc95f",
						// "pnpm@11.4.0+sha512.f0febc7e37552ab485494a914241b338e0b3580b93d54ce31f00933015880863129038a1b4ae4e414a0ee63ac35bf21197e990172c4a68256450b5636310968f",
						// "pnpm@11.2.2+sha512.36e6621fad506178936455e70247b8808ef4ec25797a9f437a93281a020484e2607f6a469a22e982987c3dbb8866e3071514ab10a4a1749e06edcd1ec118436f",
						// "pnpm@10.32.1+sha512.a706938f0e89ac1456b6563eab4edf1d1faf3368d1191fc5c59790e96dc918e4456ab2e67d613de1043d2e8c81f87303e6b40d4ffeca9df15ef1ad567348f2be",
						// 'pnpm@10.18.2+sha512.9fb969fa749b3ade6035e0f109f0b8a60b5d08a1a87fdf72e337da90dcc93336e2280ca4e44f2358a649b83c17959e9993e777c2080879f3801e6f0d999ad3dd',
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽpackageᐧjson)

				const output_specꓽᐧgitignore: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧgitignore,
					intent: "present--containing",
					content: {
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--pnpm`,

							"node_modules/",
						],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧgitignore)

				const output_specꓽᐧgitattributes: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧgitattributes,
					intent: "present--containing",
					content: {
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--pnpm`,
							`${WANTED_LOCKFILE} merge=ours`, // Merge strategy
						],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧgitattributes)

				const output_specꓽmiseᐧtoml: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽmiseᐧtoml,
					intent: "present--containing",
					content: {
						deps: {
							// https://mise.jdx.dev/dev-tools/deps.html
							pnpm: {
								auto: true, // Auto-run pnpm before mise execute/run if needed
							},
						},
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽmiseᐧtoml)

				const output_specꓽᐧnpmrc: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧnpmrc,
					intent: "present--containing",
					content: {
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--pnpm`,
							"## do not add any pnpm settings here, will be deprecated in pnpm@11: pnpm-workspace.yaml is the single source of truth",
						],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧnpmrc)

				break
			}
			case "package": {
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

import { globSync } from "node:fs"
import path from "node:path"

import * as PkgDetailsLib from "@infinite-monorepo/package-details"
import { manifestꓽᐧgitignore, manifestꓽᐧgitattributes } from "@infinite-monorepo/plugin--git"
import { manifestꓽmiseᐧtoml } from "@infinite-monorepo/plugin--mise"
import { manifestꓽᐧnpmrc } from "@infinite-monorepo/plugin--npm"
import { manifestꓽpackageᐧjson } from "@infinite-monorepo/plugin--package-json"
import { type NodeⳇForꓽregisterꓽnode, reduceꓽnode, type State } from "@infinite-monorepo/state"
import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent } from "@infinite-monorepo/state"
import {
	type Plugin,
	type StructuredFsⳇFileManifest,
	type Node,
	type MonorepoPathⳇRelative,
	PATHVARⵧROOTⵧMONOREPO,
	type NodeⳇPackage,
} from "@infinite-monorepo/types-for-plugins"
import { WORKSPACE_MANIFEST_FILENAME, WANTED_LOCKFILE } from "@pnpm/constants" // https://github.com/pnpm/pnpm/blob/main/core/constants/src/index.ts

import { lsDirsSync, lsFilesSync } from "@monorepo-private/fs--ls"
import { mergeⵧdeep } from "@monorepo-private/merge"
import type {
	DirPathⳇAbsolute,
	DirPathⳇRelative,
	Immutable,
	JSONObject,
	PathⳇAbsolute,
} from "@monorepo-private/ts--types"
import { isꓽError } from "@monorepo-private/utils--error/v2"

import { getꓽconfigⵧv11ⵧRECOMMENDED } from "./config/workspace.ts"
