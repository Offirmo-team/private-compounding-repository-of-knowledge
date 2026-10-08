/////////////////////////////////////////////////

// goal of selecting one.
// Order of recommended
import type { TimestampUTCMs } from "@monorepo-private/timestamps"

export function getꓽworkouts_for_selection(_state: Immutable<State>): Array<{
	id: WorkoutⳇId
	title: ContentⳇTitle
	caption: ContentⳇCaption
	exercise_count: PositiveInteger
}> {
	// 1D generate dynamic ones
	// 1D suggest a not recent one for variety
	return ALL_PREDEFINED_WORKOUTS.map((w: Workout) => {
		const { id, title, caption, exercises } = w
		return {
			id,
			title,
			caption,
			exercise_count: exercises.length,
		}
	})
}

export function getꓽcurrent_workout(state: Immutable<State>): Immutable<Workout> {
	const ǃ = assert_from({ getꓽcurrent_workout })

	ǃ.require(state.u_state.current_workout, "Expecting a workout to be in progress")
	assert(state.u_state.current_workout)

	return state.u_state.current_workout
}

export function getꓽcurrent_workout__sequence(
	state: Immutable<State>,
): Array<Immutable<WorkoutⳇExercise> | WorkoutⳇPause> {
	const ǃ = assert_from({ getꓽcurrent_workout__sequence })

	const workout = getꓽcurrent_workout(state)

	const result = workout.exercises.reduce(
		(acc, exercise, currentIndex) => {
			if (currentIndex !== 0) {
				acc.push({
					duration‿ms: workout.rest_between_exercises‿ms,
				} satisfies WorkoutⳇPause)
			}
			acc.push(exercise)

			return acc
		},
		[] as Array<WorkoutⳇExercise | WorkoutⳇPause>,
	)

	return result
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, PositiveInteger } from "@monorepo-private/ts--types"
import type { ContentⳇCaption, ContentⳇTitle } from "@monorepo-private/ts--types--hypermedia"

import { ALL_PREDEFINED_WORKOUTS } from "../../data/index.ts"
import type { Workout, WorkoutⳇExercise, WorkoutⳇId, WorkoutⳇPause } from "../../types/types.ts"
import type { State } from "../types.ts"
