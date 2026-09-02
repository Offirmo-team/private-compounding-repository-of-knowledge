/////////////////////////////////////////////////

const plugins: Record<string, Plugin> = {
	// TODO a way to include on-demand
	pluginꓽoffirmo,
	pluginꓽtosort,

	pluginꓽaiᝍᝍagentsᝍᝍcoding,
	pluginꓽbolt,
	pluginꓽchangelog,
	pluginꓽeditorconfig,
	pluginꓽgit,
	pluginꓽjetbrains,
	pluginꓽlicense,
	pluginꓽmise,
	pluginꓽnpm,
	pluginꓽnvm,
	pluginꓽoxcᝍᝍoxfmt,
	pluginꓽoxcᝍᝍoxlint,
	pluginꓽpackageᐧjson,
	pluginꓽparcel,
	pluginꓽpnpm,
	pluginꓽreadme,
	pluginꓽturborepo,
	pluginꓽtypescript,
	pluginꓽunit_tests,
	pluginꓽvite,
	pluginꓽyarnᝍᝍv1,
}

export async function apply(from?: PathⳇAny) {
	console.group(styleText("bold", `@infinite-monorepo/apply…`))

	from = (function normalize(): PathⳇAbsolute {
		if (!from) return process.cwd()

		if (from.startsWith("~")) {
			const HOME_path‿abs: DirPathⳇAbsolute = `${homedir()}${path.sep}` // TODO XDG? TODO can it fail in CI?
			return path.resolve(HOME_path‿abs, from.slice(2))
		}

		return path.resolve(process.cwd(), from)
	})()
	console.log("monorepo path (normalized) =", from)
	await fs.mkdir(from, { recursive: true }) // in case we're initializing a new monorepo, in a subdir of a git repo

	////////////
	let state = (function init_state() {
		let state = StateLib.create()
		state.pkg_infos_resolver.declareꓽmonorepo_namespace(state.specⵧroot.namespace)
		state.pkg_infos_resolver.declareꓽmonorepo_namespace(state.specⵧroot.namespaceⵧprivate)
		return state
	})()

	async function _propagate() {
		console.log(styleText("italic", "------------ propagating new infos… ------------"))
		//dumpꓽanyⵧprettified('state', state)

		let prev = state

		// node discoveries
		let round_count = 0
		function _hasꓽpending_stuff() {
			const hasꓽasync_operations__pending = StateLib.hasꓽasync_operations__pending(state)
			const nodesⵧnew__count = StateLib.getꓽnodesⵧnew(state).length
			const nodesⵧbfs_untraversed__count = StateLib.getꓽnodesⵧbfs_untraversed(state).length

			console.log(`_propagate()… round #${round_count}`, {
				hasꓽasync_operations__pending,
				nodesⵧnew__count,
				nodesⵧbfs_untraversed__count,
			})

			return hasꓽasync_operations__pending || nodesⵧnew__count > 0 || nodesⵧbfs_untraversed__count > 0
		}

		/////////////////////////////////////////////////
		while (_hasꓽpending_stuff()) {
			let _outdated_node: Immutable<Node> | undefined

			////////////
			do {
				prev = state
				state = await StateLib.resolveꓽasync_operations(state)
			} while (prev !== state)

			////////////
			while ((_outdated_node = StateLib.getꓽnodesⵧnew(state)[0])) {
				console.group(
					`↳ onꓽnodeⵧdiscoveredⵧfirst_time : [${styleText("yellow", _outdated_node.type)}] ${styleText("gray", _outdated_node?.path‿ar || "??")}`,
				)

				state = await Object.entries(plugins).reduce(async (ೱstate, [plugin__name, plugin]) => {
					let state = await ೱstate
					if (!plugin.onꓽnodeⵧdiscoveredⵧfirst_time) return state

					console.group(`↳ onꓽnodeⵧdiscoveredⵧfirst_time [${styleText("blue", plugin__name)}]`)
					const before = state
					state = await plugin.onꓽnodeⵧdiscoveredⵧfirst_time(
						state,
						state.graphs.nodesⵧworkspace[_outdated_node.path‿abs],
					)
					assert(!!state, `Plugin ${plugin__name} onꓽnodeⵧdiscoveredⵧfirst_time forgot to return state!`)
					if (state !== before) console.log("⚡️change")
					console.groupEnd()

					return state
				}, Promise.resolve<Immutable<State>>(state))
				state = StateLib.reportꓽnodeⵧanalyzed(state, state.graphs.nodesⵧworkspace[_outdated_node.path‿abs])
				console.groupEnd()
			}

			////////////
			do {
				prev = state
				state = await StateLib.resolveꓽasync_operations(state)
			} while (prev !== state)

			////////////
			const bfs_target = state.traversals.onꓽnodeⵧdiscoveredⵧbfs__level // lock to avoid auto-increment and properly alternate with onꓽnodeⵧdiscoveredⵧfirst_time
			while ((_outdated_node = StateLib.getꓽnodesⵧbfs_untraversed(state, bfs_target)[0])) {
				console.group(
					`↳ onꓽnodeⵧdiscoveredⵧbfs L${bfs_target} : [${styleText("yellow", _outdated_node.type)}] ${styleText("gray", _outdated_node?.path‿ar || "??")}`,
				)

				state = await Object.entries(plugins).reduce(async (ೱstate, [plugin__name, plugin]) => {
					let state = await ೱstate
					if (!plugin.onꓽnodeⵧdiscoveredⵧbfs) return state

					console.group(`↳ onꓽnodeⵧdiscoveredⵧbfs [${styleText("blue", plugin__name)}]`)
					const before = state
					state = await plugin.onꓽnodeⵧdiscoveredⵧbfs(state, state.graphs.nodesⵧworkspace[_outdated_node.path‿abs])
					if (state !== before) console.log("⚡️change")
					assert(!!state, `Plugin ${plugin__name} onꓽnodeⵧdiscoveredⵧbfs forgot to return state!`)
					console.groupEnd()

					return state
				}, Promise.resolve<Immutable<State>>(state))
				state = StateLib.reportꓽnodeⵧtraversedⵧbfs(state, state.graphs.nodesⵧworkspace[_outdated_node.path‿abs])
				if (_outdated_node.type === "package") {
					// analyze
					// TODO 1D support non-pure modules
					// TODO 1D parallel
					const updated_details = await (async (): Promise<Immutable<PureModuleDetails>> => {
						if (
							// TODO clean those exceptions
							_outdated_node.path‿abs.endsWith("/0-dev-tools/parcel--config--default/") ||
							_outdated_node.path‿abs.endsWith("/0-dev-tools/parcel--toolbox/") ||
							_outdated_node.path‿abs.endsWith("/0-dev-tools/vite--toolbox/")
						)
							return {
								...state.graphs.nodesⵧworkspace[_outdated_node.path‿abs].details,
								_error: new Error("special package not implemented"),
							}

						try {
							let updated_details = await updateⵧfrom_files(
								state.graphs.nodesⵧworkspace[_outdated_node.path‿abs].details,
								state,
							)
							state.pkg_infos_resolver.declareꓽmonorepo_pkg(updated_details.fqname)
							if (updated_details._manifest?._dontꓽpresent) {
								// TODO clean those exceptions
								console.log(`marked as "do not present", skipping`)
								return {
									...updated_details,
									_error: new Error("manifest._dontꓽpresent opted out"),
								}
							}

							const all_declared_deps = Array.from(PkgDetailsLib.getꓽall_external_dependencies(updated_details))
							all_declared_deps.forEach((dep) => {
								state.pkg_infos_resolver.preload(dep)
							})

							return updated_details
						} catch (err) {
							throw err
							return {
								...state.graphs.nodesⵧworkspace[_outdated_node.path‿abs].details,
								_error: err,
							}
						}
					})()
					state = StateLib.updateꓽmodule_details(state, updated_details)
				}

				console.groupEnd()
			}

			round_count++
		}
	}

	//////////// plugins onꓽload
	state = await (async function _load_plugins() {
		console.group(`↳ onꓽload…`)
		state = Object.entries(plugins).reduce((state, [plugin__name, plugin]) => {
			if (!plugin.onꓽload) return state

			console.group(`↳ onꓽload [${styleText("blue", plugin__name)}]`)
			const before = state
			state = plugin.onꓽload(state)
			if (state !== before) console.log("⚡️change")
			console.groupEnd()

			return state
		}, state)
		await _propagate()
		console.groupEnd()
		return state
	})()

	console.log(styleText("italic", "------------ plugins graphs discovery… ------------"))

	//////////// load spec = will trigger graph discovery through plugin propagation
	state = await (async function _load_spec_and_graph() {
		console.group(`↳ loading spec…`)
		const spec_chain = await loadꓽspecⵧchainⵧraw(from)
		state = StateLib.onꓽspec_chain_loaded(state, spec_chain)
		// reminder: spec discovery triggered root node registrations, which will cascade into sub-registrations
		state.pkg_infos_resolver.declareꓽmonorepo_namespace(state.specⵧroot.namespace)
		state.pkg_infos_resolver.declareꓽmonorepo_namespace(state.specⵧroot.namespaceⵧprivate)

		await _propagate() // <<<<< This will call the plugins

		console.groupEnd()

		return state
	})()

	console.log(styleText("italic", "------------ plugins graphs discovery DONE ------------"))
	// TODO 1D prevent late discovery of new node

	//////////// plugins onꓽrefine
	console.log(styleText("italic", "------------ About to refine… ------------"))
	state = await (async function _refine() {
		//console.log("state =", state)
		console.group(`↳ SCM graph`)
		Object.keys(state.graphs.nodesⵧscm)
			.sort()
			.forEach((k) => {
				console.group(`↳ SCM node ${state.graphs.nodesⵧscm[k].path‿ar}`)
				state = Object.entries(plugins).reduce((state, [plugin__name, plugin]) => {
					if (!plugin.onꓽnodeⵧrefine) return state

					console.group(`↳ onꓽnodeⵧrefine [${styleText("blue", plugin__name)}]`)
					const before = state
					state = plugin.onꓽnodeⵧrefine(state, state.graphs.nodesⵧscm[k])
					if (state !== before) {
						console.log("⚡️change")
					}
					console.groupEnd()

					return state
				}, state)
				console.groupEnd()
			})
		console.groupEnd()

		console.group(`↳ Monorepo graph`)
		Object.keys(state.graphs.nodesⵧworkspace)
			.sort()
			.forEach((k) => {
				console.group(`↳ SCM node ${state.graphs.nodesⵧworkspace[k].path‿ar}`)
				state = Object.entries(plugins).reduce((state, [plugin__name, plugin]) => {
					if (!plugin.onꓽnodeⵧrefine) return state

					console.group(`↳ onꓽnodeⵧrefine [${styleText("blue", plugin__name)}]`)
					const before = state
					state = plugin.onꓽnodeⵧrefine(state, state.graphs.nodesⵧworkspace[k])
					if (state !== before) {
						console.log("⚡️change")
					}
					console.groupEnd()

					return state
				}, state)
				console.groupEnd()
			})
		console.groupEnd()

		state = StateLib.reconcile(state)

		// build catalog
		console.group(`↳ Building catalog(s)…`)
		Object.entries(state.graphs.nodesⵧworkspace).forEach(([k, node]) => {
			if (!node.details) return

			const all_declared_deps = Array.from(PkgDetailsLib.getꓽall_external_dependencies(node.details))
			all_declared_deps.forEach((dep) => {
				state.pkg_infos_resolver.add_catalog_entry(dep)
			})
		})

		await _propagate()

		console.groupEnd()

		return state
	})()

	//////////// plugins onꓽapply
	console.log(styleText("italic", "------------ About to apply… ------------"))
	state = await (async function _apply() {
		//console.log("state =", state)

		console.group(`↳ SCM graph`)
		Object.keys(state.graphs.nodesⵧscm)
			.sort()
			.forEach((k) => {
				console.group(`↳ SCM node ${state.graphs.nodesⵧscm[k].path‿ar}`)
				state = Object.entries(plugins).reduce((state, [plugin__name, plugin]) => {
					if (!plugin.onꓽapply) return state

					console.group(`↳ onꓽapply [${styleText("blue", plugin__name)}]`)
					const before = state
					state = plugin.onꓽapply(state, state.graphs.nodesⵧscm[k])
					if (state !== before) console.log("⚡️change")
					console.groupEnd()

					return state
				}, state)
				console.groupEnd()
			})
		console.groupEnd()

		console.group(`↳ Monorepo graph`)
		Object.keys(state.graphs.nodesⵧworkspace)
			.sort()
			.forEach((k) => {
				console.group(`↳ SCM node ${state.graphs.nodesⵧworkspace[k].path‿ar}`)
				state = Object.entries(plugins).reduce((state, [plugin__name, plugin]) => {
					if (!plugin.onꓽapply) return state

					console.group(`↳ onꓽapply [${styleText("blue", plugin__name)}]`)
					const before = state
					state = plugin.onꓽapply(state, state.graphs.nodesⵧworkspace[k])
					if (state !== before) console.log("⚡️change")
					console.groupEnd()

					return state
				}, state)
				console.groupEnd()
			})
		console.groupEnd()

		await _propagate()

		return state
	})()

	////////////
	console.log(styleText("italic", "------------ About to commit after apply… ------------"))
	state = await (async function _commit() {
		console.group(`↳ commiting…`)

		// 1. clear all files
		// (TODO 1D)

		// 2. re-create files we explicitly requested
		const ios = Object.entries(state.output_files).map(([path, spec]) => {
			switch (spec.intent) {
				case "not-present":
					console.log(`- Removing file ${path}…`)
					return fs.rm(path, { force: true })

				case "present":
					console.log(`- Writing file if not exist ${path}…`)
					return ensureFile(path, async () => {
						ೱwriteꓽfile(path, trim_before_stringify(spec.content as any), spec.manifest.format)
					})

				case "present--exact":
					console.log(`- Writing exact file ${path}…`)
					return ೱwriteꓽfile(path, trim_before_stringify(spec.content as any), spec.manifest.format)

				case "present--containing":
					console.log(`- Augmenting file ${path}…`)
					const SSoT = true // XXX advanced!
					const ↆexisting_content = SSoT ? Promise.resolve({}) : ↆreadꓽfile(path, { format: spec.manifest.format })
					return ↆexisting_content.then(
						(content) => {
							return ೱwriteꓽfile(
								path,
								trim_before_stringify(mergeꓽjson(content, spec.content as any)),
								spec.manifest.format,
							)
						},
						(err) => {
							if ((err as any)?.code !== "ENOENT") {
								throw err
							}

							return ೱwriteꓽfile(path, trim_before_stringify(spec.content as any), spec.manifest.format)
						},
					)

				case "symlink": {
					console.log(`- Ensuring symlink ${path}…`)
					return ensureSymlink("../AGENTS.md", ".claude/CLAUDE.md")
				}

				default:
					throw new Error(`Unsupported intent: ${spec.intent}!`)
			}
		})
		console.log("Finalizing i/o…")
		await Promise.all(ios)

		console.groupEnd()
		return state
	})()

	////////////
	console.log("DONE!")
	//dumpꓽanyⵧprettified('state', state)
}

/////////////////////////////////////////////////

async function ensureSymlink(target: string, linkPath: string) {
	await fs.mkdir(path.dirname(linkPath), { recursive: true })

	try {
		const stat = await fs.lstat(linkPath)

		if (stat.isSymbolicLink()) {
			const actual = await fs.readlink(linkPath)
			if (actual === target) {
				console.log("Symlink already exists with correct target, skipping.")
			} else {
				throw new Error(`Symlink exists but points to wrong target: expected "${target}", got "${actual}"`)
			}
		} else {
			throw new Error(`Path exists but is not a symlink: ${linkPath}`)
		}
	} catch (err) {
		if (err.code !== "ENOENT") throw err
		await fs.symlink(target, linkPath)
		console.log(`Symlink created: ${linkPath} -> ${target}`)
	}
}

async function ensureFile(path: PathⳇAbsolute, onCreate: () => Promise<void>): Promise<void> {
	try {
		await fs.access(path)
	} catch {
		await onCreate()
	}
}

/////////////////////////////////////////////////

import * as fs from "node:fs/promises"
import { homedir } from "node:os"
import path from "node:path"
import process from "node:process"
import { styleText } from "node:util"

import type { Node } from "@infinite-monorepo/graph"
import type { PureModuleDetails } from "@infinite-monorepo/package-details"
import * as PkgDetailsLib from "@infinite-monorepo/package-details"
import { updateⵧfrom_files } from "@infinite-monorepo/pkg-analyzer"
import pluginꓽaiᝍᝍagentsᝍᝍcoding from "@infinite-monorepo/plugin--ai--agents--coding"
import pluginꓽbolt from "@infinite-monorepo/plugin--bolt"
import pluginꓽchangelog from "@infinite-monorepo/plugin--changelog"
import pluginꓽeditorconfig from "@infinite-monorepo/plugin--editorconfig"
import pluginꓽgit from "@infinite-monorepo/plugin--git"
import pluginꓽjetbrains from "@infinite-monorepo/plugin--jetbrains"
import pluginꓽlicense from "@infinite-monorepo/plugin--license"
import pluginꓽmise from "@infinite-monorepo/plugin--mise"
import pluginꓽnpm from "@infinite-monorepo/plugin--npm"
import pluginꓽnvm from "@infinite-monorepo/plugin--nvm"
import pluginꓽoffirmo from "@infinite-monorepo/plugin--offirmo"
import pluginꓽoxcᝍᝍoxfmt from "@infinite-monorepo/plugin--oxc--oxfmt"
import pluginꓽoxcᝍᝍoxlint from "@infinite-monorepo/plugin--oxc--oxlint"
import pluginꓽpackageᐧjson from "@infinite-monorepo/plugin--package-json"
import pluginꓽparcel from "@infinite-monorepo/plugin--parcel"
import pluginꓽpnpm from "@infinite-monorepo/plugin--pnpm"
import pluginꓽreadme from "@infinite-monorepo/plugin--readme"
import pluginꓽtosort from "@infinite-monorepo/plugin--tosort"
import pluginꓽturborepo from "@infinite-monorepo/plugin--turborepo"
import pluginꓽtypescript from "@infinite-monorepo/plugin--typescript"
import pluginꓽunit_tests from "@infinite-monorepo/plugin--unit-tests"
import pluginꓽvite from "@infinite-monorepo/plugin--vite"
import pluginꓽyarnᝍᝍv1 from "@infinite-monorepo/plugin--yarn--v1"
import { loadꓽspecⵧchainⵧraw } from "@infinite-monorepo/spec--load"
import * as StateLib from "@infinite-monorepo/state"
import { type State } from "@infinite-monorepo/state"
import { type Plugin } from "@infinite-monorepo/types-for-plugins"

import { assert } from "@monorepo-private/assert"
import { trim_before_stringify } from "@monorepo-private/json-stable-stringify"
import { ↆreadꓽfile } from "@monorepo-private/read-write-any-structured-file/read"
import { mergeꓽjson, ೱwriteꓽfile } from "@monorepo-private/read-write-any-structured-file/write"
import type { DirPathⳇAbsolute, Immutable, PathⳇAbsolute, PathⳇAny } from "@monorepo-private/ts--types"
