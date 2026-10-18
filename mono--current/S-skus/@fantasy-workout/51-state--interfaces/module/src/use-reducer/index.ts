/////////////////////////////////////////////////
// for useReducer() https://react.dev/reference/react/useReducer

export const sync_reducer_fns: SyncReducerFns<State, CreateParams, Action> = {
	reducer,
	init,
}

/////////////////////////////////////////////////

export function init(params?: CreateParams): Immutable<State> {
	let state = StateLib.create(params)
	state = StateLib.selectꓽworkout(state, "scientific-7-minute-workout") // pre-select for now
	return state
}

export function reducer(state: Immutable<State>, action: Immutable<Action>): Immutable<State> {
	const action_ts_discrimination_not_working = action as any
	switch (action.type) {
		case "pause":
			return StateLib.pause(state, action_ts_discrimination_not_working)
		case "resume":
			return StateLib.resume(state, action_ts_discrimination_not_working)
		case ACTION_TYPEꘌUPDATE_TO_NOW:
			return StateLib.update_to_now(state, action_ts_discrimination_not_working)
		case ACTION_TYPEꘌNOOP:
			return reduceꓽnoop(state, action_ts_discrimination_not_working)
		case ACTION_TYPEꘌSET:
			return reduceꓽset(state, action_ts_discrimination_not_working)
		case ACTION_TYPEꘌHACK:
			return reduceꓽhack(state, action_ts_discrimination_not_working)

		default:
			throw new Error(`Unknown action type "${action.type}"!`)
	}
}

// mainly for tests
export function reducer_bulk(state: Immutable<State>, actions: Immutable<Array<Action>>): Immutable<State> {
	return actions.reduce<State>((state, action) => {
		return reducer(state, action)
	}, state)
}

/////////////////////////////////////////////////

import { reduceꓽhack, reduceꓽnoop, reduceꓽset, type SyncReducerFns } from "@monorepo-private/sync-store"
import type { Immutable } from "@monorepo-private/ts--types"
import {
	ACTION_TYPEꘌHACK,
	ACTION_TYPEꘌNOOP,
	ACTION_TYPEꘌSET,
	ACTION_TYPEꘌUPDATE_TO_NOW,
} from "@monorepo-private/ts--types--hypermedia"

import type { State, CreateParams } from "../../state/index.ts"
import * as StateLib from "../../state/index.ts"
import { type Action } from "../actions.ts"
