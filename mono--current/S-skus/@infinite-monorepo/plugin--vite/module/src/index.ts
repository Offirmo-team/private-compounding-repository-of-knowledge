/////////////////////////////////////////////////

import { assert } from "@monorepo-private/assert"

const vite_config__path‿ar: PackagePathⳇRelative = `${PATHVARⵧROOTⵧPACKAGE}/vite.config.ts`
export const manifestꓽvite_config: StructuredFsⳇFileManifest = {
	path‿ar: vite_config__path‿ar,
	format: "text", // ts not supported
	doc: ["https://vite.dev/config/"],
}

const PURE_MODULE_CONTENT_RELPATH = "module" // for now

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽvite_config)
		state.pkg_infos_resolver.preload("vite")

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
					state = StateLib.addꓽdependency(state, node, "@monorepo-private/vite--config--default", { type: "dev" })

					const VITE__COMMON_OPTIONS = ["--port 1981", "--strictPort", "--logLevel info"].join(" ")

					if (pkg_details.hasꓽstories || pkg_details.entrypointⵧstorypad) {
						assert(!!pkg_details.entrypointⵧstorypad, `Expected storypad to be defined!`)
						state = StateLib.addꓽscript(
							state,
							node,
							"_start:storypad--vite",
							`vite ${VITE__COMMON_OPTIONS} --open ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧstorypad.path‿rel)}`,
						)
						state = StateLib.addꓽscript(
							state,
							node,
							"stories",
							`npm-run-all clean --parallel _start:storypad--vite`,
						)
					}

					if (pkg_details.entrypointⵧdemo?.ext === ".html") {
						state = StateLib.addꓽscript(
							state,
							node,
							"_start:demo--vite",
							`vite ${VITE__COMMON_OPTIONS} --open ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧdemo.path‿rel)}`,
						)
						state = StateLib.addꓽscript(state, node, "demo", `npm-run-all clean --parallel _start:demo--vite`)
					}

					if (pkg_details.entrypointⵧsandbox?.ext === ".html") {
						state = StateLib.addꓽscript(
							state,
							node,
							"_start:sandbox--vite",
							`vite ${VITE__COMMON_OPTIONS} --open ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧsandbox.path‿rel)}`,
						)
						state = StateLib.addꓽscript(
							state,
							node,
							"sandbox",
							`npm-run-all clean --parallel _start:sandbox--vite`,
						)
					}

					/////// Start
					if (pkg_details.entrypointⵧmain?.ext === ".html") {
						state = StateLib.addꓽscript(
							state,
							node,
							"_start:main--vite",
							`vite ${VITE__COMMON_OPTIONS} --open ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧmain.path‿rel)}`,
						)
					}
					if (pkg_details.isꓽapp) {
						state = StateLib.addꓽscript(state, node, "start", `npm-run-all clean --parallel _start:main--vite`)
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
				break
			}

			case "package": {
				const pkg_details = node.details
				if (pkg_details._error) {
					break
				}

				const output_specꓽconfig = (() => {
					if (pkg_details.target !== "browser") {
						return {
							parent_node: node,
							path‿ar: manifestꓽvite_config.path‿ar,
							intent: "not-present",
						} satisfies FileOutputAbsent
					}

					return {
						parent_node: node,
						manifest: manifestꓽvite_config,
						intent: "present--containing",
						content: {
							text: `
import { extend_default_config } from "@monorepo-private/vite--config--default"

export default extend_default_config({})
`,
						},
					} satisfies FileOutputPresent
				})()
				state = StateLib.requestꓽfile_output(state, output_specꓽconfig)

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

import * as StateLib from "@infinite-monorepo/state"
import type {
	PackagePathⳇRelative,
	StructuredFsⳇFileManifest,
	Node,
	State,
	Plugin,
	FileOutputAbsent,
	FileOutputPresent,
} from "@infinite-monorepo/types-for-plugins"
import { type Node, PATHVARⵧROOTⵧPACKAGE, type State } from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"
