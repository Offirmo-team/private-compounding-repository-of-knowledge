import { type SoftExecutionContext, getRootSXC } from "@monorepo-private/soft-execution-context"

import { LIB } from "./consts.ts"

function getꓽSXC(parent?: SoftExecutionContext): SoftExecutionContext {
	return (parent || getRootSXC()).createChild().setLogicalStack({ module: LIB }).setAnalyticsAndErrorDetails({
		sub_product: "state-meta",
	})
}

export { type SoftExecutionContext, getꓽSXC }
