/////////////////////////////////////////////////

// MUST match resolveꓽasync_operations()
export function hasꓽasync_operations__pending(state: Immutable<State>): boolean {
	const has_pending_facts = Object.entries(state.facts.files).some(([path, substate]) => {
		return !!substate.ↆretrieval
	})

	const has_pending_resolutions = state.pkg_infos_resolver.hasꓽasync_operations__pending()

	return has_pending_facts || has_pending_resolutions
}

// TODO return node refs
export function getꓽnodesⵧnew(state: Immutable<State>): Immutable<Array<Node>> {
	return Object.values(state.graphs.nodesⵧworkspace).filter((node) => node.status === "new")
}

// TODO return node refs
export function getꓽnodesⵧbfs_untraversed(
	state: Immutable<State>,
	target_level = state.traversals.onꓽnodeⵧdiscoveredⵧbfs__level,
): Immutable<Array<Node>> {
	const ǃ = assert_from({ getꓽnodesⵧbfs_untraversed })

	const untraversed_nodes = Object.values(state.graphs.nodesⵧworkspace)
		.filter((node) => node.statusⵧbfs === "todo")
		.filter((node) => {
			const node__bfs_level = node.bfs_level
			ǃ.forⵧvalue({ node__bfs_level }).ensure(
				node__bfs_level >= target_level,
				`Unexpected lower BFS node (${node__bfs_level}) untraversed while the graph is already at level ${target_level}! (late discovery?)`,
			)
			return true
		})

	return untraversed_nodes.filter((node) => node.bfs_level === target_level)
}

export function getꓽnodeⵧmonorepo(state: Immutable<State>): Immutable<Node> {
	const node = Object.values(state.graphs.nodesⵧworkspace).find((n) => n.type === "monorepo")
	assert(!!node)
	return node
}

export function getꓽruntimeⵧlocal(state: Immutable<State>, node: Immutable<Node>): JsRuntimeSpec {
	// TODO 1D node with inheritance

	const raw_spec = state.specⵧroot.runtimeⵧlocal

	if (typeof raw_spec === "string") {
		switch (raw_spec) {
			case "node":
				// expand to full
				return {
					name: "node",
					versionsⵧacceptable: `^${KNOWN_VERSIONS["Node.js"]!["LTS"]}`,
				}
			default:
				throw new Error("Unhandled runtimeⵧlocal!")
		}
	}

	if (raw_spec.name) {
		return raw_spec
	}

	throw new Error("Unhandled runtimeⵧlocal!")
}

export function getꓽpackage_manager(state: Immutable<State>): PackageManagerSpec {
	const raw_spec = state.specⵧroot.package_manager
	if (typeof raw_spec === "string") {
		switch (raw_spec) {
			case "pnpm":
				return {
					name: "pnpm",
					versionsⵧacceptable: `^${KNOWN_VERSIONS["pnpm"]!["recommended"]}`,
				}
			case "bolt":
				return {
					// https://github.com/boltpkg/bolt
					name: "bolt",
					versionsⵧacceptable: "^0",
					versionⵧrecommended: "0.24.10",
				}

			default:
				throw new Error(`Unhandled package_manager "${raw_spec}"!`)
		}
	}

	if (raw_spec.name) {
		return raw_spec
	}

	throw new Error("Unhandled runtimeⵧlocal!")
}

export function getꓽworkspace_lines(state: Immutable<State>): InfiniteMonorepoSpec["workspaces"] {
	return state.specⵧroot.workspaces.toSorted().filter((p: string) => {
		return !p.startsWith("#") && !p.startsWith("xx") // we allow "commenting" a workspace to help "progressive resurrection"
	})
}

/////////////////////////////////////////////////

import { type Node } from "@infinite-monorepo/graph"
import { KNOWN_VERSIONS } from "@infinite-monorepo/known-versions"
import type { JsRuntimeSpec, PackageManagerSpec } from "@infinite-monorepo/primitives"
import type { InfiniteMonorepoSpec } from "@infinite-monorepo/spec"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { State, SubStateⳇFactsFile } from "./types.ts"
