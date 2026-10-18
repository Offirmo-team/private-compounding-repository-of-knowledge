import React, { useReducer, useSyncExternalStore } from "react"

import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"

import { init, reducer, createꓽstore } from "./index.ts"

/////////////////////////////////////////////////

export default {} satisfies Meta‿v3

/////////////////////////////////////////////////

export const UseReducer: Story‿v3 = {
	component: () => {
		const [state, dispatch] = useReducer(reducer, undefined, init)
		console.log(`UseReducer:`, { state })

		return (
			<>
				<button onClick={() => dispatch({ type: "play" })}>Play</button>
				<pre>{JSON.stringify(state, null, 2)}</pre>
			</>
		)
	},
}

/////////////////////////////////////////////////

const { subscribe, getSnapshot, dispatch } = createꓽstore()

export const UseSyncExternalStore: Story‿v3 = {
	component: () => {
		const snapshot = useSyncExternalStore(subscribe, getSnapshot)
		console.log(`useSyncExternalStore:`, { snapshot })

		return (
			<>
				<button onClick={() => dispatch({ type: "play" })}>Play</button>
				<pre>{JSON.stringify(snapshot, null, 2)}</pre>
			</>
		)
	},
}
