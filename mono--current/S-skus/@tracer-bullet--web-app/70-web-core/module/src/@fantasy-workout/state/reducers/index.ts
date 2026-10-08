/////////////////////////////////////////////////
const MIN_INCREMENT_MS = 1000 / 24 // TODO review should this be left to the UI?

export function create(now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms()): Immutable<State> {
	let state: State = {
		ⵙapp_id: "@fantasy-workout",
		schema_version: SCHEMA_VERSION,
		last_user_investment_tms: now_ms,

		u_state: {
			schema_version: SCHEMA_VERSION,
			revision: 0,

			current_workout: null,
			status: "paused",
			last_resume‿tms: 0,
			last_resume__playhead‿tms: 0,
		},
		t_state: {
			schema_version: SCHEMA_VERSION,
			revision: 0,
			timestamp_ms: now_ms,

			playhead_tms: 0,
		},
	}

	return state
}

/////////////////////////////////////////////////

export function selectꓽworkout(
	state: Immutable<State>,
	workout: Immutable<Workout>,
	now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): Immutable<State> {
	const { u_state, t_state } = state

	if (u_state.current_workout === workout) return state

	state = _reset_to_no_workout(state, now_ms)

	return {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...u_state,
			revision: u_state.revision + 1,

			current_workout: workout,
		},
	}
}

export function exitꓽworkout(
	state: Immutable<State>,
	now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): Immutable<State> {
	const { u_state } = state

	if (!u_state.current_workout) return state

	state = _reset_to_no_workout(state, now_ms)

	return {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...u_state,
			revision: u_state.revision + 1,
		},
	}
}

/////////////////////////////////////////////////

export function resume(state: Immutable<State>, now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms()): Immutable<State> {
	const { u_state } = state

	if (u_state.status === "running") return state

	state = update_to_now(state, now_ms)

	return {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...u_state,
			revision: u_state.revision + 1,

			status: "running",
			last_resume‿tms: now_ms,
			last_resume__playhead‿tms: state.t_state.playhead_tms,
		},
	}
}

function _pause(state: Immutable<State>, now_ms: TimestampUTCMs): Immutable<State> {
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

/////////////////////////////////////////////////

export function update_to_now(
	state: Immutable<State>,
	now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): Immutable<State> {
	const ǃ = assert_from({ update_to_now })

	const { u_state, t_state } = state

	const elapsed_since_last_update‿ms = now_ms - t_state.timestamp_ms
	ǃ.require(elapsed_since_last_update‿ms >= 0, "time travel back in time?")
	if (elapsed_since_last_update‿ms < MIN_INCREMENT_MS) return state

	state = {
		...state,
		t_state: {
			...t_state,
			timestamp_ms: now_ms,
		},
	}

	if (u_state.status === "paused") return state // no other change

	// OK we're running
	const elapsed_since_last_resume‿ms = now_ms - u_state.last_resume‿tms
	const playhead_tms = u_state.last_resume__playhead‿tms + elapsed_since_last_resume‿ms

	state = {
		...state,
		t_state: {
			...t_state,

			playhead_tms,
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
		last_resume__playhead‿tms: 0,
	}

	if (t_state.playhead_tms) {
		t_state = {
			...t_state,
			timestamp_ms: now_ms,
			revision: u_state.revision + 1,

			playhead_tms: 0,
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
import { type Immutable, enforceꓽimmutable } from "@monorepo-private/offirmo-state"
import { type TimestampUTCMs, getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"
import type { DurationMs } from "@monorepo-private/ts--types"

import type { Workout } from "../../types/types.ts"
import { SCHEMA_VERSION } from "../consts.ts"
import { type State } from "../types.ts"
