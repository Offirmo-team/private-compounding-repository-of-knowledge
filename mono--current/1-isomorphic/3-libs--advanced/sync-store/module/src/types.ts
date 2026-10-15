/**
 * Base sync store compatible with both: - React useSyncExternalStore()
 * https://react.dev/reference/react/useSyncExternalStore - React useReducer()
 * https://react.dev/reference/react/useReducer
 */

/////////////////////////////////////////////////

/* React
function useReducer<S, A extends AnyActionArg>(
	reducer: (prevState: S, ...args: A) => S,
	initialState: S,
): [S, ActionDispatch<A>];
 */
export interface SyncReducerFns<State, InitParams, Action extends ReducerAction> {
	reducer: Reducer<State, Action>
	init(args?: InitParams): Immutable<State> // slight departure from React = making the init args optional
}

/////////////////////////////////////////////////

export type Snapshot<State> = Immutable<State>

export type SyncStoreUnsubscribeFn = () => void

/* React
export function useSyncExternalStore<Snapshot>(
	subscribe: (onStoreChange: () => void) => () => void,
	getSnapshot: () => Snapshot,
	getServerSnapshot?: () => Snapshot,
): Snapshot;
 */
export interface SyncStoreFns<State, Action extends ReducerAction> {
	subscribe: (onStoreChange: () => void) => SyncStoreUnsubscribeFn
	getSnapshot: () => Snapshot<State>

	// not needed for React but needed for the above to make sense!
	dispatch(action: Immutable<Action>): void
}

/////////////////////////////////////////////////

export type AllStoreFns<State, InitParams, Action extends ReducerAction> = SyncStoreFns<State, Action> &
	SyncReducerFns<State, InitParams, Action>

/////////////////////////////////////////////////

import type { Immutable } from "@monorepo-private/ts--types"
import { type ReducerAction, type Reducer } from "@monorepo-private/ts--types--hypermedia"
