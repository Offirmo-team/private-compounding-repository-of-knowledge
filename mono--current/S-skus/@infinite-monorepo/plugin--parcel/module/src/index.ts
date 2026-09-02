/////////////////////////////////////////////////

import { assert } from "@monorepo-private/assert"

const ᐧparcelrc__path‿ar: PackagePathⳇRelative = `${PATHVARⵧROOTⵧPACKAGE}/.parcelrc`
export const manifestꓽᐧparcelrc: StructuredFsⳇFileManifest = {
	path‿ar: ᐧparcelrc__path‿ar,
	doc: ["https://parceljs.org/features/plugins/", "https://parceljs.org/plugin-system/configuration/"],
}

const PURE_MODULE_CONTENT_RELPATH = "module" // for now

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧgitignore)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧparcelrc)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽpackageᐧjson)
		state.pkg_infos_resolver.preload("parcel")

		return state
	},

	onꓽnodeⵧrefine(state: Immutable<State>, node: Immutable<Node>) {
		switch (node?.type) {
			case "monorepo": {
				// TODO 1D create shared config
				break
			}

			case "package": {
				const pkg_details = node.details
				if (pkg_details._error) {
					break
				}

				if (pkg_details.target === "browser") {
					state = StateLib.addꓽdependency(state, node, "@monorepo-private/parcel-config", {
						type: "dev",
					})

					const PARCEL__COMMON_OPTIONS = [
						"--port 1981", // because parcel caches with bugs, so we can't have several running anyway
						"--lazy", // because faster
						"--no-autoinstall", // we don't want to auto-install anything, if missing = it's on us
						//'--no-hmr', // because of bug https://github.com/parcel-bundler/parcel/issues/8181
						// it seems to work for now...
					].join(" ")

					if (pkg_details.hasꓽstories || pkg_details.entrypointⵧstorypad) {
						assert(!!pkg_details.entrypointⵧstorypad, `Expected storypad to be defined!`)
						state = StateLib.addꓽscript(
							state,
							node,
							"_start:storypad--parcel",
							`parcel serve ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧstorypad.path‿rel)} ${PARCEL__COMMON_OPTIONS}`,
						)

						state = StateLib.addꓽscript(
							state,
							node,
							"storiesp",
							`npm-run-all clean --parallel _start:storypad--parcel`,
						)
					}
					if (pkg_details.entrypointⵧdemo) {
						switch (pkg_details.entrypointⵧdemo.ext) {
							case ".html": {
								state = StateLib.addꓽscript(
									state,
									node,
									"_start:demo--parcel",
									`parcel serve ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧdemo.path‿rel)} ${PARCEL__COMMON_OPTIONS}`,
								)
								state = StateLib.addꓽscript(
									state,
									node,
									"demop",
									`npm-run-all clean --parallel _start:demo--parcel`,
								)
								break
							}

							default:
								break
						}
					}
					if (pkg_details.entrypointⵧsandbox) {
						switch (pkg_details.entrypointⵧsandbox.ext) {
							case ".html": {
								state = StateLib.addꓽscript(
									state,
									node,
									"_start:sandbox--parcel",
									`parcel serve ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧsandbox.path‿rel)} ${PARCEL__COMMON_OPTIONS}`,
								)
								state = StateLib.addꓽscript(
									state,
									node,
									"sandboxp",
									`npm-run-all clean --parallel _start:sandbox--parcel`,
								)

								break
							}

							default:
								break
						}
					}

					/////// Start
					if (pkg_details.entrypointⵧmain?.ext === ".html") {
						state = StateLib.addꓽscript(
							state,
							node,
							"_start:main--parcel",
							`parcel serve ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧmain.path‿rel)} ${PARCEL__COMMON_OPTIONS}`,
						)
					}
					if (pkg_details.isꓽapp && pkg_details.target === "browser") {
						state = StateLib.addꓽscript(state, node, "startp", `npm-run-all clean --parallel _start:main--parcel`)
					}
				}

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
				const output_spec: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧgitignore,
					intent: "present--containing",
					content: {
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--parcel`,
							`.parcel`, // parcel 1 TODO cleanup
							`.parcel-cache`, // parcel 2
						],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_spec)

				const output_packageᐧjson: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽpackageᐧjson,
					intent: "present--containing",
					content: {
						"// @infinite-monorepo/plugin--parcel": "auto generated some content in this file",
						// https://parceljs.org/features/dependency-resolution/#enabling-package-exports
						"@parcel/resolver-default": {
							packageExports: true,
						},
					},
				}
				state = StateLib.requestꓽfile_output(state, output_packageᐧjson)

				break
			}

			case "package": {
				const pkg_details = node.details
				if (pkg_details._error) {
					break
				}

				const output_specꓽᐧparcelrc = (() => {
					if (pkg_details.target !== "browser") {
						return {
							parent_node: node,
							path‿ar: manifestꓽᐧparcelrc.path‿ar,
							intent: "not-present",
						} satisfies FileOutputAbsent
					}

					return {
						parent_node: node,
						manifest: manifestꓽᐧparcelrc,
						intent: "present--containing",
						content: {
							extends: "@monorepo-private/parcel-config",
						},
					} satisfies FileOutputPresent
				})()
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧparcelrc)

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

import path from "node:path"

import { manifestꓽᐧgitignore } from "@infinite-monorepo/plugin--git"
import { manifestꓽpackageᐧjson } from "@infinite-monorepo/plugin--package-json"
import * as StateLib from "@infinite-monorepo/state"
import { PATHVARⵧROOTⵧPACKAGE } from "@infinite-monorepo/types-for-plugins"
import type {
	State,
	Plugin,
	FileOutputAbsent,
	FileOutputPresent,
	StructuredFsⳇFileManifest,
	Node,
	PackagePathⳇRelative,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"
