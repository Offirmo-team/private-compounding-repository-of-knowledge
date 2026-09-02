import { type TBRSoftExecutionContext, decorateꓽSXC } from "@tbrpg/definitions"

import { getRootSXC } from "@monorepo-private/soft-execution-context"

import { LIB } from "./consts.ts"

function getꓽSXC(parent: TBRSoftExecutionContext = getRootSXC()): TBRSoftExecutionContext {
	return decorateꓽSXC(
		parent.createChild().setLogicalStack({ module: LIB }).setAnalyticsAndErrorDetails({
			sub_product: "state--wallet",
		}),
	)
}

export { type TBRSoftExecutionContext, getꓽSXC }
