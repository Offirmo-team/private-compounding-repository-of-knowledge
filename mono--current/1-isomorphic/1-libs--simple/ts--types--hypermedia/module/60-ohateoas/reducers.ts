import { type TimestampUTCMs } from "@monorepo-private/timestamps"
import type { Immutable } from "@monorepo-private/ts--types"

import {
	type ReducerAction,
	ACTION_TYPEꘌNOOP,
	type ActionNoop,
	ACTION_TYPEꘌUPDATE_TO_NOW,
	type ActionUpdateToNow,
	ACTION_TYPEꘌSET,
	type ActionSet_,
	ACTION_TYPEꘌHACK,
	type ActionHack_,
} from "./types.ts"

/////////////////////////////////////////////////

function createꓽaction__base(now_ms?: TimestampUTCMs): Omit<ReducerAction, "type"> {
	return {
		...(now_ms && { now_ms }), // only if provided
		expected_revisions: {}, // to allow easy setting
	}
}

function createꓽaction<SomeAction extends ReducerAction>(
	attributes: Omit<SomeAction, "now_ms">,
	now_ms?: TimestampUTCMs,
): SomeAction {
	return {
		...createꓽaction__base(now_ms),
		...attributes,
	} as SomeAction
}

function createꓽactionꘌnoop(): ActionNoop {
	return createꓽaction<ActionNoop>({
		type: ACTION_TYPEꘌNOOP,
	})
}

function createꓽactionꘌupdate_to_now(): ActionUpdateToNow {
	return createꓽaction<ActionUpdateToNow>({
		type: ACTION_TYPEꘌUPDATE_TO_NOW,
	})
}

function createꓽactionꘌset<State>(new_state: State): ActionSet_<State> {
	return createꓽaction<ActionSet_<State>>({
		type: ACTION_TYPEꘌSET,
		new_state,
	})
}

function createꓽactionꘌhack<State>(custom_reducer: (state: Immutable<State>) => Immutable<State>): ActionHack_<State> {
	return createꓽaction<ActionHack_<State>>({
		type: ACTION_TYPEꘌHACK,
		custom_reducer,
	})
}

/////////////////////////////////////////////////

export {
	createꓽaction__base,
	createꓽaction,
	createꓽactionꘌnoop,
	createꓽactionꘌupdate_to_now,
	createꓽactionꘌset,
	createꓽactionꘌhack,
}
