import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { SCHEMA_VERSION } from "../consts.ts"
import type { Engagement, State } from "../types.ts"

//////////////////////////////////////////////////////////////////////

type DemoContentType = string

// the most common case
// can be re-used
const DEMO_TEMPLATEⵧFLOWꘌMAIN_ROLEꘌASSISTANT_ATTNꘌNORMAL: Engagement<DemoContentType> = {
	story: {
		kind: "unit",
		message: "[ENGT DEMO]Hello, World!",
		role: "assistant",
	},
	storyⵧllm: "", // no value

	flow: "main",
	attention_needed: "normal",
}

const DEMO_TEMPLATEⵧPLAYⵧFAILURE: Engagement<DemoContentType> = {
	story: {
		kind: "unit",
		message: "[ENGT DEMO]You failed!",
		role: "system",
	},
	storyⵧllm: "The play action failed.",

	flow: "main",
	attention_needed: "notice",

	hints: {
		success: false,
		key: "playⵧfailure",
		vibrate: { duration‿ms: "auto", alt: "" },
		play_sound: { url: "death.mp4", alt: "" },
	},
}

// low importance
const DEMO_TEMPLATEⵧFLOWꘌSIDE_ROLEꘌASSISTANT_ATTNꘌLOG: Engagement<DemoContentType> = {
	story: {
		kind: "unit",
		message: "[ENGT DEMO]Hello, World!",
		role: "assistant",
	},
	storyⵧllm: "", // no value

	flow: "side",
	attention_needed: "log",
}

const DEMO_TEMPLATEⵧNON_FLOW: Engagement<DemoContentType> = {
	story: {
		kind: "unit",
		message: `[ENGT DEMO]You got an update! See what's new!`,
		role: "assistant",
	},
	storyⵧllm: "The current app has been updated.",

	flow: "out",
	attention_needed: "notice",
}

// real examples
/*
const DEMO_SPOILER: Engagement<DemoContentType> = {
	story: {
		kind: 'unit',
		message: 'Spoiler alert!',
		role: 'system',
	},

	flow: 'main',
	sequence: 'pre',
	attention_needed: 'warning',

	enhancements: {
		background: 'blurⵧextreme',
	},
}*/

// a full-featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Immutable<State<DemoContentType>> = enforceꓽimmutable<State<DemoContentType>>({
	schema_version: SCHEMA_VERSION,
	revision: 42,

	queue: [
		{
			...DEMO_TEMPLATEⵧFLOWꘌSIDE_ROLEꘌASSISTANT_ATTNꘌLOG,
			uid: 42,
			/*params: {
				username: 'Offirmo',
			},*/
		},
	],
})

/////////////////////

export {
	DEMO_TEMPLATEⵧFLOWꘌMAIN_ROLEꘌASSISTANT_ATTNꘌNORMAL,
	DEMO_TEMPLATEⵧPLAYⵧFAILURE,
	DEMO_TEMPLATEⵧFLOWꘌSIDE_ROLEꘌASSISTANT_ATTNꘌLOG,
	DEMO_TEMPLATEⵧNON_FLOW,
	DEMO_STATE,
}
