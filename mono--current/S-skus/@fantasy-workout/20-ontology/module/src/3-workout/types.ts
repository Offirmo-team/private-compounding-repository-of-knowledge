/////////////////////////////////////////////////
// ~ playlist

export type WorkoutⳇId = string

export interface Workout {
	id: WorkoutⳇId

	exercises: Exercise[] // in order of execution
	rest_between_exercises‿ms: DurationMs // 0 = no rest

	presentationⵧdefault: WorkoutⳇContentBundle

	designers: string[]
	references: Reference[]
}

// separate structure to allow i18n
export interface WorkoutⳇContentBundle {
	title: ContentⳇTitle
	caption: ContentⳇCaption
}

// TODO improve and extract ~credit like
export interface Reference {
	title: ContentⳇTitle
	authors: string[]
	publication: string
	year: Year
	url: Url‿str
}

/////////////////////////////////////////////////

/////////////////////////////////////////////////

import type { DurationMs, FloatInRange, Url‿str, Year } from "@monorepo-private/ts--types"
import type { ContentⳇCaption, ContentⳇTitle } from "@monorepo-private/ts--types--hypermedia"

import type { Exercise, ExerciseⳇContentBundle } from "../2-exercise/types.ts"
