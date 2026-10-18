/////////////////////////////////////////////////

export interface ActionPause extends BaseReducerAction {
	type: "pause"
}
export interface ActionResume extends BaseReducerAction {
	type: "resume"
}

export type ActionSet = ActionSet_<State>
export type ActionHack = ActionHack_<State>

export type Action = ActionPause | ActionResume | ActionUpdateToNow | ActionNoop | ActionSet | ActionHack

/////////////////////////////////////////////////

import type { State, CreateParams } from "@fantasy-workout/state"

import type {
	ActionHack_,
	ActionNoop,
	ActionSet_,
	ActionUpdateToNow,
	BaseReducerAction,
} from "@monorepo-private/ts--types--hypermedia"
