/////////////////////////////////////////////////

import type { StructuredContent } from "@monorepo-private/read-write-any-structured-file/module/src/types.ts"

const DEBUG = true

export function create(): Immutable<State> {
	DEBUG && console.debug("Creating state...")

	return {
		specⵧroot: completeꓽspec({}),
		pkg_infos_resolver: new PkgInfosResolver(),

		file_manifests: {},

		graphs: {
			nodesⵧscm: {},
			nodesⵧworkspace: {},
		},

		plugin_area: {},

		traversals: {
			onꓽnodeⵧdiscoveredⵧbfs__level: 0,
		},

		facts: {
			files: {},
		},

		output_files: {},
	}
}

export function declareꓽfile_manifest(state: Immutable<State>, manifest: StructuredFsⳇFileManifest): Immutable<State> {
	DEBUG &&
		console.debug(
			`Declaring manifest… ${styleText("yellow", manifest.path‿ar)} [${manifest.format ? styleText("red", manifest.format) : styleText("green", "auto")}]`,
		)
	//DEBUG && console.debug('Declaring manifest…', manifest)

	const existing = state.file_manifests[manifest.path‿ar]
	if (existing) {
		const is_equal = manifest === existing
		assert(is_equal, `Conflicting file manifests for ${manifest.path‿ar}!`)
	}

	return {
		...state,
		file_manifests: {
			...state.file_manifests,
			[manifest.path‿ar]: manifest,
		},
	}
}

export function onꓽspec_chain_loaded(
	state: Immutable<State>,
	spec_chain: Awaited<ReturnType<typeof loadꓽspecⵧchainⵧraw>>,
): Immutable<State> {
	const ǃ = assert_from({ onꓽspec_chain_loaded })
	DEBUG && console.debug("On spec chain loaded...")

	// traverse the chain, discovering nodes
	const PENDING: DirPathⳇAbsolute = "PENDING/"
	const nodeⵧscm_root: NodeⳇForꓽregisterꓽnode<NodeⳇRepo> = {
		type: "repository",
		path‿abs: PENDING,
	}
	const nodeⵧworkspace_root: Omit<NodeⳇForꓽregisterꓽnode<NodeⳇWorkspace>, "details"> = {
		type: "monorepo",
		path‿abs: PENDING,
	}
	let topmost_spec_under_workspace: InfiniteMonorepoSpec | undefined

	function _registerꓽnodeⵧworkspace_root(state: Immutable<State>, path‿abs: DirPathⳇAbsolute): Immutable<State> {
		assert(nodeⵧscm_root.path‿abs !== PENDING, `SCM root must be known before workspace!`)
		nodeⵧworkspace_root.path‿abs = path‿abs
		nodeⵧworkspace_root.spec = completeꓽspec(topmost_spec_under_workspace || {})
		const name = "root"
		const namespace = nodeⵧworkspace_root.spec.namespaceⵧprivate
		return registerꓽnode<NodeⳇWorkspace>(
			state,
			{
				...nodeⵧworkspace_root,
				details: {
					...PkgDetailsLib.create(path‿abs, nodeⵧworkspace_root.spec?.namespaceⵧprivate),
					name,
					namespace,
					fqname: `${namespace}/${name}`,
				},
			},
			null,
		)
	}

	spec_chain.forEach((result) => {
		console.log("Spec loaded:", result)

		if (result.boundary === "git") {
			if (nodeⵧscm_root.path‿abs === PENDING) {
				nodeⵧscm_root.path‿abs = result.parent_folder_path‿abs
				state = registerꓽnode(state, nodeⵧscm_root, null)
			} else {
				// must be a git submodule, ignore
			}
		}

		// reminder that scm root and workspace can be the same
		if (result.data) {
			topmost_spec_under_workspace = {
				...(result.data as any), // TODO 1D schema validation
				_config_fileⵧroot: result.exact_file_path‿abs,
				root_path‿abs: result.parent_folder_path‿abs,
			}
			if (nodeⵧworkspace_root.path‿abs === PENDING) {
				state = _registerꓽnodeⵧworkspace_root(state, result.parent_folder_path‿abs)
			} else {
				// must be a subfolder modifier, ignore
				// TODO 1D handle config not at root of workspace
			}
		}
	})
	ǃ.ensure(nodeⵧscm_root.path‿abs !== PENDING, `SCM root must exist!`)

	if (nodeⵧworkspace_root.path‿abs === PENDING) {
		// do a second pass using package.json as a hint
		spec_chain.forEach((result) => {
			//console.log('Spec loaded:', result)
			if (result.hasꓽpackageᐧjson) {
				if (nodeⵧworkspace_root.path‿abs === PENDING) {
					state = _registerꓽnodeⵧworkspace_root(state, result.parent_folder_path‿abs)
				} else {
					// must be a subfolder modifier, ignore
				}
			}
		})
	}
	if (nodeⵧworkspace_root.path‿abs === PENDING) {
		// we couldn't find explicit config below the SCM root
		// this is acceptable for a new project with default config (none at all)
		spec_chain.forEach((result) => {
			if (result.boundary === "from") {
				if (nodeⵧworkspace_root.path‿abs === PENDING) {
					state = _registerꓽnodeⵧworkspace_root(state, result.parent_folder_path‿abs)
				}
			}
		})
	}
	ǃ.ensure(nodeⵧworkspace_root.path‿abs !== PENDING, `Workspace root must exist!`)

	// TODO review, duplicate??
	if (topmost_spec_under_workspace) {
		// TODO review can be falsy?
		state = {
			...state,
			specⵧroot: nodeⵧworkspace_root.spec,
		}
	}

	return state
}

export type NodeⳇForꓽregisterꓽnode<NodeType extends Node> = Omit<
	NodeType,
	"parent_id" | "path‿ar" | "bfs_level" | "plugin_area"
>
export function registerꓽnode<NodeType extends Node>(
	state: Immutable<State>,
	_node: Immutable<NodeⳇForꓽregisterꓽnode<NodeType>>,
	parent_node: Immutable<NodeRef> | null,
): Immutable<State> {
	const ǃ = assert_from({ onꓽspec_chain_loaded })
	DEBUG && console.debug(`Registering "${styleText("yellow", _node.type)}" node...`, styleText("gray", _node.path‿abs))

	ǃ.forⵧparam({ _node }).require(!!_node.path‿abs && _node.path‿abs !== "PENDING/")

	const traversal_init: TraversalTracking = {
		status: "new",
		statusⵧbfs: "todo",
	}

	const path‿ar: AnyRepoPathⳇRelative = (() => {
		if (!parent_node) return _getꓽPATHVARⵧROOT_for_type(_node)

		const path_from_parent‿rel: DirPathⳇRelative = path.relative(parent_node.path‿abs, _node.path‿abs)

		return (path.join(_getꓽPATHVARⵧROOT_for_type(parent_node), path_from_parent‿rel) + "/") as AnyRepoPathⳇRelative
	})()

	let node: Node & TraversalTracking = {
		..._node,
		path‿ar,
		parent_id: parent_node?.path‿abs ?? null,
		bfs_level: (parent_node?.bfs_level ?? -1) + 1,
		plugin_area: {},
		...traversal_init,
	}

	// TODO 1D check that the _ar path prefix match the parent type
	// or even path‿ar should be auto computed?

	//////////// IF SCM GRAPH ////////////
	if (node.type === "repository") {
		assert(
			!node.spec,
			`SCM node should not have a spec! Specs are for monorepo(s) which have their own node (potentially same path)`,
		)
		assert(state.graphs.nodesⵧscm[node.path‿abs] === undefined, `SCM node already registered: ${node.path‿abs}!`)

		return {
			...state,
			graphs: {
				...state.graphs,
				nodesⵧscm: {
					...state.graphs.nodesⵧscm,
					[node.path‿abs]: node,
				},
			},
		}
	}

	//////////// IF WORKSPACE GRAPH ////////////
	assert(
		state.graphs.nodesⵧworkspace[node.path‿abs] === undefined,
		`Semantic node already registered: ${styleText("gray", node.path‿abs)}!`,
	)

	node = {
		spec: {}, // TODO 1D load!
		...node,
	}

	switch (node.type) {
		case "monorepo":
		case "package": {
			ǃ.forⵧparam({ _node }).require(!!_node.details)
			if (_node.details.namespace) {
				state.pkg_infos_resolver.declareꓽmonorepo_namespace(_node.details.namespace)
			}
			break
		}
		default:
			break
	}

	return {
		...state,
		graphs: {
			...state.graphs,
			nodesⵧworkspace: {
				...state.graphs.nodesⵧworkspace,
				[node.path‿abs]: node,
			},
		},
	}
}

export function reportꓽnodeⵧanalyzed(state: Immutable<State>, node_ref: Immutable<NodeRef>): Immutable<State> {
	DEBUG &&
		console.debug(
			"Marking node analyzed...",
			styleText("yellow", node_ref.type),
			styleText("gray", node_ref.path‿abs),
		)

	return reduceꓽnode(state, node_ref, (node) => {
		assert(node.status === "new", `Node not new: ${node.path‿abs}!`)
		return {
			...node,
			status: "analyzed",
		}
	})
}

export function reportꓽnodeⵧtraversedⵧbfs<NodeType extends NodeBase>(
	state: Immutable<State>,
	node_ref: Immutable<NodeRef<NodeType>>,
): Immutable<State> {
	const ǃ = assert_from({ reportꓽnodeⵧtraversedⵧbfs })

	DEBUG &&
		console.debug(
			`Marking node BFS traversed… L${node_ref.bfs_level}`,
			styleText("yellow", node_ref.type),
			styleText("gray", node_ref.path‿abs),
		)
	ǃ.forⵧparam({ node: node_ref }).require(
		node_ref.bfs_level === state.traversals.onꓽnodeⵧdiscoveredⵧbfs__level,
		`BFS incoherency`,
	)

	state = reduceꓽnode(state, node_ref, (node) => {
		assert(node.statusⵧbfs === "todo", `Node already visited: ${node.path‿abs}!`)
		return {
			...node,
			statusⵧbfs: "done",
		}
	})

	const rest_at_this_level = getꓽnodesⵧbfs_untraversed(state, node_ref.bfs_level)
	if (rest_at_this_level.length === 0) {
		state = {
			...state,
			traversals: {
				...state.traversals,
				onꓽnodeⵧdiscoveredⵧbfs__level: state.traversals.onꓽnodeⵧdiscoveredⵧbfs__level + 1,
			},
		}
	}

	return state
}

export function reduceꓽplugin_area<T>(
	state: Immutable<State>,
	key: symbol,
	reducer: (area: Immutable<T>) => Immutable<T>,
): Immutable<State> {
	const ǃ = assert_from({ reduceꓽplugin_area })

	const before: Immutable<T> = state.plugin_area[key]
	const after = reducer(before)

	return {
		...state,
		plugin_area: {
			...state.plugin_area,
			[key]: {
				...before,
				...after,
			},
		},
	}
}

export function reduceꓽnode<NodeType extends NodeBase>(
	state: Immutable<State>,
	node_ref: Immutable<NodeRef<NodeType>>,
	reducer: (node: Immutable<NodeType & TraversalTracking>) => Immutable<NodeType & TraversalTracking>,
): Immutable<State> {
	const ǃ = assert_from({ reduceꓽnode })

	if (node_ref.type === "repository") {
		const existing_node: Immutable<NodeType & TraversalTracking> | undefined =
			state.graphs.nodesⵧscm[node_ref.path‿abs]
		ǃ.forⵧparam({ node: node_ref }).require(!!existing_node, `Node expected: ${node_ref.path‿abs}!`)
		assert(!!existing_node)

		const updated_node = reducer(existing_node)

		return {
			...state,
			graphs: {
				...state.graphs,
				nodesⵧscm: {
					...state.graphs.nodesⵧscm,
					[node_ref.path‿abs]: updated_node,
				},
			},
		}
	}

	const existing_node: Immutable<NodeType & TraversalTracking> | undefined =
		state.graphs.nodesⵧworkspace[node_ref.path‿abs]
	ǃ.forⵧparam({ node: node_ref }).require(!!existing_node, `Node expected: ${node_ref.path‿abs}!`)
	assert(!!existing_node)

	const updated_node = reducer(existing_node)

	return {
		...state,
		graphs: {
			...state.graphs,
			nodesⵧworkspace: {
				...state.graphs.nodesⵧworkspace,
				[node_ref.path‿abs]: updated_node,
			},
		},
	}
}

// TODO also auto-install types? (or in reconcile?) or both
export function addꓽdependency<NodeType extends NodeⳇWorkspace | NodeⳇPackage>(
	state: Immutable<State>,
	node_ref: Immutable<NodeRef<NodeType>>,
	dep_name: PkgFQName,
	dep_details: Immutable<DependencyDetails>,
): Immutable<State> {
	const ǃ = assert_from({ addꓽdependency })
	ǃ.forⵧparam({ node: node_ref }).require(node_ref.details, `Node with details expected: ${node_ref.path‿abs}!`)

	return reduceꓽnode(state, node_ref, (node) => {
		const details_before = node.details
		const details_after = PkgDetailsLib.addꓽdependency(node.details, dep_name, dep_details)
		if (details_after === details_before) return node

		return {
			...node,
			details: details_after,
		}
	})
}

export function addꓽscript<NodeType extends NodeⳇWorkspace | NodeⳇPackage>(
	state: Immutable<State>,
	node_ref: Immutable<NodeRef<NodeType>>,
	script_name: string,
	script_content: string,
): Immutable<State> {
	const ǃ = assert_from({ addꓽscript })
	ǃ.forⵧparam({ node: node_ref }).require(node_ref.details, `Node with details expected: ${node_ref.path‿abs}!`)

	return reduceꓽnode(state, node_ref, (node) => {
		const details_before = node.details
		const details_after = PkgDetailsLib.addꓽscript(node.details, script_name, script_content)
		if (details_after === details_before) return node

		return {
			...node,
			details: details_after,
		}
	})
}

export function updateꓽmodule_details(
	state: Immutable<State>,
	details: Immutable<PureModuleDetails>,
): Immutable<State> {
	const ǃ = assert_from({ updateꓽmodule_details })

	const node = state.graphs.nodesⵧworkspace[details.root‿abspath]
	ǃ.forⵧparam({ details }).require(!!node, `Node expected: ${details.root‿abspath}!`)
	assert(!!node)

	return reduceꓽnode(state, node, (node) => {
		ǃ.forⵧparam({ node }).require(node.details, `Node with details expected: ${node.path‿abs}!`)
		const details_before = node.details
		const details_after = PkgDetailsLib.reconcile(details)
		if (details_after === details_before) return node

		return {
			...node,
			details: details_after,
		}
	})
}

// TODO better immu?
// TODO needed?
export function reconcile(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		graphs: {
			...state.graphs,
			nodesⵧworkspace: Object.fromEntries(
				Object.entries(state.graphs.nodesⵧworkspace).map(([p, node]) => {
					if (node.details) {
						node = {
							...node,
							details: PkgDetailsLib.reconcile(node.details),
						}
					}
					return [p, node]
				}),
			),
		},
	}
}

export function requestꓽfactsⵧabout_file(
	state: Immutable<State>,
	manifest: StructuredFsⳇFileManifest,
	parent_node: Immutable<NodeRef> | undefined,
	callback: AsyncCallbackReducer<null | StructuredContent>,
): Immutable<State> {
	DEBUG &&
		console.debug(
			`requestꓽfactsⵧabout_file("${styleText("yellow", manifest.path‿ar)}" from "${styleText("yellow", parent_node?.path‿ar)}")`,
		)

	const path_abs = _resolveꓽarpath(state, manifest.path‿ar, parent_node)
	const x: Immutable<SubStateⳇFactsFile> =
		state.facts.files[path_abs] ||
		((): Immutable<SubStateⳇFactsFile> => {
			DEBUG && console.debug("↳ New fact file request:", styleText("gray", path_abs))
			return {
				manifest,
				content: undefined,
				ↆretrieval: ↆreadꓽfile(path_abs, { format: manifest.format }).catch((err) => {
					if (isꓽErrorⵧrsrc_not_found(err)) return null

					throw err
				}),
				pending_callbacks: [],
			} as SubStateⳇFactsFile
		})()

	assert(x.manifest.format === manifest.format, `File manifest conflict!`)

	if (!x.ↆretrieval) {
		DEBUG && console.debug("Already read", path_abs)
		assert(x.content !== undefined, `File must have been read!`)
		return callback(state, null, x.content) // direct invocation
	}

	return {
		...state,
		facts: {
			...state.facts,
			files: {
				...state.facts.files,
				[path_abs]: {
					...x,
					pending_callbacks: [...(x.pending_callbacks || []), callback],
				},
			},
		},
	}
}

export function requestꓽfile_output(state: Immutable<State>, spec: Immutable<FileOutputAbsent>): Immutable<State>
export function requestꓽfile_output(state: Immutable<State>, spec: Immutable<FileOutputPresent>): Immutable<State>
export function requestꓽfile_output(
	state: Immutable<State>,
	candidate_spec: Immutable<FileOutputAbsent | FileOutputPresent>,
): Immutable<State> {
	const ǃ = assert_from({ requestꓽfile_output })

	const path‿ar = candidate_spec.path‿ar || (candidate_spec as any as FileOutputPresent)?.manifest?.path‿ar
	ǃ.forⵧparam({ candidate_spec }).require(!!path‿ar, `spec should provide a path!`)
	const path‿abs = _resolveꓽarpath(state, path‿ar, candidate_spec.parent_node)

	let spec = candidate_spec
	const existing = state.output_files[path‿abs]
	if (existing) {
		assert(existing.intent === candidate_spec.intent, `Conflict! Multiple intents for file ${path‿abs}!`)
		assert(
			(existing as any).manifest?.path‿ar === (candidate_spec as any).manifest?.path‿ar,
			`Conflict! Multiple manifests for file ${path‿abs}!`,
		)
		assert(
			(existing as any).manifest?.format === (candidate_spec as any).manifest?.format,
			`Conflict! Multiple manifests for file ${path‿abs}!`,
		)

		if (candidate_spec.intent === "present--exact") {
			// check same content
			const existing__content = stringifyⵧstable(existing.content)
			const candidate__content = stringifyⵧstable(candidate_spec.content)
			ǃ.forⵧparam({ candidate_spec }).require(
				existing__content === candidate__content,
				`Conflicting intended exact content for file ${path‿abs}!`,
			)
			// identical, no change needed
			return state
		} else if (candidate_spec.intent === "present--containing") {
			const merge_spec: Immutable<FileOutputPresent> = {
				...candidate_spec,
				content: mergeꓽjson(
					(existing as any as FileOutputPresent).content,
					(candidate_spec as any as FileOutputPresent).content!,
				) as any,
			}
			spec = merge_spec
			//console.log('TODO check')
		} else {
			throw new Error("NIMP!")
		}
	}

	return {
		...state,
		output_files: {
			...state.output_files,
			[path‿abs]: spec,
		},
	}
}

/////////////////////////////////////////////////

// special async
// MUST match hasꓽasync_operations__pending()
export async function resolveꓽasync_operations(state: Immutable<State>): Promise<Immutable<State>> {
	const pending: Array<Promise<void>> = []

	pending.push(state.pkg_infos_resolver.ೱall_pending_loaded())

	// only files so far
	Object.entries(state.facts.files).forEach(([path, substate]) => {
		if (substate.ↆretrieval) {
			const p: Promise<void> = substate.ↆretrieval
				.then(
					(content) => {
						DEBUG && console.debug("File read:", path)
						const new_substate: Immutable<SubStateⳇFactsFile> = {
							manifest: substate.manifest,
							content,
						}
						return new_substate
					},
					(err) => {
						// not found already handled, most likely syntax error or anything
						DEBUG && console.warn("Irrecoverable error while reading:", path)
						console.error(`ↆretrieval failure`, err)
						const new_substate: Immutable<SubStateⳇFactsFile> = {
							manifest: substate.manifest,
							content: "error",
							_error: normalizeError(err),
						}
						return new_substate
					},
				)
				.then((new_substate) => {
					state = {
						...state,
						facts: {
							...state.facts,
							files: {
								...state.facts.files,
								[path]: new_substate,
							},
						},
					}
					state = (substate.pending_callbacks || []).reduce((state, acb) => {
						return acb(state, new_substate.content)
					}, state)
				})
			pending.push(p)
		}
	})

	await Promise.all(pending)

	return state
}

/////////////////////////////////////////////////

function _getꓽPATHVARⵧROOT_for_type(node: Immutable<NodeⳇForꓽregisterꓽnode>): AnyRepoFilePathⳇRelative {
	switch (node.type) {
		case NODE_TYPEⵧMONOREPO:
			return `${PATHVARⵧROOTⵧMONOREPO}/`
		case NODE_TYPEⵧREPO:
			return `${PATHVARⵧROOTⵧREPO}/`
		case NODE_TYPEⵧWORKSPACES__LINE:
			return `${PATHVARⵧROOTⵧWORKSPACE__LINE}/`
		case NODE_TYPEⵧPACKAGE:
			return `${PATHVARⵧROOTⵧPACKAGE}/`
		default:
			throw new Error("NIMP!")
	}
}

export function _resolveꓽarpath(
	state: Immutable<State>,
	path‿ar: AnyRepoFilePathⳇRelative,
	parent_node?: Immutable<Node> | undefined,
): PathⳇAbsolute {
	const ǃ = assert_from({ _resolveꓽarpath })

	const first_segment = path‿ar.split("/")[0]
	ǃ.forⵧparam({ path‿ar }).require(
		!!first_segment && first_segment.startsWith("$") && first_segment.endsWith("$"),
		`Invalid arpath NOT starting with a $PATHVAR$: "${path‿ar}"!`,
	)

	if (parent_node) {
		// not only are we resolving the path relative to the parent,
		// we also want to ensure the parent node type matches the $PATHVAR$

		switch (first_segment) {
			case PATHVARⵧROOTⵧNODE:
				// joker, matches any parent node
				break
			case PATHVARⵧROOTⵧPACKAGE: {
				ǃ.forⵧparam({ parent_node }).require(
					parent_node.type === "package" || parent_node.type === "monorepo", // special: the workspace root is also a package
				)
				break
			}
			case PATHVARⵧROOTⵧMONOREPO: {
				ǃ.forⵧparam({ parent_node }).require(parent_node.type === "monorepo")
				break
			}
			case PATHVARⵧROOTⵧWORKSPACE__LINE: {
				ǃ.forⵧparam({ parent_node }).require(parent_node.type === NODE_TYPEⵧWORKSPACES__LINE)
				break
			}
			default:
				throw new Error(`_resolveꓽarpath(): not implemented!`)
		}

		return path.resolve(parent_node.path‿abs, path‿ar.slice(first_segment.length + 1))
	}

	// need to find the correct node by walking up the tree
	throw new Error(`_resolveꓽarpath(): did you forget parent_node? auto not implemented!`)
}

/////////////////////////////////////////////////

import * as path from "node:path"
import { styleText } from "node:util"

import {
	type Node,
	type NodeⳇWorkspace,
	type AnyRepoFilePathⳇRelative,
	PATHVARⵧROOTⵧNODE,
	PATHVARⵧROOTⵧREPO,
	PATHVARⵧROOTⵧMONOREPO,
	type NodeⳇRepo,
	PATHVARⵧROOTⵧPACKAGE,
	type AnyRepoPathⳇRelative,
	type NodeBase,
	PATHVARⵧROOTⵧWORKSPACE__LINE,
	NODE_TYPEⵧREPO,
	NODE_TYPEⵧMONOREPO,
	NODE_TYPEⵧWORKSPACES__LINE,
	NODE_TYPEⵧPACKAGE,
	type NodeⳇPackage,
	type NodeRef,
} from "@infinite-monorepo/graph"
import * as PkgDetailsLib from "@infinite-monorepo/package-details"
import { type PureModuleDetails } from "@infinite-monorepo/package-details"
import { PkgInfosResolver } from "@infinite-monorepo/pkg-infos-resolver"
import type { DependencyDetails, DependencyType, PkgFQName } from "@infinite-monorepo/primitives"
import { type InfiniteMonorepoSpec } from "@infinite-monorepo/spec"
import { completeꓽspec } from "@infinite-monorepo/spec--defaults"
import { loadꓽspecⵧchainⵧraw } from "@infinite-monorepo/spec--load"
import type { StructuredFsⳇFileManifest } from "@infinite-monorepo/structured-file-manifest"

import { assert_from, assert } from "@monorepo-private/assert"
import { stringifyⵧstable } from "@monorepo-private/json-stable-stringify"
import { mergeꓽjson } from "@monorepo-private/read-write-any-structured-file"
import { ↆreadꓽfile } from "@monorepo-private/read-write-any-structured-file/read"
import type { Immutable, PathⳇAbsolute, DirPathⳇAbsolute, DirPathⳇRelative } from "@monorepo-private/ts--types"
import { normalizeError } from "@monorepo-private/utils--error"
import { isꓽErrorⵧrsrc_not_found } from "@monorepo-private/utils--error/v2"

import { getꓽnodesⵧbfs_untraversed } from "./selectors.ts"
import type {
	State,
	FileOutputAbsent,
	FileOutputPresent,
	AsyncCallbackReducer,
	SubStateⳇFactsFile,
	TraversalTracking,
} from "./types.ts"
