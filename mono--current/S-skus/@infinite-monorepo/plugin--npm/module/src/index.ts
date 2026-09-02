/////////////////////////////////////////////////

const packageᝍlockᐧjson__path‿ar: MonorepoPathⳇRelative = `${PATHVARⵧROOTⵧMONOREPO}/package-lock.json`
export const manifestꓽpackageᝍlockᐧjson: StructuredFsⳇFileManifest = {
	path‿ar: packageᝍlockᐧjson__path‿ar,
	doc: [
		"https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json",
		"https://docs.npmjs.com/about-packages-and-modules",
	],
}

const ᐧnpmrc__path‿ar: MonorepoPathⳇRelative = `${PATHVARⵧROOTⵧMONOREPO}/.npmrc`
export const manifestꓽᐧnpmrc: StructuredFsⳇFileManifest = {
	path‿ar: ᐧnpmrc__path‿ar,
	doc: [
		"https://docs.npmjs.com/cli/v11/configuring-npm/npmrc",
		"https://pnpm.io/npmrc", // yep it's also partially used by pnpm
	],
}

// TODO config if actually using npm https://docs.npmjs.com/cli/v11/using-npm/config#engine-strict

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽpackageᝍlockᐧjson)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧnpmrc)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧgitattributes)

		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		// 1. REGARDLESS of the package manager
		switch (node?.type) {
			case "monorepo": {
				const output_specꓽᐧgitignore: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧgitignore,
					intent: "present--containing",
					content: {
						entries: [`## contains auto-generated content from @infinite-monorepo/plugin--npm`, "node_modules/"],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧgitignore)

				const output_specꓽᐧnpmrc: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧnpmrc,
					intent: "present--containing",
					content: {
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--npm`,
							`engine-strict=true`, // yep we're strict
						],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧnpmrc)

				break
			}
			default:
				break
		}

		if (StateLib.getꓽpackage_manager(state).name !== "npm") return state

		// 2. ONLY if npm is the package manager
		switch (node?.type) {
			case "monorepo": {
				const package_manager = StateLib.getꓽpackage_manager(state, node)
				const package_manager__selector = (() => {
					const vmin‿obj = semver.minVersion(package_manager.versionsⵧacceptable)
					assert(!!vmin‿obj, "semver issue")

					const relevant = [vmin‿obj.major, vmin‿obj.minor, vmin‿obj.minor]
					while (relevant.at(-1) === 0) {
						relevant.pop()
					}
					// examples features a ~^>= https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines
					// HOWEVER not having a prefix helps other tools to parse it more easily
					return `${relevant.join(".")}`
				})()

				const output_specꓽpackageᐧjson: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽpackageᐧjson,
					intent: "present--containing",
					content: {
						"// @infinite-monorepo/plugin--npm": "auto generated some content in this file",

						engines: {
							// https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines
							[package_manager.name]: package_manager__selector,
						},

						devEngines: {
							// https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devengines
							packageManager: {
								name: [package_manager.name],
								version: package_manager__selector,
								onFail: "error",
							},
						},
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽpackageᐧjson)

				const output_spec: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧgitattributes,
					intent: "present--containing",
					content: {
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--npm`,
							`package-lock.json merge=ours`, // Merge strategy
						],
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

import { manifestꓽᐧgitattributes, manifestꓽᐧgitignore } from "@infinite-monorepo/plugin--git"
import { manifestꓽpackageᐧjson } from "@infinite-monorepo/plugin--package-json"
import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent } from "@infinite-monorepo/state"
import type {
	StructuredFsⳇFileManifest,
	Node,
	MonorepoPathⳇRelative,
	State,
	Plugin,
} from "@infinite-monorepo/types-for-plugins"
import { PATHVARⵧROOTⵧMONOREPO } from "@infinite-monorepo/types-for-plugins"
import * as semver from "semver"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
