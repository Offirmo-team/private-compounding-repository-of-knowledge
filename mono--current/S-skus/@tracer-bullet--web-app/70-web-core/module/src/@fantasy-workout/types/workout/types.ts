/////////////////////////////////////////////////
// ~ playlist

export type WorkoutⳇId = string

export interface Workout {
	id: WorkoutⳇId
	title: ContentⳇTitle
	caption: ContentⳇCaption

	exercises: WorkoutⳇExerciseInstance[] // in order of execution
	rest_between_exercises‿ms: DurationMs // 0 = no rest

	designers: string[]
	references: Reference[]
}

// an exercise as scheduled in a given workout ~ a playlist entry
export interface WorkoutⳇExerciseInstance {
	exercise_id: ExerciseⳇId
	duration‿ms: DurationMs // custom
	side: Side | null // only for "unilateral" exercises
}

export interface Reference {
	title: ContentⳇTitle
	authors: string[]
	publication: string
	year: Year
	url: Url‿str
}

/////////////////////////////////////////////////
// ~ track (to be instantiated)

export type ExerciseⳇId = string

export interface Exercise {
	id: ExerciseⳇId

	// TODO move all copy and associated to a separate structure to have variants by trainer/language

	title: ContentⳇTitle

	instructions: string[] // step by step
	equipment: Equipment[]
	focus: BodyFocus
	laterality: Laterality
	execution: Execution

	video_loop: VideoLoop | undefined
}

export type Equipment = "chair" | "wall" | "dumbbells"

export type BodyFocus = "total-body" | "upper-body" | "lower-body" | "core"

export type Laterality =
	| "bilateral" // ex. squat
	| "alternating" // sides alternate within the same bout, ex. lunge
	| "unilateral" // a single side per bout, the workout specifies which one, ex. side plank

export type Side = "left" | "right"

export type Execution =
	| "reps" // as many repetitions as possible in the time allotted
	| "hold" // isometric. Not recommended for people with hypertension or heart disease (Klika & Jordan 2013)

/////////////////////////////////////////////////

export interface VideoLoop {
	sources: VideoSource[] // by order of preference, cf. HTML <video><source>
	poster‿url: Url‿str | undefined // still frame, displayed while loading or if the user prefers reduced motion
	side_shown: Side | null // for "unilateral" exercises: the player is expected to mirror the video for the other side
}

export interface VideoSource {
	url: Url‿str
	mime_type: string // ex. "video/webm", "video/mp4"
}

/////////////////////////////////////////////////

import type { DurationMs, FloatInRange, Url‿str, Year } from "@monorepo-private/ts--types"
import type { ContentⳇCaption, ContentⳇTitle } from "@monorepo-private/ts--types--hypermedia"
