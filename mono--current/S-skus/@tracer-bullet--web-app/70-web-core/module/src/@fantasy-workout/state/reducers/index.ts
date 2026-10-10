/////////////////////////////////////////////////

const MIN_INCREMENT_MS = 1000 / 24 // TODO review should this be left to the UI?

export function create(now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms()): Immutable<State> {
	const state: State = {
		ⵙapp_id: "@fantasy-workout",
		schema_version: SCHEMA_VERSION,
		last_user_investment_tms: now_ms,

		u_state: {
			schema_version: SCHEMA_VERSION,
			revision: 0,

			current_workout: null,
			status: "paused",
			last_resume‿tms: 0,
			last_resume__playhead‿ms: 0,
		},
		t_state: {
			schema_version: SCHEMA_VERSION,
			revision: 0,
			timestamp_ms: now_ms,

			playhead‿ms: 0,
		},
	}

	return state
}

/////////////////////////////////////////////////

export function selectꓽworkout(
	state: Immutable<State>,
	workout__id: WorkoutⳇId,
	now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): Immutable<State> {
	if (state.u_state.current_workout?.id === workout__id) return state

	state = _reset_to_no_workout(state, now_ms)

	return {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			revision: state.u_state.revision + 1,

			current_workout: getꓽworkout(workout__id),
		},
	}
}

export function exitꓽworkout(
	state: Immutable<State>,
	now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): Immutable<State> {
	if (!state.u_state.current_workout) return state

	state = _reset_to_no_workout(state, now_ms)

	return {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			revision: state.u_state.revision + 1,
		},
	}
}

/////////////////////////////////////////////////

export function resume(state: Immutable<State>, now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms()): Immutable<State> {
	const ǃ = assert_from({ resume })

	ǃ.require(state.u_state.current_workout, `can't resume if no workout`)
	if (state.u_state.status === "running") return state

	return {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			revision: state.u_state.revision + 1,

			status: "running",
			last_resume‿tms: now_ms,
			last_resume__playhead‿ms: state.t_state.playhead‿ms,
		},
	}
}

export function pause(state: Immutable<State>, now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms()): Immutable<State> {
	const ǃ = assert_from({ resume })

	ǃ.require(state.u_state.current_workout, `can't pause if no workout`)

	if (state.u_state.status === "paused") return state

	state = update_to_now(state, now_ms) // important to get the correct playhead from t_state

	return {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			revision: state.u_state.revision + 1,

			status: "paused",
		},
	}
}

/*
// TODO
function _skip(state: Immutable<State>, now_ms: TimestampUTCMs): Immutable<State> {
	const { u_state, t_state } = state

	//const t_state_e = EnergyState.update_to_now([u_state.energy, t_state.energy], now_ms)

	//if (t_state_e === t_state.energy) return state // no change

	return {
		...state,
		t_state: {
			...t_state,
			timestamp_ms: t_state_e.timestamp_ms,
			//energy: t_state_e,
		},
	}
}
*/

/////////////////////////////////////////////////

export function update_to_now(
	state: Immutable<State>,
	now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): Immutable<State> {
	const ǃ = assert_from({ update_to_now })

	const elapsed_since_last_update‿ms = now_ms - state.t_state.timestamp_ms
	ǃ.require(elapsed_since_last_update‿ms >= 0, "time travel back in time?")
	if (elapsed_since_last_update‿ms < MIN_INCREMENT_MS) return state
	state = {
		...state,
		t_state: {
			...state.t_state,
			timestamp_ms: now_ms,
		},
	}

	if (state.u_state.status === "paused") return state // no other change

	// OK we're running
	ǃ.ensure(state.u_state.last_resume‿tms > 0, "u_state.last_resume‿tms not inited?")
	ǃ.ensure(state.u_state.last_resume__playhead‿ms <= state.t_state.playhead‿ms, "states playhead‿ms not in sync?") // reminder: First resume has playhead at 0 of course
	const elapsed_since_last_resume‿ms = now_ms - state.u_state.last_resume‿tms
	const playhead‿ms = state.u_state.last_resume__playhead‿ms + elapsed_since_last_resume‿ms

	state = {
		...state,
		t_state: {
			...state.t_state,

			playhead‿ms,
		},
	}

	return state
}

/////////////////////////////////////////////////

function _reset_to_no_workout(state: Immutable<State>, now_ms: TimestampUTCMs): Immutable<State> {
	if (!state.u_state.current_workout) return state

	state = _reset_workout(state, now_ms)

	return {
		...state,

		u_state: {
			...state.u_state,

			current_workout: null,
		},
	}
}

// if any, reset to start of workout, paused (~exit/stop)
function _reset_workout(state: Immutable<State>, now_ms: TimestampUTCMs): Immutable<State> {
	let { u_state, t_state } = state

	if (!u_state.current_workout) return state

	u_state = {
		...u_state,

		status: "paused",
		last_resume‿tms: 0,
		last_resume__playhead‿ms: 0,
	}

	if (t_state.playhead‿ms) {
		t_state = {
			...t_state,
			timestamp_ms: now_ms,
			revision: t_state.revision + 1,

			playhead‿ms: 0,
		}
	}

	return {
		...state,

		u_state,
		t_state,
	}
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import { type Immutable } from "@monorepo-private/offirmo-state"
import { type TimestampUTCMs, getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"

import { getꓽworkout } from "../../data/index.ts"
import type { WorkoutⳇId } from "../../types/index.ts"
import { SCHEMA_VERSION } from "../consts.ts"
import { type State } from "../types.ts"
