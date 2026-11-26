/////////////////////////////////////////////////
// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

import type { StoryEntry } from "../../../../l1-flux/l1-state/types.ts"

export default function renderꓽstoryᝍworkspace(state: ObservableState): HTMLElement {
	const root = document.createElement("div")
	root.classList.add("storypad⋄storiesᝍworkspace")

	import("./index.css")

	const current_story = state.getꓽstoryⵧcurrent()

	const iframe_elt_1 = _renderⵧstory_frame(state, current_story, Promise.resolve())
	const l1 = getꓽfirst_message_from_iframe_seen(iframe_elt_1)
	root.appendChild(iframe_elt_1)

	const iframe_elt_2 = _renderⵧstory_frame(state, current_story, l1)
	const l2 = getꓽfirst_message_from_iframe_seen(iframe_elt_2)
	root.appendChild(iframe_elt_2)

	return root
}

function _renderⵧstory_frame(
	state: ObservableState,
	storyEntry: Immutable<StoryEntry> | undefined,
	previousFrameLoaded: Promise<void>,
): HTMLIFrameElement {
	const iframe_elt = document.createElement("iframe")
	iframe_elt.classList.add(IFRAME_CLASS)
	listen_toꓽmessagesⵧfrom_iframe(iframe_elt, (message) => _onꓽmessageⵧfrom_story_frame(state, message))

	// VERY important to avoid mixing the iframes loading console logs = better dev experience
	previousFrameLoaded.then(() => {
		setTimeout(() => {
			iframe_elt.src = state.getꓽstory_frame_url(storyEntry?.uid)
		}, 25)
	})

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
import {
	type FrameMessage,
	listen_toꓽmessagesⵧfrom_iframe,
	getꓽfirst_message_from_iframe_seen,
} from "../../../l0-services/frame-messaging.ts"
import { IFRAME_CLASS } from "../consts.ts"
