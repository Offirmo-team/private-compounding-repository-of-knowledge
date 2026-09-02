import { type TimestampUTCMs } from "@monorepo-private/timestamps"
import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

// see https://react.dev/learn/extracting-state-logic-into-a-reducer
export interface BaseReducerAction {
	now_ms?: TimestampUTCMs // do not set manually! -> better inferred at dispatch. But can be useful for tests or replay.
	expected_revisions?: {
		// prevent this action from being applied if some parts of the state (referenced by k) have been modified since the last time we checked
		// Do NOT abuse! Ideally, actions should be idempotent!!
		[k: string]: number
	}
}
export interface ReducerAction extends BaseReducerAction {
	type: string // a unique identifier of this action TODO type is too generic! should be name instead? or Id?
	// html form uses name TODO rename

	[k: string]: any // TODO better type
}

// https://react.dev/reference/react/useReducer#parameters
// must be pure
export type Reducer<State, Action = ReducerAction> = (
	previous_state: Immutable<State>,
	action: Immutable<Action>,
) => Immutable<State>
export type ReducerWithoutAction<State> = (previous_state: Immutable<State>) => Immutable<State>

export type ReducerMap<State, Action extends ReducerAction> = Record<Action["type"], Reducer<State, Action>>

/////////////////////////////////////////////////
// generic actions

// classic TState
export const ACTION_TYPEꘌUPDATE_TO_NOW: ReducerAction["type"] = "utilⵧupdate_to_now"
export interface ActionUpdateToNow extends ReducerAction {
	type: typeof ACTION_TYPEꘌUPDATE_TO_NOW
}

// do nothing
export const ACTION_TYPEꘌNOOP: ReducerAction["type"] = "utilⵧnoop"
export interface ActionNoop extends ReducerAction {
	type: typeof ACTION_TYPEꘌNOOP
}

// for ex. restoring a game from cloud or a previous save
export const ACTION_TYPEꘌSET: ReducerAction["type"] = "utilⵧset"
export interface ActionSet_<State> extends ReducerAction {
	type: typeof ACTION_TYPEꘌSET
	new_state: State
}

// for debug / hacks = ex. replenishing energy during local tests
// should never make it to the server!
export const ACTION_TYPEꘌHACK: ReducerAction["type"] = "utilⵧhack"
export interface ActionHack_<State> extends ReducerAction {
	type: typeof ACTION_TYPEꘌHACK
	custom_reducer: (state: Immutable<State>) => Immutable<State>
}

/////////////////////////////////////////////////
