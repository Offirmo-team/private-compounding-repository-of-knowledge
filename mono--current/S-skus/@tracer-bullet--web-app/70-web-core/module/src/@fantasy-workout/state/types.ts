/////////////////////////////////////////////////

export interface UState extends BaseUState {
	// core

	// player terminology
	current_workout: Workout | null // ~playlist
	status: "paused" | "running"
	last_resume‿tms: TimestampUTCMs // to compute elapsed time since (if running)
	last_resume__playhead‿tms: TimestampUTCMs // relative to the beginning of the workout

	// technical
	//prng: PRNGState
	//engagement: EngagementState<HypermediaContentType>

	// meta = growth etc.
	//meta: MetaState
	//codes: CodesState
}

// Reminder: this state only contains stuff that changes through time
// and that can be re-inferred at any time from an earlier version.
export interface TState extends BaseTState {
	playhead_tms: DurationMs // relative to the beginning of the workout
}

export interface State extends BaseRootState<UState, TState> {
	schema_version: number // yes it's redundant but very convenient for debugging in the console
}

/////////////////////////////////////////////////

import { type BaseUState, type BaseTState, type BaseRootState } from "@monorepo-private/offirmo-state"
import type { TimestampUTCMs } from "@monorepo-private/timestamps"
import type { DurationMs, PositiveInteger } from "@monorepo-private/ts--types"

import type { Workout } from "../types/types.ts"
