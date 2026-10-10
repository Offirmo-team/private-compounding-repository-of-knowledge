/////////////////////////////////////////////////

export function getꓽworkout(id: WorkoutⳇId): Immutable<Workout> {
	const workout = ALL_PREDEFINED_WORKOUTS.find((w) => w.id === id)
	assert(workout, `unknown workout "${id}"`)

	return workout
}

export const ALL_PREDEFINED_WORKOUTS: Immutable<Array<Workout>> = enforceꓽimmutable([
	{
		id: "scientific-7-minute-workout",
		title: "7-Minute Workout",
		caption:
			"A high-intensity circuit using only your body weight, a chair and a wall. Maximum results, minimal time.",

		// order matters: alternates muscle groups so that they can recover
		exercises: [
			{ exercise_id: ALL_EXERCISES‿by_id["jumping-jacks"].id, duration‿ms: 30_000, side: null },
			{ exercise_id: ALL_EXERCISES‿by_id["wall-sit"].id, duration‿ms: 30_000, side: null },
			{ exercise_id: ALL_EXERCISES‿by_id["push-up"].id, duration‿ms: 30_000, side: null },
			{ exercise_id: ALL_EXERCISES‿by_id["abdominal-crunch"].id, duration‿ms: 30_000, side: null },
			{ exercise_id: ALL_EXERCISES‿by_id["step-up-onto-chair"].id, duration‿ms: 30_000, side: null }, // alternating
			{ exercise_id: ALL_EXERCISES‿by_id["squat"].id, duration‿ms: 30_000, side: null },
			{ exercise_id: ALL_EXERCISES‿by_id["triceps-dip-on-chair"].id, duration‿ms: 30_000, side: null },
			{ exercise_id: ALL_EXERCISES‿by_id["plank"].id, duration‿ms: 30_000, side: null },
			{ exercise_id: ALL_EXERCISES‿by_id["high-knees-running-in-place"].id, duration‿ms: 30_000, side: null }, // alternating
			{ exercise_id: ALL_EXERCISES‿by_id["lunge"].id, duration‿ms: 30_000, side: null }, // alternating
			{ exercise_id: ALL_EXERCISES‿by_id["push-up-and-rotation"].id, duration‿ms: 30_000, side: null }, // alternating
			// the sources don't specify how to handle sides. We chose a full 30s per side (vs. 15s/15s in a single station)
			// for a meaningful hold, at the cost of a 13th station. cf. ./high-intensity-circuit-training-using-body-weight-maximum/comments.md
			{ exercise_id: ALL_EXERCISES‿by_id["side-plank"].id, duration‿ms: 30_000, side: "left" },
			{ exercise_id: ALL_EXERCISES‿by_id["side-plank"].id, duration‿ms: 30_000, side: "right" },
		],
		rest_between_exercises‿ms: 10_000,

		designers: ["Brett Klika", "Chris Jordan"],
		references: [
			{
				title: "High-Intensity Circuit Training Using Body Weight: Maximum Results With Minimal Investment",
				authors: ["Brett Klika", "Chris Jordan"],
				publication: "ACSM's Health & Fitness Journal",
				year: 2013,
				url: "https://doi.org/10.1249/FIT.0b013e31828cb1e8",
			},
			{
				title: "The Scientific 7-Minute Workout",
				authors: ["Gretchen Reynolds"],
				publication: "The New York Times",
				year: 2013,
				url: "https://archive.nytimes.com/well.blogs.nytimes.com/2013/05/09/the-scientific-7-minute-workout/",
			},
		],
	},

	{
		id: "advanced-7-minute-workout",
		title: "Advanced 7-Minute Workout",
		caption: "A harder take on the 7-Minute Workout: compound moves, with a pair of dumbbells.",

		exercises: [
			{
				exercise_id: ALL_EXERCISES‿by_id["reverse-lunge-elbow-to-instep-with-rotation"].id,
				duration‿ms: 30_000,
				side: null,
			},
			{ exercise_id: ALL_EXERCISES‿by_id["lateral-pillar-bridge"].id, duration‿ms: 30_000, side: "left" },
			{ exercise_id: ALL_EXERCISES‿by_id["push-up-to-row-to-burpee"].id, duration‿ms: 60_000, side: null },
			{ exercise_id: ALL_EXERCISES‿by_id["lateral-pillar-bridge"].id, duration‿ms: 30_000, side: "right" },
			{
				exercise_id: ALL_EXERCISES‿by_id["single-leg-romanian-dead-lift-to-curl-to-press"].id,
				duration‿ms: 60_000,
				side: "left",
			},
			{
				exercise_id: ALL_EXERCISES‿by_id["single-leg-romanian-dead-lift-to-curl-to-press"].id,
				duration‿ms: 60_000,
				side: "right",
			},
			{ exercise_id: ALL_EXERCISES‿by_id["plank-with-arm-lift"].id, duration‿ms: 30_000, side: null },
			{
				exercise_id: ALL_EXERCISES‿by_id["lateral-lunge-to-overhead-triceps-extension"].id,
				duration‿ms: 60_000,
				side: null,
			},
			{ exercise_id: ALL_EXERCISES‿by_id["bent-over-row"].id, duration‿ms: 60_000, side: null },
		],
		// not specified by the source, use same as the other original 7-minutes workout
		rest_between_exercises‿ms: 10_000,

		designers: ["Mark Verstegen"],
		references: [
			{
				title: "The Advanced 7-Minute Workout",
				authors: ["Gretchen Reynolds"],
				publication: "The New York Times",
				year: 2014,
				url: "https://archive.nytimes.com/well.blogs.nytimes.com/2014/10/24/the-advanced-7-minute-workout/",
			},
		],
	},
])

/////////////////////////////////////////////////

import { assert } from "@monorepo-private/assert"
import { enforceꓽimmutable } from "@monorepo-private/offirmo-state"
import type { Immutable } from "@monorepo-private/ts--types"

import type { Workout, WorkoutⳇId } from "../types/index.ts"

import { ALL_EXERCISES‿by_id } from "./exercises.ts"
