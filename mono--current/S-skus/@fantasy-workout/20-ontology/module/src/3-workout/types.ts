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

export interface WorkoutⳇAsPlaylist {
	presentation: WorkoutⳇContentBundle

	segments: WorkoutⳇSegment[] // in order of execution

	// should not be needed
	_id: WorkoutⳇId
}

export interface WorkoutⳇSegmentⳇBase {
	type: string
	duration‿ms: DurationMs
}
export interface WorkoutⳇSegmentⳇPause extends WorkoutⳇSegmentⳇBase {
	type: "pause"
}
export interface WorkoutⳇSegmentⳇExercise extends ExerciseⳇAsTrack, WorkoutⳇSegmentⳇBase {
	type: "exercise"
}
export type WorkoutⳇSegment = WorkoutⳇSegmentⳇPause | WorkoutⳇSegmentⳇExercise

/////////////////////////////////////////////////

import type { DurationMs, Url‿str, Year } from "@monorepo-private/ts--types"
import type { ContentⳇCaption, ContentⳇTitle } from "@monorepo-private/ts--types--hypermedia"

import type { Exercise, ExerciseⳇAsTrack } from "../2-exercise/types.ts"
