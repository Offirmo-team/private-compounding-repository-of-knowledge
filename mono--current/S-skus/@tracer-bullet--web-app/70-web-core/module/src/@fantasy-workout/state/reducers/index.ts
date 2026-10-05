/////////////////////////////////////////////////

import * as EnergyState from "@tbrpg/state--energy"

export function create(now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms()): Immutable<State> {
	let state: Immutable<State> = {
		ⵙapp_id: "@fantasy-workout",
		schema_version: SCHEMA_VERSION,
		last_user_investment_tms: now_ms,

		u_state: {
			schema_version: SCHEMA_VERSION,
			revision: 0,
		},
		t_state: {
			schema_version: SCHEMA_VERSION,
			revision: 0,
		},
	}
}

/////////////////////////////////////////////////

/////////////////////////////////////////////////

function _update_to_now(state: Immutable<State>, now_ms: TimestampUTCMs): Immutable<State> {
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

import { assert_from, assert } from "@monorepo-private/assert"
import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"
import { type TimestampUTCMs, getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"

import { SCHEMA_VERSION } from "../consts.ts"
import { type State } from "../types.ts"
