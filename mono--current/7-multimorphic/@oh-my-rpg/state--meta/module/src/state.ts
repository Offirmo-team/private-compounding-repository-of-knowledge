/////////////////////

import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { LIB, SCHEMA_VERSION } from "./consts.ts"
import type { State } from "./types.ts"

/////////////////////

function create(): Immutable<State> {
	return enforceꓽimmutable<State>({
		schema_version: SCHEMA_VERSION,
		revision: 0,

		slot_id: 0,

		is_web_diversity_supporter: false, // so far
		is_logged_in: false, // so far
		roles: [], // so far
	})
}

/////////////////////

function on_start_session(previous_state: Immutable<State>, is_web_diversity_supporter: boolean): Immutable<State> {
	if (previous_state.is_web_diversity_supporter === is_web_diversity_supporter) return previous_state

	return enforceꓽimmutable<State>({
		...previous_state,

		is_web_diversity_supporter,

		revision: previous_state.revision + 1,
	})
}

/*interface OnLoggedIn {
	is_logged_in: boolean
	roles: string[]
}*/
function on_logged_in_refresh(
	previous_state: Immutable<State>,
	is_logged_in: boolean,
	roles: Immutable<string[]> = [],
): Immutable<State> {
	const sorted_roles = [...roles].sort()

	if (previous_state.is_logged_in === is_logged_in && previous_state.roles.join(",") === sorted_roles.join(","))
		return previous_state // no change

	let state = previous_state

	return enforceꓽimmutable<State>({
		...state,

		is_logged_in,
		roles,

		revision: state.revision + 1,
	})
}

/////////////////////

export { create, on_start_session, on_logged_in_refresh }

/////////////////////
