import { Enum } from "typescript-string-enums"

import { type BaseUState } from "@monorepo-private/state-utils"
import { type Engagement, type PendingEngagementUId, type TrackedEngagement } from "@monorepo-private/ts--types"

//////////////////////////////////////////////////////////////////////

interface State<TextFormat> extends BaseUState {
	// first in, first out
	// newest are appended
	queue: Array<TrackedEngagement<TextFormat>>
}

//////////////////////////////////////////////////////////////////////

export {
	// for convenience
	type Engagement,
	type PendingEngagementUId,
	type TrackedEngagement,
	type State,
}
