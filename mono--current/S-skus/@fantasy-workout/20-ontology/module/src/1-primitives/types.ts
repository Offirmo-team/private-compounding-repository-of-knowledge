/////////////////////////////////////////////////

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

/*
export interface VideoLoop {
	sources: VideoSource[] // by order of preference, cf. HTML <video><source>
	poster‿url: Url‿str | undefined // still frame, displayed while loading or if the user prefers reduced motion
	side_shown: Side | null // for "unilateral" exercises: the player is expected to mirror the video for the other side
}
export interface VideoSource {
	url: Url‿str
	mime_type: string // ex. "video/webm", "video/mp4"
}
 */

/////////////////////////////////////////////////
