import type { XXError } from "@monorepo-private/utils--error"

import type { SoftExecutionContext } from "../types.ts"

import { INTERNAL_PROP } from "./consts.ts"

/////////////////////////////////////////////////

interface InternalSXCState {
	sid: number // not really useful yet, but helps debug

	parent: InternalSXCState | undefined

	plugins: Record<string, unknown>

	// per-SXC cache for complex computations
	cache: {
		statePath?: InternalSXCState[] // chain of all parent states to this one
	}
}

interface InternalSXC extends SoftExecutionContext {
	[INTERNAL_PROP]: InternalSXCState

	// from plugins
	_decorateErrorWithDetails(err: XXError): XXError
	_decorateErrorWithLogicalStack(err: XXError): XXError
}

/////////////////////////////////////////////////

export { type InternalSXCState, type InternalSXC }
