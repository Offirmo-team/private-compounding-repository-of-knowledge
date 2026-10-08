/////////////////////////////////////////////////
// building blocks

// critical for migrations
export interface WithSchemaVersion {
	// NOTE: 0 is a fallback value when error
	// so recommended to not start with 0 once released
	// (0 is ok while throwaway / sandbox)
	schema_version: PositiveInteger
}

// count of user-initiated *changes*
// (should not increment if an action triggers no change)
export interface WithRevision {
	revision: PositiveInteger
}

// time of last *user-initiated* *investment* (not activity)
// may NOT be incremented by some meta, non investment actions
// particularly important to discriminate if the state forked
export interface WithLastUserInvestmentTimestamp {
	last_user_investment_tms: TimestampUTCMs
}

// for time-related data (ex. energy refill)
// Note that we expect our code to be able to time-travel, so for an equal revision,
// it shouldn't matter the time
export interface WithTimestamp {
	timestamp_ms: TimestampUTCMs
}

// combo
export interface StateInfos extends WithSchemaVersion, WithRevision, WithLastUserInvestmentTimestamp, WithTimestamp {}

/////////////////////////////////////////////////
// state building blocks

// most basic building block, implemented by most states
export interface BaseState extends WithSchemaVersion, WithRevision {}

/** More advanced state: which ONLY changes with user actions */
export interface BaseUState extends BaseState {}

/**
 * More advanced state: which changes with BOTH user actions and elapsed time
 *
 * "update_to_now" can be used to update/refresh it and is not a semantical change, thus doesn't need to be persisted
 * (can be re-updated from last persist)
 *
 * Example: TBRPG energy. In theory, we could re-create it from full click history, but it's much simpler to remember
 * energy at time T.
 */
export interface BaseTState extends BaseState, WithTimestamp {}

// tuple of U+T State
export type UTBundle<U extends BaseUState = BaseUState, T extends BaseTState = BaseTState> = [U, T]

// most advanced state = aggregation of multiple U+T states
// WARNING should only be used for the "root" in the final app, use UTBundle in libs
export interface BaseRootState<
	U extends BaseUState = BaseUState,
	T extends BaseTState = BaseTState,
> extends WithLastUserInvestmentTimestamp {
	// schema_version, revision -> NO, would be redundant, see u_state & t_state
	// HOWEVER very useful for debug -> we let the final user make the call and manage it.

	// unique identifier of the app using this state.
	// Useful for dedicated checks/ops in common code.
	// Prefixed with Unicode to be put at the bottom, helps readability on ordered stringified.
	ⵙapp_id: string

	u_state: U
	t_state: T
}

// for generic functions, ex. reducers
export type AnyOffirmoState<
	B extends BaseState = BaseState,
	U extends BaseUState = BaseUState,
	T extends BaseTState = BaseTState,
> = B | U | T | UTBundle<U, T> | BaseRootState<U, T>

/////////////////////////////////////////////////
// reducer

export interface BaseAction {
	type: string
	time: TimestampUTCMs
	expected_revisions: {
		[k: string]: number
	}
}

// standard action types, to be optionally handled by a reducer
// tslint:disable-next-line: variable-name
export const GenericActionType = Enum(
	"stdꓽupdate_to_now", // generic TState update

	"stdꓽreconcile", // reconcile current state with another candidate state
	// - the passed state MAY or MAY NOT be newer (persistence, cloud, service worker push, etc.)
	// - there must be an existing state (! from init)
	// - an automatic implementation is easy ("most invested wins").
	//   but a State may want to override it with a more clever one, see CRDT

	"stdꓽerror", // generic serious error
	// for serious abnormal errors harming user experience, ex. data loss, security
	// It's up to the reducer to handle it properly (message etc.)
	// TODO review
)
export type GenericActionType = Enum<typeof GenericActionType> // eslint-disable-line no-redeclare

export interface ActionⳇReconcile<State> extends BaseAction {
	type: typeof GenericActionType.stdꓽreconcile
	state: Immutable<State>
}

export interface ActionⳇError<State> extends BaseAction {
	type: typeof GenericActionType.stdꓽerror
	error: XXError
}

// MUST be compatible with https://react.dev/reference/react/useReducer
export interface ActionReducer<State, Action extends BaseAction> {
	(state: Immutable<State>, action: Immutable<Action>): Immutable<State>
}

/////////////////////////////////////////////////

import { Enum } from "typescript-string-enums"

import { type TimestampUTCMs } from "@monorepo-private/timestamps"
import type { Immutable, PositiveInteger } from "@monorepo-private/ts--types"
import { type XXError } from "@monorepo-private/utils--error"
