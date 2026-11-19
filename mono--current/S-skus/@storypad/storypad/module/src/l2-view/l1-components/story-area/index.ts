/////////////////////////////////////////////////
// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

export default renderꓽstoryᝍarea

export function renderꓽstoryᝍarea(state: ObservableState): HTMLElement {
	const root = document.createElement("div")
	root.classList.add("storypad⋄story-area")

	import("./index.css")

	root.appendChild(renderꓽheader(state))

	root.appendChild(renderꓽstoryᝍworkspace(state))

	root.appendChild(renderꓽfooter(state))

	return root
}
/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"

import type { ObservableState } from "../../../l1-flux/l2-observable"

import renderꓽfooter from "./footer"
import renderꓽheader from "./header"
import renderꓽstoryᝍworkspace from "./story-workspace"
