import stylize_string from "chalk"

import {
	type NodeLike,
	type WalkerCallbacks,
	type RenderingOptionsⵧToText,
	type RenderToTextState,
	DEFAULT_RENDERING_OPTIONSⵧToText,
	renderⵧto_text,
} from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const LIB = "@monorepo-private/rich-text-format--to-terminal"

interface RenderingOptionsⵧToTerminal extends RenderingOptionsⵧToText {
	// TODO one day color dithering
}

const DEFAULT_RENDERING_OPTIONSⵧToTerminal: RenderingOptionsⵧToTerminal = Object.freeze({
	...DEFAULT_RENDERING_OPTIONSⵧToText,
})

/////////////////////////////////////////////////

// TODO handle boxification ? (needed?)

////////////

// TODO handle clickable links https://github.com/sindresorhus/terminal-link
// TODO handle pictures https://github.com/sindresorhus/terminal-image

type State = RenderToTextState
const on_type: WalkerCallbacks<State, RenderingOptionsⵧToTerminal>["on_type"] = ({ $type, state }) => {
	//console.log(`${LIB} on_type()`)
	switch ($type) {
		case "heading":
		/* fallthrough */
		case "strong":
			state.str = stylize_string.bold(state.str)
			break
		case "em":
			state.str = stylize_string.italic(state.str)
			break
		case "weak":
			state.str = stylize_string.dim(state.str)
			break
		default:
			break
	}

	return state
}

// TODO remove and put somewhere else? (extensible)
const on_classⵧafter: WalkerCallbacks<State, RenderingOptionsⵧToTerminal>["on_classⵧafter"] = ({ $class, state }) => {
	// not implemented!
	// TODO one day...
	//console.log(`${LIB} on_classⵧafter()`)
	//const { $hints } = $node
	//console.warn(`${LIB}: NIMP class "${$class}", ignored.`) // todo avoid repetition

	return state
}

const callbacksⵧto_terminal: Partial<WalkerCallbacks<State, RenderingOptionsⵧToTerminal>> = {
	on_type,
	on_classⵧafter,
}

function renderⵧto_terminal(doc: Immutable<NodeLike>, callback_overrides = {}) {
	//console.log(`${LIB} Rendering:`, doc)
	return renderⵧto_text(
		doc,
		{
			style: "advanced",
		},
		{
			...callbacksⵧto_terminal,
			...callback_overrides,
		},
	)
}

/////////////////////////////////////////////////

export default renderⵧto_terminal

export { LIB, renderⵧto_terminal, callbacksⵧto_terminal }
