/////////////////////////////////////////////////

export const LIB = "@monorepo-private/rich-text-format--to-terminal"

/////////////////////////////////////////////////

interface RenderingOptionsⵧToTerminal extends RenderingOptionsⵧToText {
	// TODO one day color dithering
}

const DEFAULT_RENDERING_OPTIONSⵧToTerminal: RenderingOptionsⵧToTerminal = Object.freeze({
	...DEFAULT_RENDERING_OPTIONSⵧToText,
})

/////////////////////////////////////////////////
// TODO 1D handle clickable links https://github.com/sindresorhus/terminal-link
// TODO 1D handle pictures https://github.com/sindresorhus/terminal-image

export function renderⵧto_terminal(doc: Immutable<NodeⳇLike>, callback_overrides = {}) {
	//console.log(`${LIB} Rendering:`, doc)
	return renderⵧto_text(
		doc,
		{
			...DEFAULT_RENDERING_OPTIONSⵧToTerminal,
			style: "markdown", // basic is too light
			//style: "advanced",
		},
		{
			...callbacksⵧto_terminal,
			...callback_overrides,
		},
	)
}
export default renderⵧto_terminal

/////////////////////////////////////////////////

type State = RenderToTextState
const onꓽnodeⵧexit: WalkerCallbacks<State, RenderingOptionsⵧToTerminal>["onꓽnodeⵧexit"] = (...args) => {
	//console.log(`${LIB} onꓽnodeⵧexit()`)

	// first call the text one
	const { $node } = args[0]
	let xstate = callbacksⵧto_text.onꓽnodeⵧexit!(...args)

	switch ($node.$type) {
		case "_h":
		/* fallthrough */
		case "strong":
			xstate.str = stylize_string.bold(xstate.str)
			break
		case "em":
			xstate.str = stylize_string.italic(xstate.str)
			break
		case "weak":
			xstate.str = stylize_string.dim(xstate.str)
			break
		default:
			break
	}

	return xstate
}

// TODO remove and put somewhere else? (extensible)
/*const on_classⵧafter: WalkerCallbacks<State, RenderingOptionsⵧToTerminal>["on_classⵧafter"] = ({ $class, state }) => {
	// not implemented!
	// TODO one day...
	//console.log(`${LIB} on_classⵧafter()`)
	//const { $hints } = $node
	//console.warn(`${LIB}: NIMP class "${$class}", ignored.`) // todo avoid repetition

	return state
}*/

export const callbacksⵧto_terminal: Partial<WalkerCallbacks<State, RenderingOptionsⵧToTerminal>> = {
	onꓽnodeⵧexit,
	//on_classⵧafter,
}

/////////////////////////////////////////////////

import stylize_string from "chalk"

import { type NodeⳇLike } from "@monorepo-private/rich-text-format--core"
import {
	type WalkerCallbacks,
	type RenderingOptionsⵧToText,
	type RenderToTextState,
	DEFAULT_RENDERING_OPTIONSⵧToText,
	renderⵧto_text,
	callbacksⵧto_text,
} from "@monorepo-private/rich-text-format--to-textual"
import type { Immutable } from "@monorepo-private/ts--types"
