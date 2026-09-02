import type { DebugApiRoot, DebugApi } from "@monorepo-private/universal-debug-api--types"

import createV1 from "./v1.ts"

// ensure the root is present
const _p = "_debug"
;(globalThis as any)[_p] ||= {} as DebugApiRoot

// install globally if no other implementation already present
;(globalThis as any)[_p].v1 ||= createV1()

// expose the installed implementation
const instance: DebugApi = (globalThis as any)[_p].v1

const { getLogger, exposeInternal, overrideHook, addDebugCommand } = instance

export {
	getLogger,
	exposeInternal,
	overrideHook,
	addDebugCommand,
	createV1, // for special cases
}

// types & sub-types, for convenience
export * from "@monorepo-private/universal-debug-api--types"
