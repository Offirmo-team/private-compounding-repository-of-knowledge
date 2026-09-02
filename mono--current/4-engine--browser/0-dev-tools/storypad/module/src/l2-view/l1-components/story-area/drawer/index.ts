// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import type { Html‿str } from "@monorepo-private/ts--types--hypermedia"

import { ObservableState } from "../../../../l1-flux/l2-observable"

/////////////////////////////////////////////////

function renderꓽdrawer(state: ObservableState): HTMLElement {
	const root = document.createElement("div")
	root.classList.add("storypad⋄ui-element", "storypad⋄drawer")

	import("./index.css")

	// XXX pills are set by the renderer, in the iframe 😅
	// we need to pass them around for this to work!!
	const pills = state.getꓽpills()
	root.innerHTML =
		Object.keys(pills)
			.sort()
			.reduce((acc, pill_key) => {
				const v = pills[pill_key]
				acc.push(`${pill_key}=${v}`)
				return acc
			}, [] as Html‿str[])
			.join(" ") || "TODO drawer…"

	return root
}

/////////////////////////////////////////////////

export default renderꓽdrawer
