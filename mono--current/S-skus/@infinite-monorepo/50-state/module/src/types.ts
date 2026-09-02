import type { Node, AnyRepoFilePathⳇRelative } from "@infinite-monorepo/graph"
import type { PureModuleDetails } from "@infinite-monorepo/package-details"
import { PkgInfosResolver } from "@infinite-monorepo/pkg-infos-resolver"
import type { InfiniteMonorepoSpec } from "@infinite-monorepo/spec"
import type { StructuredFsⳇFileManifest } from "@infinite-monorepo/structured-file-manifest"

import type { Immutable, JSONObject } from "@monorepo-private/ts--types"
import { type XXError } from "@monorepo-private/utils--error"

/////////////////////////////////////////////////

export type FileOutputIntent =
	| "not-present"
	| "present" // default content if not present, won't touch if present
	| "present--exact" // fully overwrite
	| "present--containing" // deep-merge content
	| "symlink"

interface BaseFileOutput {
	path‿ar?: AnyRepoFilePathⳇRelative // optional if manifest is provided
	parent_node?: Node | Immutable<Node> // if path and needed to resolve the path
	intent: FileOutputIntent
}

export interface FileOutputAbsent extends BaseFileOutput {
	path‿ar: AnyRepoFilePathⳇRelative // mandatory TODO why??
	intent: "not-present"
}
export interface FileOutputPresent extends BaseFileOutput {
	intent: "present" | "present--exact" | "present--containing" | "symlink"
	manifest: StructuredFsⳇFileManifest
	content: Immutable<JSONObject>
}

export interface TraversalTracking {
	status: "new" | "analyzed"
	statusⵧbfs: "todo" | "done"
}

/////////////////////////////////////////////////

export type AsyncCallbackReducer<T> = (state: Immutable<State>, result: T | Error) => Immutable<State>

// TODO
export interface SubStateⳇPendingTask {
	ೱtask: Promise<any>
	callback: AsyncCallbackReducer<any>
}

export interface SubStateⳇFactsFile {
	manifest: StructuredFsⳇFileManifest // useful to validate compat if concurrent requests
	content:
		| undefined // not loaded yet (promise pending)
		| null // null = file not found
		| "error" // issue reading this structured file, ex. parse error
		| JSONObject // structured result
	// those props are only present when content is undefined
	ↆretrieval: Promise<JSONObject>
	pending_callbacks?: Array<AsyncCallbackReducer<JSONObject | null>>
	_error?: XXError
}

export interface State {
	file_manifests: Record<AnyRepoFilePathⳇRelative, StructuredFsⳇFileManifest>
	root_pkg_details: PureModuleDetails // TODO should be in the node?

	specⵧroot: InfiniteMonorepoSpec

	pkg_infos_resolver: PkgInfosResolver

	graphs: {
		// different graph nodes may overlap, so we store them separately
		// ex. repo root may also be the workspace root
		nodesⵧscm: { [id: string]: Node & TraversalTracking }
		nodesⵧworkspace: { [id: string]: Node & TraversalTracking }
	}

	// anchor for plugins to put their stuff. Will not be mutated.
	plugin_area: Record<symbol, any>

	traversals: {
		onꓽnodeⵧdiscoveredⵧbfs__level: number
	}

	facts: {
		files: {
			// pre-existing files, discovered on-demand
			[path: string]: SubStateⳇFactsFile
		}
	}

	output_files: {
		[path: string]: FileOutputAbsent | FileOutputPresent
	}
}
