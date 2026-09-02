import { assert_from, assert } from "@monorepo-private/assert"
import type { Logger } from "@monorepo-private/practical-logger--types"
import { type SoftExecutionContext, getRootSXC } from "@monorepo-private/soft-execution-context"

import { LIB } from "./consts.ts"

/////////////////////////////////////////////////

function getꓽSXC(parent?: SoftExecutionContext): SoftExecutionContext {
	return (parent || getRootSXC()).createChild().setLogicalStack({ module: LIB }).setAnalyticsAndErrorDetails({
		sub_product: "state-prng",
	})
}

function getꓽlogger(SXC: SoftExecutionContext = getꓽSXC()): Logger {
	const { logger } = SXC.getInjectedDependencies()
	assert(logger.addCommonDetails, `${LIB}: expecting a SXC-injected Offirmo Practical Logger!`)
	return logger
}

/////////////////////////////////////////////////

export {
	type SoftExecutionContext, // for convenience
	getꓽSXC,
	getꓽlogger,
}
