import { createLogger as createLoggerCore } from "@monorepo-private/practical-logger--core"
import type { Logger, LoggerCreationParams } from "@monorepo-private/practical-logger--types"

import createSink from "./sinks/to-console.ts"
import type { SinkOptions } from "./types.ts"

const ORIGINAL_CONSOLE = console

function createLogger(p: Readonly<LoggerCreationParams<SinkOptions>> = {}): Logger {
	const { group, groupCollapsed, groupEnd } = ORIGINAL_CONSOLE
	return {
		...createLoggerCore(p, p.sinkOptions?.sink || createSink(p.sinkOptions)),
		group,
		groupCollapsed,
		groupEnd,
	}
}

export { createLogger }

export * from "@monorepo-private/practical-logger--types"
export { DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY } from "@monorepo-private/practical-logger--core"
