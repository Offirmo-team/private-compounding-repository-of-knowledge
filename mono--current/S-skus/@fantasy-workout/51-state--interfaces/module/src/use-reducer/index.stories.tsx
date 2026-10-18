import React, { useReducer, useSyncExternalStore, useEffect } from "react"

import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"

import { init, reducer } from "./index.ts"

/////////////////////////////////////////////////

export default {} satisfies Meta‿v3

/////////////////////////////////////////////////

export const UseReducer: Story‿v3 = {
	component: () => {
		const [state, dispatch] = useReducer(reducer, undefined, init)
		console.log(`UseReducer:`, { state })

		useEffect(() => {
			const interval = setInterval(() => {
				dispatch({ type: "utilⵧupdate_to_now" })
			}, 100)

			return () => clearInterval(interval)
		}, [])

		return (
			<>
				<button onClick={() => dispatch({ type: state.u_state.status === "paused" ? "resume" : "pause" })}>
					{state.u_state.status === "paused" ? "resume" : "pause"}
				</button>
				<pre>{JSON.stringify(state.t_state, null, 2)}</pre>
			</>
		)
	},
}

/////////////////////////////////////////////////
