/////////////////////////////////////////////////
// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

export default function renderꓽfooter(state: ObservableState): HTMLElement {
	const root = document.createElement("div")
	root.classList.add("storypad⋄ui-element", "storypad⋄story-area⋄footer")

	import("./index.css")

	const pills = state.getꓽpills()
	root.innerHTML = Object.keys(pills)
		.sort()
		.reduce((acc, pill_key) => {
			const v = pills[pill_key]
			acc.push(`${pill_key}=${v}`)
			return acc
		}, [] as Html‿str[])
		.join(" ")

	state.emitter.on("change", (event) => {
		const pills = state.getꓽpills()
		console.log("rerendering footer", pills)
		root.innerHTML = Object.keys(pills)
			.sort()
			.reduce((acc, pill_key) => {
				const v = pills[pill_key]
				acc.push(`${pill_key}=${v}`)
				return acc
			}, [] as Html‿str[])
			.join(" ")
	})

	return root
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import type { Html‿str } from "@monorepo-private/ts--types--hypermedia"

import { ObservableState } from "../../../../l1-flux/l2-observable/index.ts"
