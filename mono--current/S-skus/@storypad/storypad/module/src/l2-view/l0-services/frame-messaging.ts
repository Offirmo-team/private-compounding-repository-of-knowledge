/////////////////////////////////////////////////
// story iframe → parent frame messaging
// Storypad frames are same-origin, so instead of postMessage() we dispatch DOM events
// directly on the parent's <iframe> element: the listener lives and dies with the element.

export type FrameMessage = {
	type: "addꓽannotation"
	payload: {
		key: string
		value: JsonⳇPrimitive
	}
}

const EVENT_NAME = "storypad:frame-message"

// to be called from inside the iframe
export function sendꓽmessageⵧto_parent_frameⵧif_any(message: FrameMessage): void {
	const host_iframe_elt = window.frameElement // null if not framed or cross-origin
	if (!host_iframe_elt) {
		DEBUG && console.log(`[${LIB}] Not in a same-origin iframe, dropping message.`, message)
		return
	}

	host_iframe_elt.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: message }))
}

// to be called from the parent frame
export function listenꓽmessagesⵧfrom_iframe(
	iframe_elt: HTMLIFrameElement,
	on_message: (message: Immutable<FrameMessage>) => void,
): void {
	iframe_elt.addEventListener(EVENT_NAME, (event) => {
		// NOT `instanceof CustomEvent`: the event was created in the iframe's realm
		const message = "detail" in event ? event.detail : undefined
		if (!isꓽFrameMessage(message)) {
			console.error(`[${LIB}] Unexpected malformed frame message!`, { event })
			return
		}

		on_message(message)
	})
}

function isꓽFrameMessage(x: unknown): x is FrameMessage {
	return typeof (x as any)?.type === "string"
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, JsonⳇPrimitive } from "@monorepo-private/ts--types"

import { DEBUG, LIB } from "../../consts.ts"
