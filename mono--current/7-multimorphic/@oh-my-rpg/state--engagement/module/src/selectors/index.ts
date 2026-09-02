import type { Immutable } from "@monorepo-private/ts--types"

import { type State, type TrackedEngagement } from "../types.ts"

//////////////////////////////////////////////////////////////////////

function getꓽpending_engagements<TextFormat>(
	state: Immutable<State<TextFormat>>,
): Immutable<Array<TrackedEngagement<TextFormat>>> {
	return state.queue
}

/*
function getꓽoldest_queuedⵧflow(state: Immutable<State>): Immutable<TrackedEngagement> | undefined {
	return state.queue
		.find(queued => queued.engagement.type === EngagementType.flow)
}

function getꓽoldest_queuedⵧnon_flow(state: Immutable<State>): Immutable<TrackedEngagement> | undefined {
	return state.queue
		.find(queued => queued.engagement.type !== EngagementType.flow)
}*/

//////////////////////////////////////////////////////////////////////

export {
	getꓽpending_engagements,

	/*getꓽoldest_queuedⵧflow,
	getꓽoldest_queuedⵧnon_flow,*/
}

//////////////////////////////////////////////////////////////////////
