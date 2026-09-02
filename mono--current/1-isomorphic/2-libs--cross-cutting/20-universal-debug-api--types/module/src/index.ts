import { type DebugApi as DebugApiV1 } from "./v1.ts"

interface DebugApiRoot {
	v1: DebugApiV1
}

type DebugApi = DebugApiV1

export {
	type DebugApiV1,

	// v latest
	type DebugApi,
	type DebugApiRoot,
}

// for convenience
export { type Logger, type LoggerCreationParams } from "@monorepo-private/practical-logger--types"
