/////////////////////////////////////////////////

// goal of selecting one.
// returned in recommended order
export function getꓽworkouts_for_selection(_state: Immutable<State>): Array<{
	id: WorkoutⳇId
	title: ContentⳇTitle
	caption: ContentⳇCaption
	exercise_count: PositiveInteger
}> {
	// 1D generate dynamic ones
	// 1D suggest a not recent one for variety
	return ALL_PREDEFINED_WORKOUTS.map((w) => {
		const { id, title, caption, exercises } = w
		return {
			id,
			title,
			caption,
			exercise_count: exercises.length,
		}
	})
}

export function getꓽcurrent_workout__sequence(state: Immutable<State>): WorkoutInstance {
	const ǃ = assert_from({ getꓽcurrent_workout__sequence })

	const workout = getꓽcurrent_workout(state)

	// TODO 1D possibly randomise, extend etc.
	const result = workout.exercises.reduce((acc, exercise_ref, currentIndex) => {
		if (currentIndex !== 0) {
			acc.push({
				type: "pause",
				duration‿ms: workout.rest_between_exercises‿ms,
			} satisfies WorkoutⳇSegmentⳇPause)
		}

		acc.push({
			type: "exercise",
			duration‿ms: exercise_ref.duration‿ms,
			exercise: getꓽexercise(exercise_ref.exercise_id),
			side: exercise_ref.side,
		} satisfies WorkoutⳇSegmentⳇExercise)

		return acc
	}, [] as Array<WorkoutⳇSegment>)

	return result
}

export function getꓽcurrent_workout(state: Immutable<State>): Immutable<Workout> {
	const ǃ = assert_from({ getꓽcurrent_workout })

	ǃ.require(state.u_state.current_workout, "Expecting a workout to be in progress")
	assert(state.u_state.current_workout)

	return state.u_state.current_workout
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, PositiveInteger } from "@monorepo-private/ts--types"
import type { ContentⳇCaption, ContentⳇTitle } from "@monorepo-private/ts--types--hypermedia"

import { ALL_PREDEFINED_WORKOUTS, getꓽexercise } from "../../data/index.ts"
import type {
	Workout,
	WorkoutInstance,
	WorkoutⳇId,
	WorkoutⳇSegment,
	WorkoutⳇSegmentⳇExercise,
	WorkoutⳇSegmentⳇPause,
} from "../../types/index.ts"
import type { State } from "../types.ts"
