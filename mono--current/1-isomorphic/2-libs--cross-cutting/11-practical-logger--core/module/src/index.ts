import { create as createLogger } from "./core.ts"
export { createLogger }

export * from "@monorepo-private/practical-logger--types"

export {
	ALL_LOG_LEVELS,
	LOG_LEVEL_TO_INTEGER,
	LOG_LEVEL_TO_HUMAN,
	DEFAULT_LOG_LEVEL,
	DEFAULT_LOGGER_KEY,
} from "./consts.ts"

export { checkLevel } from "./core.ts"
export * from "./normalize-args.ts"
