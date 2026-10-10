/////////////////////////////////////////////////

export interface WorkoutⳇSegmentⳇBase {
	type: "pause" | "exercise"
	duration‿ms: DurationMs
}
export interface WorkoutⳇSegmentⳇPause extends WorkoutⳇSegmentⳇBase {
	type: "pause"
}
export interface WorkoutⳇSegmentⳇExercise extends WorkoutⳇSegmentⳇBase {
	type: "exercise"
	exercise: Immutable<Exercise> // full-fledged for convenience
	side: Side | null // only for "unilateral" exercises
}
export type WorkoutⳇSegment = WorkoutⳇSegmentⳇPause | WorkoutⳇSegmentⳇExercise

export type WorkoutInstance = Array<WorkoutⳇSegment>

/////////////////////////////////////////////////

import type { DurationMs, Immutable } from "@monorepo-private/ts--types"

import type { Exercise, Side } from "../workout/types.ts"
