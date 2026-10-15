/////////////////////////////////////////////////
// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

export default function renderꓽstoryᝍworkspace(state: ObservableState): HTMLElement {
	const root = document.createElement("div")
	root.classList.add("storypad⋄storiesᝍworkspace")

	import("./index.css")

	const current_story = state.getꓽstoryⵧcurrent()

	const iframe_elt = _renderⵧstory_frame(state, current_story)
	root.appendChild(iframe_elt)

	return root
}

function _renderⵧstory_frame(state: ObservableState, storyEntry = state.getꓽstoryⵧcurrent()): HTMLIFrameElement {
	const iframe_elt = document.createElement("iframe")
	iframe_elt.src = state.getꓽstory_frame_url(storyEntry?.uid)
	iframe_elt.classList.add(IFRAME_CLASS)
	listenꓽmessagesⵧfrom_iframe(iframe_elt, (message) => _onꓽmessageⵧfrom_story_frame(state, message))
	return iframe_elt
}

function _onꓽmessageⵧfrom_story_frame(state: ObservableState, message: Immutable<FrameMessage>): void {
	switch (message.type) {
		case "addꓽannotation": {
			const { key, value } = message.payload
			state.addꓽannotation(key, value)
			break
		}
		default:
			console.warn(`[${LIB}] Unrecognized message from story frame:`, message)
			break
	}
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import type { Html‿str } from "@monorepo-private/ts--types--hypermedia"

import { LIB } from "../../../../consts.ts"
import { ObservableState } from "../../../../l1-flux/l2-observable/index.ts"
import { type FrameMessage, listenꓽmessagesⵧfrom_iframe } from "../../../l0-services/frame-messaging.ts"
import { IFRAME_CLASS } from "../consts.ts"
