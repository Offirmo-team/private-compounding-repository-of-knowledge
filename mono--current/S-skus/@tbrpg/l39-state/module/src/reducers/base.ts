/////////////////////

/////////////////////
import * as EngagementState from "@oh-my-rpg/state--engagement"
import { type PendingEngagementUId } from "@oh-my-rpg/state--engagement"
import * as MetaState from "@oh-my-rpg/state--meta"
import { CharacterClass, rename, switch_class as _switch_class } from "@tbrpg/state--character"
import * as InventoryState from "@tbrpg/state--inventory"

import { complete_or_cancel_eager_mutation_propagating_possible_child_mutation } from "@monorepo-private/state-utils"
import { type TimestampUTCMs, getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"
import { type Immutable } from "@monorepo-private/ts--types"
import { type UUID } from "@monorepo-private/uuid"
/////////////////////

import { LIB } from "../consts.ts"
import { getꓽavailable_classes } from "../selectors/index.ts"
import { getꓽSXC } from "../services/sxc.ts"
import { type State } from "../types.ts"

import { _refresh_achievements } from "./achievements/index.ts"
import { _sell_item, _update_to_now } from "./internal.ts"

/////////////////////

interface StartSessionParams {
	now_ms?: TimestampUTCMs // will be inferred if not provided
	is_web_diversity_supporter?: boolean | undefined // if using a non-monopolistic browser, we reward
}
function on_start_session(
	previous_state: Immutable<State>,
	{ now_ms = getꓽUTC_timestamp‿ms(), is_web_diversity_supporter }: StartSessionParams = {},
): Immutable<State> {
	// update energy (not sure needed but good safety)
	let state = _update_to_now(previous_state, now_ms)

	state = {
		...state,
		//last_user_investment_tms: now_ms, // NO! this is NOT a valuable user action
		u_state: {
			...state.u_state,

			meta: MetaState.on_start_session(state.u_state.meta, is_web_diversity_supporter ?? false),

			revision: previous_state.u_state.revision + 1,
		},
	}

	// TODO recap here as Engagement flow?
	// NO because would cause a non-user initiated mutation, which would trigger a useless sync

	// new achievements may have appeared
	// (new content = not the same as a migration)
	return _refresh_achievements(state)
}

function on_logged_in_refresh(
	previous_state: Immutable<State>,
	is_logged_in: boolean,
	roles: Immutable<string[]> = [],
	now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): Immutable<State> {
	// update energy (not sure needed but good safety)
	let updated_state = _update_to_now(previous_state, now_ms)
	let state = updated_state

	state = {
		...state,
		//last_user_investment_tms: now_ms, // No, this is NOT a valuable user action
		u_state: {
			...state.u_state,
			meta: MetaState.on_logged_in_refresh(state.u_state.meta, is_logged_in, roles),
		},
	}

	// TODO engagement here ?

	state = _refresh_achievements(state)
	state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
		previous_state,
		state,
		updated_state,
		"on_logged_in_refresh",
	)

	return state
}

interface UpdateToNowParams {
	now_ms?: TimestampUTCMs
}
function update_to_now(
	state: Immutable<State>,
	{ now_ms = getꓽUTC_timestamp‿ms() }: UpdateToNowParams,
): Immutable<State> {
	return _update_to_now(state, now_ms)
}

interface EquipItemParams {
	now_ms?: TimestampUTCMs // will be inferred if not provided
	uuid: UUID
}
function equip_item(
	previous_state: Immutable<State>,
	{ now_ms = getꓽUTC_timestamp‿ms(), uuid }: EquipItemParams,
): Immutable<State> {
	let state = previous_state
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			inventory: InventoryState.equip_item(state.u_state.inventory, uuid),
			revision: previous_state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

interface SellItemParams {
	now_ms?: TimestampUTCMs // will be inferred if not provided
	uuid: UUID
}
function sell_item(
	previous_state: Immutable<State>,
	{ now_ms = getꓽUTC_timestamp‿ms(), uuid }: SellItemParams,
): Immutable<State> {
	let state = previous_state
	state = _sell_item(state, uuid)
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			revision: previous_state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

function rename_avatar(
	previous_state: Immutable<State>,
	new_name: string,
	now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): Immutable<State> {
	let state = previous_state
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			avatar: rename(getꓽSXC(), state.u_state.avatar, new_name),
			revision: previous_state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

function switch_class(
	previous_state: Immutable<State>,
	new_class: CharacterClass,
	now_ms: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): Immutable<State> {
	if (!getꓽavailable_classes(previous_state.u_state).includes(new_class))
		throw new Error(`${LIB}: switch class: invalid class "${new_class}"!`)

	let state = previous_state
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			avatar: _switch_class(getꓽSXC(), state.u_state.avatar, new_class),
			revision: previous_state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

interface AcknowledgeEngagementMsgSeenParams {
	now_ms?: TimestampUTCMs // will be inferred if not provided
	uids: Immutable<Array<PendingEngagementUId>>
}
function acknowledge_engagement_msg_seen(
	previous_state: Immutable<State>,
	{ now_ms = getꓽUTC_timestamp‿ms(), uids }: AcknowledgeEngagementMsgSeenParams,
): Immutable<State> {
	if (uids.length === 0) return previous_state

	let state = previous_state
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			engagement: EngagementState.acknowledge_seen(state.u_state.engagement, uids),
			revision: previous_state.u_state.revision + 1,
		},
	}

	return state
}

/////////////////////

export {
	type AcknowledgeEngagementMsgSeenParams,
	acknowledge_engagement_msg_seen,
	type StartSessionParams,
	on_start_session,
	on_logged_in_refresh,
	type UpdateToNowParams,
	update_to_now,
	type EquipItemParams,
	equip_item,
	type SellItemParams,
	sell_item,
	rename_avatar,
	switch_class,
}
