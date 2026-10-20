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
	content: Immutable<JsonⳇObject>
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
		| JsonⳇObject // structured result
	// those props are only present when content is undefined
	ↆretrieval?: Promise<JsonⳇObject>
	pending_callbacks?: Array<AsyncCallbackReducer<JsonⳇObject | null>>
	_error?: XXError
}

// tslint:disable-next-line: variable-name
export const ApplySteps = Enum(
	// exact order of plugins, must match 100%
	"onꓽload",
	"onꓽspec_loaded", // full spec loaded from config + plugins
	//"onꓽnodeⵧdiscoveredⵧfirst_time", plugin-specific, happens intermingled as plugins are discovered
	//"onꓽnodeⵧdiscoveredⵧbfs", same
	"onꓽnodesⵧdiscovered", // all nodes discovered, no "onꓽnodeⵧdiscoveredⵧ*" not happen anymore
	"onꓽnodeⵧrefine",
	"onꓽapply",
)
export type ApplySteps = Enum<typeof ApplySteps> // eslint-disable-line no-redeclare

export interface State {
	steps_completed: Set<ApplySteps>

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

/////////////////////////////////////////////////

import type { Node, AnyRepoFilePathⳇRelative } from "@infinite-monorepo/graph"
import type { PureModuleDetails } from "@infinite-monorepo/package-details"
import { PkgInfosResolver } from "@infinite-monorepo/pkg-infos-resolver"
import type { InfiniteMonorepoSpec } from "@infinite-monorepo/spec"
import type { StructuredFsⳇFileManifest } from "@infinite-monorepo/structured-file-manifest"
import { Enum } from "typescript-string-enums"

import type { Immutable, JsonⳇObject } from "@monorepo-private/ts--types"
import { type XXError } from "@monorepo-private/utils--error"
