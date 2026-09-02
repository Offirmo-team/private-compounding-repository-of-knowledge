import { createLogger } from "@monorepo-private/practical-logger--minimal-noop"
import type { DebugApiV1 } from "@monorepo-private/universal-debug-api--types"

export default function create(): DebugApiV1 {
	//console.trace('[UDA--placeholder installing…]')

	function NOOP() {}
	const NOOP_LOGGER = createLogger()

	return {
		getLogger: () => NOOP_LOGGER,
		overrideHook: (k, v) => v,
		exposeInternal: NOOP,
		addDebugCommand: NOOP,
	}
}
