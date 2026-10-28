/////////////////////////////////////////////////

export interface InternalSXCⳇState {
	sid: number // not really useful yet, but helps debug

	parent: InternalSXCⳇState | undefined

	plugins: InternalSXCⳇStateⳇPlugins

	// per-SXC cache for complex computations
	cache: {
		statePath?: InternalSXCⳇState[] // chain of all parent states to this one
	}
}

export interface InternalSXC extends SoftExecutionContext {
	[INTERNAL_PROP]: InternalSXCⳇState

	// from plugins
	_decorateErrorWithDetails(err: XXError): XXError
	_decorateErrorWithLogicalStack(err: XXError): XXError
}

/////////////////////////////////////////////////

import type { XXError } from "@monorepo-private/utils--error"

import type { SoftExecutionContext } from "../types.ts"

import { INTERNAL_PROP } from "./consts.ts"
import type { InternalSXCⳇStateⳇPlugins } from "./plugins/types.ts"
