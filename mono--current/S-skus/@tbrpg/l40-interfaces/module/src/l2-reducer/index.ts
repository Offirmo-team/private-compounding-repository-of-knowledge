import { type TBRSoftExecutionContext } from "@tbrpg/definitions"
import * as TBRPGState from "@tbrpg/state"
import { type State } from "@tbrpg/state"

import {
	type AllStoreFns,
	type Snapshot,
	type SyncStoreUnsubscribeFn,
	reduceꓽnoop,
	reduceꓽset,
	reduceꓽhack,
} from "@monorepo-private/sync-store"
import type { Immutable } from "@monorepo-private/ts--types"
import {
	ACTION_TYPEꘌUPDATE_TO_NOW,
	ACTION_TYPEꘌNOOP,
	ACTION_TYPEꘌSET,
	ACTION_TYPEꘌHACK,
} from "@monorepo-private/ts--types--hypermedia"

import { ActionType, type TBRPGAction } from "../l1-actions/index.ts"

/////////////////////////////////////////////////
// pure, e.g. for React.useReducer()

export function init(SXC?: TBRSoftExecutionContext, args?: TBRPGState.CreateParams): Immutable<State> {
	return TBRPGState.create(SXC, args)
}

export function reducer(state: Immutable<State>, action: Immutable<TBRPGAction>): Immutable<State> {
	const action_ts_discrimination_not_working = action as any
	switch (action.type) {
		case ActionType["play"]:
			return TBRPGState.play(state, action)
		case ActionType["equip_item"]:
			return TBRPGState.equip_item(state, action_ts_discrimination_not_working)
		case ActionType["sell_item"]:
			return TBRPGState.sell_item(state, action_ts_discrimination_not_working)
		case ActionType["rename_avatar"]:
			return TBRPGState.rename_avatar(state, action_ts_discrimination_not_working)
		case ActionType["switch_class"]:
			return TBRPGState.switch_class(state, action_ts_discrimination_not_working)
		case ActionType["redeem_code"]:
			return TBRPGState.attempt_to_redeem_code(state, action_ts_discrimination_not_working)
		case ActionType["re_seed"]:
			return TBRPGState.re_seed(state, action_ts_discrimination_not_working)
		case ActionType["on_start_session"]:
			return TBRPGState.on_start_session(state, action_ts_discrimination_not_working)
		case ActionType["on_logged_in_refresh"]:
			return TBRPGState.on_logged_in_refresh(state, action_ts_discrimination_not_working)
		case ActionType["acknowledge_engagement_msg_seen"]:
			return TBRPGState.acknowledge_engagement_msg_seen(state, action_ts_discrimination_not_working)

		case ACTION_TYPEꘌUPDATE_TO_NOW:
			return TBRPGState.update_to_now(state, action_ts_discrimination_not_working)
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
export function reducer_bulk(state: Immutable<State>, actions: Immutable<Array<TBRPGAction>>): Immutable<State> {
	return actions.reduce((state, action) => {
		return reducer(state, action)
	}, state)
}

/////////////////////////////////////////////////
// stateful, e.g.  useSyncExternalStore()

export function createꓽstore(SXC?: TBRSoftExecutionContext): AllStoreFns<State, TBRPGState.CreateParams, TBRPGAction> {
	let state: Immutable<State> = init(SXC)
	const subscribers = new Set<() => void>()

	function subscribe(onStoreChange: () => void): SyncStoreUnsubscribeFn {
		console.log("subscribe()", subscribers.size)
		subscribers.add(onStoreChange)

		return () => {
			subscribers.delete(onStoreChange)
			console.log("subscribe.clean()", subscribers.size)
		}
	}
	function getSnapshot(): Immutable<State> {
		return state
	}

	function dispatch(action: Immutable<TBRPGAction>): void {
		state = reducer(state, action)
		_notify_subscribers()
	}

	function _notify_subscribers(): void {
		console.log("notifying...", subscribers.size)
		Array.from(subscribers).forEach((onStoreChange) => onStoreChange())
	}

	/////////////////////////////////////////////////

	return {
		subscribe,
		getSnapshot,
		dispatch,
	}
}

/////////////////////////////////////////////////
