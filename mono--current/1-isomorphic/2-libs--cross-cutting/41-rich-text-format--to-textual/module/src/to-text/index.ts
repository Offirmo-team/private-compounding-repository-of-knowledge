import { assert_from, assert } from "@monorepo-private/assert"
import type { NodeLike } from "@monorepo-private/rich-text-format"
import { getꓽdisplay_type, getꓽtype } from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"

import { isꓽlink } from "../common.ts"
import { type BaseRenderingOptions, type WalkerCallbacks, walk, DEFAULT_RENDERING_OPTIONSⵧWalk } from "../walk.ts"

/////////////////////////////////////////////////

interface RenderingOptionsⵧToText extends BaseRenderingOptions {
	use_hints?: boolean // use known hints to improve rendering? or ignore them and render the most basic style?
	style:
		| "basic" // text only
		//| 'advanced' // more intelligent: detect KV lists; allow bullet-less lists XXX TODO review should it be based on hints instead? also KV = nothing
		| "markdown"
}
const DEFAULT_RENDERING_OPTIONSⵧToText = Object.freeze<RenderingOptionsⵧToText>({
	...DEFAULT_RENDERING_OPTIONSⵧWalk,
	use_hints: true,
	style: "markdown",
})

type State = {
	// accumulated content
	str: string

	// concatenation tracking
	marginⵧbottom‿lines: number
	marginⵧtop‿lines: number
}

function createꓽstate(): State {
	return {
		str: "",
		marginⵧtop‿lines: 0,
		marginⵧbottom‿lines: 0,
	}
}

/////////////////////////////////////////////////
// callbacks

const onꓽnodeⵧexit: WalkerCallbacks<State, RenderingOptionsⵧToText>["onꓽnodeⵧexit"] = (
	{ bstate, xstate, $node },
	{ style },
) => {
	//console.log('[onꓽnodeⵧexit]', bstate.depthⵧnodes)

	// content adjustment
	if (style === "markdown") {
		switch ($node.$type) {
			case "_h":
				if (bstate.depthⵧlist > 0) {
					// headers inside lists are not real headers
				} else {
					xstate.str = `${"#".repeat(bstate.depthⵧh + 1)} ${xstate.str}`
				}
				break

			case "strong":
				xstate.str = `**${xstate.str}**`
				break

			case "weak":
				// not really supported in Markdown
				xstate.str = `<small>${xstate.str}</small>`
				break

			case "em":
				xstate.str = `_${xstate.str}_`
				break

			case "hr":
				xstate.str = "---"
				break

			default:
				break
		}

		if (isꓽlink($node)) {
			xstate.str = `[${xstate.str}](${$node.$hints.href})`
		}

		// TODO advanced Markdown features
	} else {
		switch ($node.$type) {
			case "hr":
				xstate.str = "------------------------------------------------------------"
				break

			default:
				break
		}
	}

	// block margins
	if (getꓽdisplay_type($node) === "block" || $node.$type === "_h") {
		// ensure minimum values
		// (some higher values may already be present thanks to child nodes)
		xstate.marginⵧtop‿lines = Math.max(2, xstate.marginⵧtop‿lines)
		xstate.marginⵧbottom‿lines = Math.max(2, xstate.marginⵧbottom‿lines)

		switch ($node.$type) {
			case "ol":
			case "ul": {
				// nested lists must be tight
				// list overall don't even need spacing?
				xstate.marginⵧtop‿lines = 1
				xstate.marginⵧbottom‿lines = 1
				break
			}

			case "_li":
				// list items should be tight
				// the ol/ul wrapper will ensure overall margin
				xstate.marginⵧtop‿lines = 1
				xstate.marginⵧbottom‿lines = 1
				break

			case "_h":
				if (bstate.depthⵧlist > 0) {
					// headers inside lists are not real headers
					// nested lists must be tight
					xstate.marginⵧtop‿lines = 1
					xstate.marginⵧbottom‿lines = 1
				} else {
					xstate.marginⵧtop‿lines = Math.max(4 - bstate.depthⵧh, xstate.marginⵧtop‿lines)
				}
				break

			default:
				break
		}
	}

	/* TODO review
	if (style === 'advanced' && isꓽlistⵧKV($node)) {
		// rewrite completely to a better-looking one
		const key_value_pairs: [string, string][] = []

		let max_key_length = 0
		let max_value_length = 0
		xstate.sub_nodes.forEach(li_node => {
			//console.log({li_node})
			const kv_node = li_node.$refs[SPECIAL_LIST_NODE_CONTENT_KEY]! as CheckedNode

			const key_node = promoteꓽto_node(kv_node.$refs['key']!)
			const value_node = promoteꓽto_node(kv_node.$refs['value']!)

			const key_text = renderⵧto_text(key_node)
			const value_text = renderⵧto_text(value_node)

			max_key_length = Math.max(max_key_length, key_text.length)
			max_value_length = Math.max(max_value_length, value_text.length)

			key_value_pairs.push([key_text, value_text])
		})

		xstate.str = key_value_pairs
			.map(([key_text, value_text]) => {
				return (
					key_text.padEnd(max_key_length + 1, '.')
					+ value_text.padStart(max_value_length + 1, '.')
				)
			})
			.join('\n')
	}*/

	return xstate
}

const onꓽconcatenateⵧstr: WalkerCallbacks<State, RenderingOptionsⵧToText>["onꓽconcatenateⵧstr"] = ({ xstate, str }) => {
	//console.log('onꓽconcatenateⵧstr()', {str, xstate: structuredClone(xstate)})

	// handle separation between new and last content
	if (xstate.marginⵧbottom‿lines) {
		xstate.str = xstate.str.trimEnd() // no need for those trailing spaces
		xstate.str += "\n".repeat(xstate.marginⵧbottom‿lines)
		xstate.marginⵧbottom‿lines = 0 // because done
	}

	// concat
	xstate.str += str

	// prepare separation with next content
	xstate.marginⵧbottom‿lines = 0 // this is an inline fragment

	return xstate
}

const onꓽconcatenateⵧsub_node: WalkerCallbacks<State, RenderingOptionsⵧToText>["onꓽconcatenateⵧsub_node"] = (
	{ bstate, xstate, $node, xstateⵧsub, row_index },
	options,
) => {
	//console.log('onꓽconcatenateⵧsub_node()', {xstate: structuredClone(xstate), xstateⵧsub: structuredClone(xstateⵧsub)})

	// handle separation between new and last content
	if (xstate.str === "" && xstate.marginⵧtop‿lines === 0) {
		// this is the 1st content,
		// no need for separation,
		// but inherit this node top margin
		xstate.marginⵧtop‿lines = xstateⵧsub.marginⵧtop‿lines
	} else {
		const margin_to_insert‿lines = Math.max(
			// margin collapsing
			xstate.marginⵧbottom‿lines,
			xstateⵧsub.marginⵧtop‿lines,
		)
		if (margin_to_insert‿lines) {
			xstate.str = xstate.str.trimEnd() // no need for those trailing spaces
			xstate.str += "\n".repeat(margin_to_insert‿lines)
		}
		xstate.marginⵧbottom‿lines = 0 // separation applied, clear it
	}

	// concat
	switch ($node.$type) {
		case "ul":
		// fallthrough
		case "ol": {
			if (row_index === -1) {
				// this is the heading, not a row
				xstate.str += xstateⵧsub.str
				break
			}

			const bullet: string = (() => {
				if (options.use_hints && $node.$hints.list__style__type !== undefined) return $node.$hints.list__style__type

				if ($node.$type === "ul") return "-"

				const cleaned_index: string = String(row_index + 1)
				if (options.style === "markdown") return `${cleaned_index}.` // no alignment: could mess with the markdown

				// alignment for readability
				return cleaned_index.padStart(2) + "."
			})()
			const indent: string = "  ".repeat(bstate.depthⵧlist)
			xstate.str += indent + bullet + (bullet ? " " : "") + xstateⵧsub.str
			break
		}
		default:
			xstate.str += xstateⵧsub.str
	}

	// prepare separation with next content
	xstate.marginⵧbottom‿lines = xstateⵧsub.marginⵧbottom‿lines

	return xstate
}

const callbacksⵧto_text: Partial<WalkerCallbacks<State, RenderingOptionsⵧToText>> = {
	createꓽstate,

	onꓽnodeⵧexit,

	onꓽconcatenateⵧstr,
	onꓽconcatenateⵧsub_node,
}

function renderⵧto_text(
	$doc: Immutable<NodeLike>,
	options: Partial<RenderingOptionsⵧToText> = {},
	callback_overrides: Partial<WalkerCallbacks<State, RenderingOptionsⵧToText>> = {},
): string {
	const full_options: RenderingOptionsⵧToText = {
		...DEFAULT_RENDERING_OPTIONSⵧToText,
		...options,
	}

	const xstate = walk<State, RenderingOptionsⵧToText>(
		$doc,
		{
			...callbacksⵧto_text,
			...callback_overrides,
		},
		full_options,
	)

	return "\n".repeat(xstate.marginⵧtop‿lines) + xstate.str + "\n".repeat(xstate.marginⵧbottom‿lines)
	//	return xstate.str
}

/////////////////////////////////////////////////

type RenderToTextState = State

export {
	type RenderingOptionsⵧToText,
	type RenderToTextState,
	DEFAULT_RENDERING_OPTIONSⵧToText,
	callbacksⵧto_text,
	renderⵧto_text,
}
