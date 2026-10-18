/////////////////////////////////////////////////

let state = StateLib.create()

const workouts_for_selection = StateLib.getꓽworkouts_for_selection(state)
console.log("Available workouts:", workouts_for_selection)

state = StateLib.selectꓽworkout(state, workouts_for_selection[0]!.id)

console.log("Current workout:", StateLib.getꓽcurrent_workout(state))
const sequence = StateLib.getꓽcurrent_workout__sequence(state)
console.log(
	"Current workout:",
	sequence.map((s) => {
		switch (s.type) {
			case "pause": {
				return `pause (${s.duration‿ms / 1000}s)`
			}
			case "exercise": {
				return `exercise "${s.exercise.title}"${s.side ? `/${s.side}` : ""} (${s.duration‿ms / 1000}s)`
			}
			default:
				assertⵧnever_reached(`unknown segment: ${JSON.stringify(s satisfies never)}`)
		}
	}),
)

state = StateLib.resume(state)

setInterval(() => {
	state = StateLib.update_to_now(state)
	console.log("Current workout:", state.u_state.current_workout?.title)
	console.log("Current workout:", state.t_state.playhead‿ms)
}, 1000)

/////////////////////////////////////////////////

import { assertⵧnever_reached } from "@monorepo-private/assert"

import * as StateLib from "../index.ts"
