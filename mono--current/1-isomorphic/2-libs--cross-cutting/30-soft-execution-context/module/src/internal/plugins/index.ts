import { PLUGIN as PLUGIN_ANALYTICS } from "./analytics/index.ts"
import { PLUGIN as PLUGIN_DI } from "./dependency-injection/index.ts"
import { PLUGIN as PLUGIN_ERROR_HANDLING } from "./error-handling/index.ts"
import { PLUGIN as PLUGIN_LOGICAL_STACK } from "./logical-stack/index.ts"
import type { SXCPlugin } from "./types.ts"

const PLUGINS_BY_ID: Record<string, SXCPlugin> = {
	[PLUGIN_ANALYTICS.id]: PLUGIN_ANALYTICS,
	[PLUGIN_DI.id]: PLUGIN_DI,
	[PLUGIN_ERROR_HANDLING.id]: PLUGIN_ERROR_HANDLING,
	[PLUGIN_LOGICAL_STACK.id]: PLUGIN_LOGICAL_STACK,
}

const PLUGINS = Object.values(PLUGINS_BY_ID)

export { PLUGINS_BY_ID, PLUGINS }
