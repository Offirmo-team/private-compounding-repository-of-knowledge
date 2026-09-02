import { _createSXC } from "./internal/create.ts"
import type { SoftExecutionContext } from "./types.ts"

/////////////////////

function getRootSXC<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}>(): SoftExecutionContext<
	Injections,
	AnalyticsDetails,
	ErrorDetails
> {
	const global_this = globalThis as any

	if (!global_this.__global_root_sec) {
		//console.log(`[${LIB}] Creating root context…`)
		global_this.__global_root_sec = _createSXC()
	}

	return global_this.__global_root_sec
}

// useful to
// - not pollute globalThis
// - reset between tests
function _TEST_ONLY__reset_root_SXC() {
	const global_this = globalThis as any

	delete global_this.__global_root_sec
}

/////////////////////

export { getRootSXC, _TEST_ONLY__reset_root_SXC }
