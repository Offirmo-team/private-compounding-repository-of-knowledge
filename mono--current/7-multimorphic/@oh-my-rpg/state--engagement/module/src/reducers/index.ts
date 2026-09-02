import { assert_from, assert } from "@monorepo-private/assert"
import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { SCHEMA_VERSION } from "../consts.ts"
import { type Engagement, type TrackedEngagement, type PendingEngagementUId, type State } from "../types.ts"
import { type SoftExecutionContext, getꓽSXC } from "../utils/sec.ts"

//////////////////////////////////////////////////////////////////////

function create<TextFormat>(SXC?: SoftExecutionContext): Immutable<State<TextFormat>> {
	return getꓽSXC(SXC).xTry("create", () => {
		return enforceꓽimmutable<State<TextFormat>>({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			queue: [],
		})
	})
}

/////////////////////

function enqueue<TextFormat>(
	state: Immutable<State<TextFormat>>,
	engagement: Immutable<Engagement<TextFormat>>,
): Immutable<State<TextFormat>> {
	// Avoid duplication? Possible bug? hard to detect...
	// ex. multiple consecutive level rises are ok
	// ex. multiple new achievements

	const pending: Immutable<TrackedEngagement<TextFormat>> = {
		...engagement,
		uid: state.revision + 1,
	}

	return {
		...state,

		queue: [...state.queue, pending],

		revision: state.revision + 1,
	}
}

function acknowledge_seen<TextFormat>(
	state: Immutable<State<TextFormat>>,
	uids: Immutable<Array<PendingEngagementUId>>,
): Immutable<State<TextFormat>> {
	const uid_left_to_dequeue = new Set<PendingEngagementUId>(uids) // to dedupe + detect unknowns
	state.queue.forEach((queued) => {
		uid_left_to_dequeue.delete(queued.uid)
	})
	assert(uid_left_to_dequeue.size === 0, "Engagement: all acks should refer to existing pending engagements!")

	return {
		...state,

		queue: state.queue.filter((queued) => !uids.includes(queued.uid)),

		revision: state.revision + 1,
	}
}

function acknowledge_seenⵧall<TextFormat>(state: Immutable<State<TextFormat>>): Immutable<State<TextFormat>> {
	if (!state.queue.length) return state

	return {
		...state,

		queue: [],

		revision: state.revision + 1,
	}
}

// TODO one day: allow updates? ex. for permanent "intro" ones?

//////////////////////////////////////////////////////////////////////

export { create, enqueue, acknowledge_seen, acknowledge_seenⵧall }

//////////////////////////////////////////////////////////////////////
