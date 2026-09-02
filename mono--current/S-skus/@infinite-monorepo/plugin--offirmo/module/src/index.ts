/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<StateLib.State>): Immutable<StateLib.State> {
		// utils
		state.pkg_infos_resolver.preload("zx")
		state.pkg_infos_resolver.preload("npm-run-all")

		// UT
		state.pkg_infos_resolver.preload("vitest")
		state.pkg_infos_resolver.preload("chai")
		state.pkg_infos_resolver.preload("sinon")
		state.pkg_infos_resolver.preload("@types/sinon")
		state.pkg_infos_resolver.preload("mocha")
		state.pkg_infos_resolver.preload("@types/node")

		// overrides
		state.pkg_infos_resolver.declareꓽversion_override("fraction.js", "^4") // v5+ switched to BigInt, which is not json-compatible unless we switch to superjson
		state.pkg_infos_resolver.declareꓽversion_override("typescript", "^6") // need to switch away from parse-ts-import

		return state
	},

	onꓽnodeⵧdiscoveredⵧfirst_time(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		switch (node?.type) {
			case "monorepo": {
				// NOTE THIS = FOR TEMP REPOS ONLY
				if (state.specⵧroot.workspaces.length === 0) {
					// auto offirmo mode
					state = {
						...state,
						specⵧroot: {
							...state.specⵧroot,
							workspaces: [
								"0-meta/*",
								"1-isomorphic/*",
								"2-engine--winter/*",
								"3-engine--node/*",
								"4-engine--browser/*",
								"H-hello-world/",
							],
						},
					}
				}

				// TODO 1D auto create packages

				break
			}
			default:
				break
		}
		return state
	},

	onꓽnodeⵧdiscoveredⵧbfs(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		switch (node?.type) {
			case "monorepo": {
				// when staying on LTS, @types should not pick latest non-LTS
				const rl = StateLib.getꓽruntimeⵧlocal(state, node)
				if (rl.name === "node") {
					state.pkg_infos_resolver.declareꓽversion_override("@types/node", rl.versionsⵧacceptable)
				}
				break
			}
			default:
				break
		}
		return state
	},

	onꓽnodeⵧrefine(state: Immutable<StateLib.State>, node: Immutable<Node>): Immutable<StateLib.State> {
		switch (node?.type) {
			case "monorepo":
				state = StateLib.addꓽdependency<NodeⳇWorkspace>(state, node, "zx", { type: "dev" })

				state = StateLib.addꓽscript<NodeⳇWorkspace>(state, node, "check:boundaries", "turbo boundaries")
				state = StateLib.addꓽscript<NodeⳇWorkspace>(state, node, "clean:x", ".config/mise/tasks/clean.bash") // TODO refine

				/* TODO re-add scripts
				"_clean--all--cmd": "bolt ws run clean",
				"_clean--all--rm": "bolt ws exec -- rm -rf .cache .parcel .parcel-cache node_modules",
				"_clean--root": "rm -rf node_modules .npm npm-debug.log package-lock.json yarn.lock yarn-error.log .yalc .awcache .parcel .parcel-cache bower_components typings",

				"build": "bolt ws run build",

				"clean": "run-s  _clean--all--cmd _clean--all--rm _clean--root",
				"clean-deps": "run-s  _clean--all--rm _clean--root",

				"manypkg--check": "manypkg check",
				"manypkg--fix": "manypkg fix",

				"serve": "serve --listen 1987 --debug",
				"serve--pub": "ngrok http 1987 --domain=national-rat-supreme.ngrok-free.app",
				"serve--pub--dev": "ngrok http 8080 --domain=national-rat-supreme.ngrok-free.app",

				"test": "bolt ws run test"
				*/

				break
			case "package":
				// encourage best practices
				if (node.details.languages.has("js") || node.details.languages.has("ts")) {
					if (node.path‿abs.includes("0-meta")) {
						// no: minimal deps
						// TODO improve "rings"
					} else {
						// utils
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "npm-run-all", { type: "dev" })
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "@monorepo-private/scripts", {
							type: "dev",
						})

						// assertion lib
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "@monorepo-private/assert", {
							type: "normal",
						})

						// unit tests
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "@monorepo-private/config--mocha", {
							type: "dev",
						})
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "vitest", {
							type: "dev",
						})
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "chai", {
							type: "dev",
						})
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "sinon", {
							type: "dev",
						})
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "@types/sinon", {
							type: "dev",
						})
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "mocha", {
							type: "dev",
						})
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "@types/mocha", {
							type: "dev",
						})
						state = StateLib.addꓽdependency<NodeⳇPackage>(state, node, "@types/node", {
							type: "dev",
						})
					}
				}

				// TODO also cross-cutting

				break

			default:
				break
		}
		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		switch (node?.type) {
			case "monorepo": {
				;(function _static_files() {
					const files = {
						"README.md": {
							text: `# monorepo

auto-generated by @infinite-monorepo`,
						},

						"##CONTRIBUTING/01-intro.md": {
							text: `## Introduction
Welcome to this repo, thanks for browsing! (and maybe contributing?)`,
						},
						"##CONTRIBUTING/##ADR/README.md": {
							text: `## Architectural Decisions Record

https://adr.github.io/
* An Architectural Decision (AD) is a justified design choice that addresses a functional or non-functional requirement that is architecturally significant
* An Architecturally Significant Requirement (ASR) is a requirement that has a measurable effect on the architecture and quality of a software and/or hardware system
* An Architectural Decision Record (ADR) captures a single AD and its rationale; Put it simply, ADR can help you understand the reasons for a chosen architectural decision, along with its trade-offs and consequences

The collection of ADRs created and maintained in a project constitute its decision log.`,
						},
						"##CONTRIBUTING/~~history/README.md": {
							text: `## Superseded/legacy docs for reference`,
						},
						"0-meta/README.md": {
							text: `# Meta

Stuff not related to our "features" code but to the codebase / monorepo itself.

Note: changes to packages in this folder may warrant a bump to TURBO_CACHE_BUSTING if not picked up properly by turbo
(if unsure, bump, should only lose a bit of caching)
`,
						},
						"1-isomorphic/README.md": { text: `# Isomorphic packages` },
						"2-engine--winter/README.md": {
							text: `# Web-interoperable Server Runtimes (Winter) packages

https://wintertc.org/`,
						},
						"3-engine--node/README.md": { text: `# node.js packages` },
						"4-engine--browser/README.md": { text: `# Browser packages` },
						"7-multimorphic/README.md": { text: `# Advanced multi-target packages` },
						"S-skus/README.md": {
							text: `# Stock Keeping Units

Public, final products
`,
						},
					}
					if (node.path‿abs.includes("hello-world")) {
						files["H-hello-world/README.md"] = {
							text: `# Hello, World!
\`\`\`
pnpm init
pnpm i ...
\`\`\`
`,
						}
						files["H-hello-world/package.json"] = {
							name: "@monorepo-private/hello-world",
							version: "0.0.1",
							type: "module",
							dependencies: {},
							scripts: {
								// TODO should be auto
								start: "node --env-file-if-exists=.env.local ./src/index.ts",
							},
						}
						files["H-hello-world/src/index.ts"] = {
							text: `console.log('hello world!')`,
						}
						files["H-hello-world/.env.local"] = {
							text: ``,
						}
						files["H-hello-world/.env.example"] = {
							text: ``,
						}
					}

					Object.entries(files).forEach(([path‿ar, content]) => {
						const output_spec: FileOutputPresent = {
							parent_node: node,
							manifest: {
								path‿ar: `${PATHVARⵧROOTⵧNODE}/${path‿ar}`,
								doc: [],
							},
							intent: "present",
							content,
						}
						state = StateLib.requestꓽfile_output(state, output_spec)
					})
				})()

				;(function _aliases() {
					const package_nodes = Object.values(state.graphs.nodesⵧworkspace)
						.filter((node) => node.type === "package")
						.sort((n1, n2) => {
							return n1.path‿abs.localeCompare(n2.path‿abs)
						})

					const monorepo_root_node = node

					state = StateLib.requestꓽfile_output(state, {
						parent_node: monorepo_root_node,
						intent: "present--exact",
						manifest: {
							path‿ar: `${PATHVARⵧROOTⵧNODE}/.monorepo/bin/aliases.sh`,
							format: "text",
							doc: [],
						},
						content: {
							text:
								`
#@IgnoreInspection BashAddShebang
[[ "$VERBOSE__RC" == true ]] && echo "$(date +%H:%M:%S)   ↳ […monorepo/…/aliases.sh] hello!"

export MONOREPO_ROOT__CURRENT=\${MONOREPO_ROOT__CURRENT:-"$HOME/work/src/x-external/off/offirmo/offirmo-monorepo/stack--current/"};

` +
								package_nodes
									.map((node) => {
										const alias_name = `mono.${node.details.namespace}.${node.details.name}`
										const relative_path = path.relative(monorepo_root_node.path‿abs, node.path‿abs)
										// TODO 1D re-activate tabset (not in Warp) tabset --badge ${node.details.fqname} https://github.com/warpdotdev/warp/issues/2743#issuecomment-4422611574
										return `
alias  ${alias_name}='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd ${relative_path}/'
`.trim()
									})
									.join("\n"),
						},
					} satisfies FileOutputPresent)
				})()

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

import * as path from "node:path"

import { manifestꓽpnpmᝍworkspaceᐧyaml } from "@infinite-monorepo/plugin--pnpm"
import * as StateLib from "@infinite-monorepo/state"
import { type FileOutputPresent, getꓽnodeⵧmonorepo, getꓽruntimeⵧlocal, type State } from "@infinite-monorepo/state"
import {
	type Node,
	type Plugin,
	PATHVARⵧROOTⵧNODE,
	type NodeⳇPackage,
	type NodeⳇWorkspace,
	type StructuredFsⳇFileManifest,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable, JSONObject } from "@monorepo-private/ts--types"
import { isꓽError } from "@monorepo-private/utils--error/v2"
