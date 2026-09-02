// https://github.com/sindresorhus/emittery#isdebugenabled
import React, { useSyncExternalStore } from "react"

import { RichText } from "@monorepo-private/rich-text-format--to-react"
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"
import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"
import { createꓽstore } from "@tbrpg/interfaces"
import type { State } from "@tbrpg/state"

import { renderꓽachievements_snapshot } from "./achievements.ts"
import { renderꓽresolved_adventure } from "./adventure.ts"
import { renderꓽcharacter_sheet } from "./attributes.ts"
import { getꓽrecap } from "./engagement/index.ts"
import { renderꓽfull_inventory } from "./inventory.ts"
import { renderꓽgame_info } from "./meta.ts"
import { renderꓽstatus } from "./misc.ts"

/////////////////////////////////////////////////

// best practices: https://docs.google.com/document/d/1rtU1fRPS0bMqd9abMG_hc6K9OAI6soUy3Kh00toAgyk/edit?tab=t.0#heading=h.4q0qotmeoypu
type ToolDefinition = {
	name: string
	description: string
	inputSchema: any
	execute: () => string | Promise<string>
	annotations: {
		readOnlyHint?: boolean

		// true if the tool processes data from external or unverified sources
		// to indicate that the tool's output contains data that is untrusted,
		// from the perspective of the author registering the tool.
		// https://docs.google.com/document/d/1rtU1fRPS0bMqd9abMG_hc6K9OAI6soUy3Kh00toAgyk/edit?tab=t.0#heading=h.bwgz9q7okxp7
		untrustedContentHint?: boolean
	}
}

/////////////////////////////////////////////////
const { subscribe, getSnapshot, dispatch } = createꓽstore()

window.addEventListener("toolactivated", ({ toolName }) => {
	console.log(`the tool "${toolName}" execution was activated.`)
	// TODO: Update UI or validate form if needed.
	const $result = renderꓽstatus(getSnapshot())
	console.log("toolactivated", renderⵧto_text($result).trim())
})

window.addEventListener("toolcancel", ({ toolName }) => {
	console.log(`the tool "${toolName}" execution was cancelled.`)
	// TODO: Let the user know. Update UI.
})

window.addEventListener("message", (event) => {
	if (event.data?.source === "page") return
	// TODO security

	console.log("page: Got message", event)
	const $result = renderꓽstatus(getSnapshot())
	console.log("page listener", renderⵧto_text($result).trim())

	if (event.data.source === "webmcp" && event.data.request_id) {
		if (event.data?.type === "dispatch") {
			dispatch(event.data.action)
		}

		event.source?.postMessage({ source: "page", request_id: event.data.request_id, type: "result", state: getSnapshot() })
	}
})

const controller = new AbortController()

const toolꓽstatus: ToolDefinition = {
	name: "tbrpg__status",
	description: "Get a quick overall status of the TBRPG game state",
	inputSchema: {},
	execute: async (...args) => {
		console.log("tool:status", args)
		console.log("tool:status", renderⵧto_text(renderꓽstatus(getSnapshot())).trim())

		const request_id = crypto.randomUUID()
		const { promise, resolve, reject } = Promise.withResolvers<State>()

		function listener(event) {
			if (event.data?.source === "webmcp") return
			if (event.data?.request_id !== request_id) return

			console.log("execute: Got message:", event.data)
			resolve(event.data.state)
		}
		window.addEventListener("message", listener)

		window.postMessage({ source: "webmcp", request_id, type: "status" })

		const state = await promise
		window.removeEventListener("message", listener)
		const $result = renderꓽstatus(state)
		return renderⵧto_text($result).trim()
	},
	annotations: { readOnlyHint: true, untrustedContentHint: false },
}
navigator.modelContext.registerTool(toolꓽstatus, { signal: controller.signal })

const toolꓽplay: ToolDefinition = {
	name: "tbrpg__play",
	description: "Play a round of the game. BEWARE you must have energy.",
	inputSchema: {},
	execute: async () => {
		const request_id = crypto.randomUUID()
		const { promise, resolve, reject } = Promise.withResolvers<State>()

		function listener(event) {
			if (event.data?.source === "webmcp") return
			if (event.data?.request_id !== request_id) return

			console.log("execute: Got message:", event.data)
			resolve(event.data.state)
		}
		window.addEventListener("message", listener)

		window.postMessage({ source: "webmcp", type: "dispatch", action: { type: "play" } })

		const state = await promise
		window.removeEventListener("message", listener)
		const $result = renderꓽresolved_adventure(state.u_state.last_adventure!)
		return renderⵧto_text($result).trim()
	},
	annotations: { readOnlyHint: false, untrustedContentHint: false },
}
navigator.modelContext.registerTool(toolꓽplay, { signal: controller.signal })

// Unregister the tool later...
//controller.abort();
/////////////////////////////////////////////////

/////////////////////////////////////////////////

function Component() {
	const state = useSyncExternalStore(subscribe, getSnapshot)
	console.log(`useSyncExternalStore:`, { snapshot: state })

	const $docs = [
		getꓽrecap(state.u_state),
		renderꓽstatus(state),
		...(state.u_state.last_adventure ? [renderꓽresolved_adventure(state.u_state.last_adventure)] : []),
		renderꓽcharacter_sheet(state.u_state.avatar),
		renderꓽfull_inventory(state.u_state.inventory, state.u_state.wallet),
		//renderꓽachievements_snapshot(state.u_state.)
	]
	return (
		<>
			<RichText $doc={renderꓽgame_info({})} />

			<div>
				<button onClick={() => dispatch({ type: "play" })}>Play</button>
				<button
					onClick={() => {
						const $result = renderꓽstatus(getSnapshot())
						console.log("debug", renderⵧto_text($result).trim())
					}}
				>
					debug
				</button>
			</div>

			{$docs.map(($doc, index) => (
				<RichText $doc={$doc} />
			))}
			<pre>{JSON.stringify(state, null, 2)}</pre>
		</>
	)
}
/*
			<form toolautosubmit="true" toolname="tbrpg__play" tooldescription="Play a round of the game. BEWARE you must have energy.">
				<button type="submit" onClick={() => dispatch({ type: "play" })}>
					Play
				</button>
			</form>
 */

export default {
	component: Component,

	args: {
		_debug: true,
	},

	parameters: {
		//layout: "bare",
	},
} satisfies Meta‿v3

/////////////////////////////////////////////////

export const Default: Story‿v3 = {
	args: {},
}

/////////////////////////////////////////////////
