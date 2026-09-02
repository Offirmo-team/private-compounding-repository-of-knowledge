import { getRootSEC } from '@monorepo-private/soft-execution-context'
import { OMRSoftExecutionContext, decorate_SEC } from '@tbrpg/definitions'

import { LIB } from './consts'

function getꓽSEC(parent?: OMRSoftExecutionContext): OMRSoftExecutionContext {
	return decorate_SEC(
		(parent || getRootSEC())
			.createChild()
			.setLogicalStack({module: LIB})
			.setAnalyticsAndErrorDetails({
				sub_product: LIB,
			}),
	)
}

export {
	OMRSoftExecutionContext,
	getꓽSEC,
}
