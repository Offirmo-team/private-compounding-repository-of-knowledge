import * as icepick from "icepick"

import { assert_from, assert } from "@monorepo-private/assert"
import { type TimestampUTCMs, getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"
import type { Immutable, Mutable, ImmutabilityEnforcer } from "@monorepo-private/ts--types"

import { getꓽrevision, getꓽrevisionⵧloose } from "./selectors.ts"
import { isꓽRootState, isꓽTState, isꓽUState, isꓽUTBundle, isꓽWithRevision } from "./type-guards.ts"
import type { AnyBaseState, AnyRootState } from "./types--internal.ts"
import type { BaseUState, BaseTState, BaseRootState, UTBundle, BaseAction, ActionⳇReconcile } from "./types.ts"
import { GenericActionType } from "./types.ts"

/////////////////////////////////////////////////

// TODO dynamic switch, ex. for dev/prod
// TODO evaluate https://github.com/unadlib/mutative
const enforceꓽimmutable: ImmutabilityEnforcer = <T>(state: T | Immutable<T>): Immutable<T> =>
	icepick.freeze<T>(state as T) as Immutable<T>
//const enforceꓽimmutable: ImmutabilityEnforcer = (state: T): Immutable<T> => state
//const enforceꓽimmutable: ImmutabilityEnforcer = <T>(state: T): Immutable<T> => deep_freeze<T>(state)

function getꓽmutable_copy<T>(state: T): Mutable<T> {
	return icepick.thaw<Mutable<T>>(state as any)
}
function cast_toꓽimmutable<T>(state: T): Immutable<T> {
	return state as Immutable<T>
}

// Use this in case you reduced a child state (optionally updating the timestamp as well) but are unsure whether this reducer caused the child state to change or not.
// - the best case is to return 'previous' = no mutation
// - if a child state's revision increased, increase ours and keep the mutation
// - it's possible that an "update to now" was invoked, it's ok to ignore that if that's the only change
// - this fn will intentionally NOT go deeper than 1st level, each state is responsible for its children!
// - this fn will intentionally NOT handle time changes, this should be done separately at the end! (separate update_to_now call)
function complete_or_cancel_eager_mutation_propagating_possible_child_mutation<
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState<BU, BT>,
	T = BU | BT | UTBundle<BU, BT> | BR,
>(
	previous: Immutable<T>, // initial state, usually the one we got as a param in the reducer calling this
	current: Immutable<T>, // initial state + only child mutations that we're not sure are actual changes
	updated: Immutable<T> = previous, // initial state + "updated_to_now" which can === initial state (if no time elapsed)
	debug_id: string = "unknown src",
	recursive: boolean = false,
): Immutable<T> {
	const PREFIX = `CoCEMPPCM(${debug_id})`

	assert(!!previous, `${PREFIX}: should have previous`)
	assert(!!current, `${PREFIX}: should have current`)
	if (!recursive)
		assert(current !== previous, `${PREFIX}: why are you calling this if you didn't perform any mutation?`)
	if (current === updated) {
		return previous // "updated"
	}

	if (isꓽUTBundle(current)) {
		// this is a more advanced state
		assert(isꓽUTBundle(previous), `${PREFIX}: previous also has bundle data structure!`)
		assert(isꓽUTBundle(updated), `${PREFIX}: updated also has bundle data structure!`)
		const final_u_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
			previous[0],
			current[0],
			updated?.[0],
			debug_id + "/B.u_state",
			true,
		)
		const final_t_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
			previous[1],
			current[1],
			updated?.[1],
			debug_id + "/B.t_state",
			true,
		)
		if (final_u_state === previous[0] && final_t_state === previous[1]) return previous
		if (final_u_state === updated[0] && final_t_state === updated[1]) return previous

		return enforceꓽimmutable<T>([final_u_state, final_t_state] as any as T)
	} else if (isꓽRootState(current)) {
		// this is a more advanced state
		assert(isꓽRootState(previous), `${PREFIX}: previous also has root data structure!`)
		assert(isꓽRootState(updated), `${PREFIX}: updated also has root data structure!`)
		const final_u_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
			previous.u_state,
			current.u_state,
			updated.u_state,
			debug_id + "/R.u_state",
			true,
		)
		const final_t_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
			previous.t_state,
			current.t_state,
			updated.t_state,
			debug_id + "/R.t_state",
			true,
		)
		if (final_u_state === previous.u_state && final_t_state === previous.t_state) return previous
		if (final_u_state === updated.u_state && final_t_state === updated.t_state) return previous

		return enforceꓽimmutable<T>({
			...(current as any),
			u_state: final_u_state,
			t_state: final_t_state,
		})
	}

	//let is_t_state = isꓽTState(current)
	assert(isꓽUState(current) || isꓽTState(current), `${PREFIX}: current has U/TState data structure!`) // unneeded except for helping TS type inference
	assert(
		(isꓽUState(previous) && isꓽUState(updated) && isꓽUState(current)) ||
			(isꓽTState(previous) && isꓽTState(updated) && isꓽTState(current)),
		`${PREFIX}: current+previous+updated have the same U/TState data structure!`,
	)
	assert(previous.revision === updated.revision, `${PREFIX}: previous & updated should have the same revision`)
	assert(current.revision >= previous.revision, `${PREFIX}: current >= previous revision`)

	if (current.revision !== previous.revision)
		throw new Error(
			`${PREFIX}: revision already incremented! This call is not needed since you’re sure there was a change!`,
		)

	const typed_previous: AnyBaseState = previous as any
	const typed_updated: AnyBaseState = updated as any
	const typed_current: AnyBaseState = current as any

	let has_child_revision_increment = false
	//let has_non_child_key_change = false
	//let has_timestamp_change: boolean | undefined = undefined

	for (const k in typed_current) {
		const previous_has_revision = isꓽWithRevision(typed_updated[k])
		const current_has_revision = isꓽWithRevision(typed_current[k])
		assert(previous_has_revision === current_has_revision, `${PREFIX}/${k}: revisioning should be coherent!`)
		if (!current_has_revision) {
			//let has_change = typed_updated[k] !== typed_current[k]
			//has_non_child_key_change ||= has_change
			assert(
				typed_updated[k] === typed_current[k],
				`${PREFIX}/${k}: manual change on Base/UState non-child key seen! This call is not needed since you’re sure there was a change!`,
			)
		}

		const previous_revision = getꓽrevisionⵧloose(typed_previous[k])
		const updated_revision = getꓽrevisionⵧloose(typed_updated[k])
		assert(
			previous_revision === updated_revision,
			`${PREFIX}/${k}: previous & updated child should have the same revision`,
		)

		const current_revision = getꓽrevisionⵧloose(typed_current[k])
		if (current_revision !== updated_revision) {
			if (current_revision !== updated_revision + 1) {
				// NO! It may be normal for a sub to have been stimulated more than once,
				// ex. gained 3 achievements
				//throw new Error(...)
			}

			has_child_revision_increment = true
			break
		}
	}

	if (!has_child_revision_increment) return previous

	return enforceꓽimmutable<T>({
		...(current as any),
		revision: getꓽrevision(current as any) + 1,
	})
}

// check if the state is still in the revision we expect
// ex. for an action, check it's still valid, ex. object already sold?
function are_ustate_revision_requirements_met<S extends BaseRootState>(
	state: Immutable<S>,
	requirements: { [k: string]: number } = {},
): boolean {
	for (const k in requirements) {
		assert((state as AnyRootState).u_state[k], `are_ustate_revision_requirements_met(): sub state not found: "${k}"!`)
		const current_revision = ((state as AnyRootState).u_state[k]! as any).revision
		assert(
			Number.isInteger(current_revision),
			`are_ustate_revision_requirements_met(): sub state has no/invalid revision: "${k}"!`,
		)
		if (current_revision !== requirements[k]) return false
	}
	return true
}

// ???
/*
export function finalize_action_if_needed<State, Action extends BaseAction>(action: Immutable<Action>, state?: Immutable<State>): Immutable<Action> {
	if (action.time <= 0) {
		action = {
			...action,
			time: getꓽUTC_timestamp‿ms(),
		}
	}

	const has_some_blank_expected_revisions = Object.keys(action.expected_revisions).some(sub_state_key => action.expected_revisions[sub_state_key] === -1)
	if (has_some_blank_expected_revisions) {
		assert(state, `finalize_action_if_needed(): current state should be provided to finalize some expected revisions`)
		action = {
			...action,
			expected_revisions: Object.keys(action.expected_revisions).reduce((acc, val) => {
				const sub_state_key = val
				const sub_state = (state as any)[sub_state_key] || (state as any).u_state[sub_state_key]
				assert(sub_state, `finalize_action_if_needed(): state should have a sub-state "${sub_state}"`)
				const current_sub_state_revision: number = sub_state.revision
				assert(current_sub_state_revision, `sub-state "${sub_state}" should have a revision`)

				if (action.expected_revisions[sub_state_key] === -1) {
					acc[sub_state_key] = current_sub_state_revision
				}

				return acc
			}, {} as BaseAction['expected_revisions'])
		}
	}

	return action
}
*/

function createꓽBaseAction(type: string, time: TimestampUTCMs = getꓽUTC_timestamp‿ms()): BaseAction {
	return {
		type,
		time,
		expected_revisions: {},
	}
}

function createꓽaction<SomeAction extends BaseAction>(
	{
		type,
		...attributes
	}: Omit<SomeAction, "time" | "expected_revisions"> & { expected_revisions?: SomeAction["expected_revisions"] },
	time: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): SomeAction {
	return {
		...createꓽBaseAction(type, time),
		...attributes,
	} as SomeAction
}

function createꓽActionⳇReconcile<State>(
	state: Immutable<State>,
	time: TimestampUTCMs = getꓽUTC_timestamp‿ms(),
): ActionⳇReconcile<State> {
	return createꓽaction<ActionⳇReconcile<State>>(
		{
			type: GenericActionType.stdꓽreconcile,
			state,
		},
		time,
	)
}

/////////////////////////////////////////////////

export {
	enforceꓽimmutable,
	getꓽmutable_copy,
	cast_toꓽimmutable,
	complete_or_cancel_eager_mutation_propagating_possible_child_mutation,
	are_ustate_revision_requirements_met,
	createꓽBaseAction,
	createꓽaction,
	createꓽActionⳇReconcile,
}

// for convenience
export { type Immutable, type ImmutabilityEnforcer } from "@monorepo-private/ts--types"
