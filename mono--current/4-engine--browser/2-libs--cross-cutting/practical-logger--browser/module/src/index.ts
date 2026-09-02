import { _request_install_better_console_groups_if_not_already } from "@monorepo-private/better-console-groups"
import { createLogger as createLoggerCore } from "@monorepo-private/practical-logger--core"
import type { LogSink, Logger, LoggerCreationParams } from "@monorepo-private/practical-logger--types"

import { create } from "./sinks/index.ts"
import type { SinkOptions } from "./types.ts"

/////////////////////////////////////////////////

const ORIGINAL_CONSOLE = console

/////////////////////////////////////////////////

function createLogger(p: Readonly<LoggerCreationParams<SinkOptions>> = {}): Logger {
	_request_install_better_console_groups_if_not_already(p.sinkOptions?.betterGroups !== false)

	const sink: LogSink = p.sinkOptions?.sink || create(p.sinkOptions)

	const { group, groupCollapsed, groupEnd } = ORIGINAL_CONSOLE
	return {
		...createLoggerCore(p, sink),
		group,
		groupCollapsed,
		groupEnd,
	}
}

/////////////////////////////////////////////////

export {
	createLogger,
	_request_install_better_console_groups_if_not_already, // to allow early override
}
export * from "@monorepo-private/practical-logger--types"
export { DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY } from "@monorepo-private/practical-logger--core"
