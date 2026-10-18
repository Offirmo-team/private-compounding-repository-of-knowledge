/////////////////////////////////////////////////
// ~ track (to be instantiated)

export type ExerciseⳇId = string

export interface ExerciseⳇDetails {
	id: ExerciseⳇId

	equipment: Equipment[]
	focus: BodyFocus
	laterality: Laterality
	execution: Execution

	presentationⵧdefault: ExerciseⳇContentBundle
}

export interface Exercise {
	exercise_id: ExerciseⳇId

	duration‿ms: DurationMs // custom
	side: Side | null // only for "unilateral" exercises

	presentation?: ExerciseⳇContentBundle // optional, to replace the default one
}

// separate structure to allow swapping by trainer/language
export interface ExerciseⳇContentBundle {
	title: ContentⳇTitle

	instructions: string[] // step by step

	//video_loop: VideoLoop | undefined
}

/////////////////////////////////////////////////

import type { DurationMs, FloatInRange, Url‿str, Year } from "@monorepo-private/ts--types"
import type { ContentⳇCaption, ContentⳇTitle } from "@monorepo-private/ts--types--hypermedia"

import type { Side, Equipment, BodyFocus, Laterality, Execution } from "../1-primitives/types.ts"
