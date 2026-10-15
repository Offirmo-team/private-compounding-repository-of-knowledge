/////////////////////////////////////////////////
// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

export default function renderꓽheader(state: ObservableState): HTMLElement {
	const root = document.createElement("header")
	root.classList.add("storypad⋄ui-element", "storypad⋄story-area⋄header")

	//import("./index.css")

	root.appendChild(renderꓽtitlebar(state))
	root.appendChild(renderꓽtoolbar(state))

	return root
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import type { Html‿str } from "@monorepo-private/ts--types--hypermedia"

import { ObservableState } from "../../../../l1-flux/l2-observable/index.ts"

import renderꓽtitlebar from "./title-bar"
import renderꓽtoolbar from "./toolbar"
