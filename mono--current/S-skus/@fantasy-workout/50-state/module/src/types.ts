/////////////////////////////////////////////////

export interface UState extends BaseUState {
	// core

	// player terminology
	current_workout: Immutable<Workout> | null // ~playlist
	status: "paused" | "running"
	last_resume‿tms: TimestampUTCMs // to compute elapsed time since (only read if running, 0 is acceptable as a default value)
	last_resume__playhead‿ms: DurationMs // relative to the beginning of the workout

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
	playhead‿ms: DurationMs // relative to the beginning of the workout. Can go over, don't care = it's an internal value we'll map to the workout sequence
}

export interface State extends BaseRootState<UState, TState> {
	schema_version: number // yes it's redundant but very convenient for debugging in the console
}

/////////////////////////////////////////////////

import { type BaseUState, type BaseTState, type BaseRootState, type Immutable } from "@monorepo-private/offirmo-state"
import type { TimestampUTCMs } from "@monorepo-private/timestamps"
import type { DurationMs } from "@monorepo-private/ts--types"

import type { Workout } from "../types/index.ts"
