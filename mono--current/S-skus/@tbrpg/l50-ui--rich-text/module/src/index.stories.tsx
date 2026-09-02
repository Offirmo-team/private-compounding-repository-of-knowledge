import { createꓽstore } from "@tbrpg/interfaces"
import type { State } from "@tbrpg/state"
// https://github.com/sindresorhus/emittery#isdebugenabled
import React, { useSyncExternalStore } from "react"

import { RichText } from "@monorepo-private/rich-text-format--to-react"
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"
import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"

import { renderꓽachievements_snapshot } from "./sub-elements/achievements.ts"
import { renderꓽresolved_adventure } from "./sub-elements/adventure.ts"
import { renderꓽcharacter_sheet } from "./sub-elements/attributes.ts"
import { getꓽrecap } from "./sub-elements/engagement/index.ts"
import { renderꓽfull_inventory } from "./sub-elements/inventory.ts"
import { renderꓽgame_info } from "./sub-elements/meta.ts"
import { renderꓽstatus } from "./sub-elements/misc.ts"

/////////////////////////////////////////////////

interface ToolAnnotations {
	// https://platform.claude.com/docs/en/agent-sdk/custom-tools#add-tool-annotations

	// Tool does not modify its environment. Controls whether the tool can be called in parallel with other read-only tools.
	readOnlyHint: boolean

	// Tool may perform destructive updates. Informational only.
	// In a UI, this *could* trigger a confirmation popup
	destructiveHint: boolean

	// Repeated calls with the same arguments have no additional effect. Informational only.
	idempotentHint: boolean

	// Tool reaches systems outside your process. Informational only.
	openWorldHint: boolean

	// WebMCP extension:
	// true if the tool processes data from external or unverified sources
	// to indicate that the tool's output contains data that is untrusted,
	// from the perspective of the author registering the tool.
	// https://docs.google.com/document/d/1rtU1fRPS0bMqd9abMG_hc6K9OAI6soUy3Kh00toAgyk/edit?tab=t.0#heading=h.bwgz9q7okxp7
	untrustedContentHint: boolean
}

// Claude SDK: https://code.claude.com/docs/en/agent-sdk/typescript#tool
// Google best practices: https://docs.google.com/document/d/1rtU1fRPS0bMqd9abMG_hc6K9OAI6soUy3Kh00toAgyk/edit?tab=t.0#heading=h.4q0qotmeoypu
type ToolDefinition = {
	// a unique identifier used to call the tool.
	name: string

	// what the tool does. Agent reads this to decide when to call it.
	description: string

	// TODO XXX Claude expects zod, WebMCP some JSON-schema like
	inputSchema: {
		type: "object"
		properties: {
			[k: string]: {
				type: string
				description: string
			}
		}
		required: string[]
	}

	// the async function that runs when an agent calls the tool. It receives the validated arguments and must return an object with:
	execute: (args: any, extra: unknown) => string | Promise<string>

	annotations: Partial<ToolAnnotations>
}

/////////////////////////////////////////////////
const { subscribe, getSnapshot, dispatch } = createꓽstore()

// Note: those event are more useful for declarative tools (forms)
window.addEventListener("toolactivated", ({ toolName }) => {
	console.log(`the tool "${toolName}" execution was activated.`)
})
window.addEventListener("toolcancel", ({ toolName }) => {
	console.log(`the tool "${toolName}" execution was cancelled.`)
})

const controller = new AbortController()

const toolꓽstatus: ToolDefinition = {
	name: "tbrpg__status",
	description: "Get a quick overall status of the TBRPG game state",
	inputSchema: {
		type: "object",
		properties: {},
		required: [],
	},
	execute: async (...args) => {
		console.log("tool:status", args)

		const $result = renderꓽstatus(getSnapshot())
		return renderⵧto_text($result).trim()
	},
	annotations: { readOnlyHint: true, untrustedContentHint: false },
}
navigator.modelContext.registerTool(toolꓽstatus, { signal: controller.signal })

const toolꓽplay: ToolDefinition = {
	name: "tbrpg__play",
	description: "Play a round of the game. BEWARE you must have energy.",
	inputSchema: {
		type: "object",
		properties: {},
		required: [],
	},
	execute: async () => {
		dispatch({ type: "play" })
		const $result = renderꓽresolved_adventure(getSnapshot().u_state.last_adventure!)
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
			<form
				toolautosubmit="true"
				onSubmit={(event) => {
					event.preventDefault()
					dispatch({ type: "play" })
				}}
				toolname="tbrpg__play--f"
				tooldescription="Play a round of the game. BEWARE you must have energy."
			>
				<button type="submit">PlayF</button>
			</form>

			{$docs.map(($doc, index) => (
				<RichText $doc={$doc} />
			))}
			<pre>{JSON.stringify(state, null, 2)}</pre>
		</>
	)
}
/*

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
