/////////////////////////////////////////////////

let state = StateLib.create()

const workouts_for_selection = StateLib.getꓽworkouts_for_selection(state)
console.log("Available workouts:", workouts_for_selection)

state = StateLib.selectꓽworkout(
	state,
	ALL_PREDEFINED_WORKOUTS.find(({ id }) => id === workouts_for_selection[0]!.id)!,
)

console.log("Current workout:", StateLib.getꓽcurrent_workout(state))

state = StateLib.resume(state)

setInterval(() => {
	state = StateLib.update_to_now(state)
	console.log("Current workout:", state.u_state.current_workout?.title)
	console.log("Current workout:", state.t_state.playhead_tms)
}, 1000)

/////////////////////////////////////////////////

import { ALL_PREDEFINED_WORKOUTS } from "../../data/index.ts"
import * as StateLib from "../index.ts"
