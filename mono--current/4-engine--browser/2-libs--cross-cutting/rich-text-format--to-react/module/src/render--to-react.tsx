import classNames from "classnames"
import memoize_one from "memoize-one"
import * as React from "react"
import { type ReactNode } from "react"

import { assert_from, assert } from "@monorepo-private/assert"
import { normalize_unicode, capitalizeⵧfirst, normalizeꓽurl } from "@monorepo-private/normalize-string"
import {
	type NodeLike,
	type Node,
	type StrictNode,
	Enum,
	NodeType,
	isꓽlist,
	promoteꓽto_node,
	getꓽtype,
	type SubNodeKey,
} from "@monorepo-private/rich-text-format"
import {
	walk,
	type WalkerCallbacks,
	type BaseRenderingOptions,
	DEFAULT_RENDERING_OPTIONSⵧWalk,
	type BaseWalkState,
} from "@monorepo-private/rich-text-format--to-textual"
import type { Immutable } from "@monorepo-private/ts--types"
import { getꓽuriⵧnormalized‿str } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

const LIB = "RichText-to-React"

interface RenderingOptionsⵧToReact extends BaseRenderingOptions {
	key?: string
}
const DEFAULT_RENDERING_OPTIONSⵧToReact: RenderingOptionsⵧToReact = {
	...DEFAULT_RENDERING_OPTIONSⵧWalk,
}

/////////////////////////////////////////////////

const NODE_TYPE_TO_COMPONENT: { [type: string]: React.HTMLElementType | undefined } = {
	// will default to own tag if not in this list (ex. strong => strong)
	[NodeType.fragmentⵧinline]: "span" as React.HTMLElementType,
	[NodeType.weak]: "span" as React.HTMLElementType, // see also NODE_TYPE_TO_EXTRA_CLASSES
	[NodeType.emoji]: "span" as React.HTMLElementType,

	[NodeType.fragmentⵧblock]: "div" as React.HTMLElementType,

	[NodeType._li]: "li" as React.HTMLElementType,
}

const NODE_TYPE_TO_EXTRA_CLASSES: { [type: string]: string[] | undefined } = {
	[NodeType.weak]: ["o⋄colorꘌsecondary"],
}

// TODO move to shared helpers?
function isꓽReactElement(e: React.ReactNode): e is React.ReactElement {
	// https://legacy.reactjs.org/docs/jsx-in-depth.html#booleans-null-and-undefined-are-ignored
	// false, null, undefined, and true are valid children. They simply don’t render.
	const is_renderable = !!e && e !== true
	if (!is_renderable) return false

	const is_primitive = typeof e === "string" || typeof e === "number" || typeof e === "bigint"
	return !is_primitive
}

// a clever key is critically needed in general, but even more critical
// for lists, the default keys "1, 2, 3" are non-optimal, ex. if the list is re-ordered.
// Thus, we attempt to enrich the default key ($id) from various hints.
function _generateꓽown_react_key({
	$snk,
	$node,
}: {
	$snk: SubNodeKey
	$node: Immutable<StrictNode> | Immutable<Node>
}) {
	let key = $snk

	/*if ($node.$type === NodeType._li) {
		// this is a wrapper, go down a level
		throw new Error("NIMP")
		//$node = promoteꓽto_node($node.$refs![SPECIAL_LIST_NODE_CONTENT_KEY]!)
	}*/

	if ($node.$hints?.key) key += `.aka:${$node.$hints.key}`
	if ($node.$hints?.["uuid"]) key += `.uuid:${$node.$hints["uuid"]}`

	//console.log("_generateꓽown_react_key", { $snk, $node, key })

	return key
}

function _getꓽaggregated_keyed_children({ xstate }: { xstate: WalkState }): Array<React.ReactNode> {
	let children: Array<React.ReactNode> = xstate.children_states
		.map((s) => s.element)
		.filter((child) => {
			// https://legacy.reactjs.org/docs/jsx-in-depth.html#booleans-null-and-undefined-are-ignored
			// false, null, undefined, and true are valid children. They simply don’t render.
			return !!child && child !== true
		})
		.map((child) => {
			if (typeof child === "string") return normalize_unicode(child)

			return child
		})

	const complex_children_count = children.reduce<number>((acc, child) => {
		if (!isꓽReactElement(child)) return acc

		return acc + 1
	}, 0)

	if (complex_children_count > 1) {
		// we need to key the children out of safety
		// at their level, children can't ensure that their keys are unique,
		// especially for {br} which may be repeated.
		// We need to assist with that:

		//console.group(`starting rekey for ${$id}...`)
		//console.log({$node, state})
		const key_count = new Map<string, number>()
		children = children.map((child) => {
			if (!isꓽReactElement(child)) return child

			let key = (child! as React.ReactElement).key!

			const count = (key_count.get(key) || 0) + 1
			key_count.set(key, count)

			if (count > 1) {
				key += `+${count}`
				child = React.cloneElement(child, { key })
			}

			return child
		})
		//console.log(key_count)
		//console.groupEnd()
	} else {
		const has_only_str_children = children.every((child) => typeof child === "string")
		if (has_only_str_children) children = [children.join("")] // merge into a single string
	}

	return children
}

function _getꓽaggregated_classes({ $node }: { $node: Immutable<StrictNode> }): Set<string> {
	const { $type, $classes, $hints } = $node

	const classes = new Set<string>([...$classes, ...(NODE_TYPE_TO_EXTRA_CLASSES[$type] || [])])

	if (isꓽlist($node)) {
		classes.add("o⋄rich-text⋄list")

		switch ($hints.list__style__type) {
			case "":
				classes.add("o⋄rich-text⋄list--no-bullet")
				break

			default:
				break
		}
	}

	return classes
}

function _getꓽHTMLElementType({
	$node,
	bstate,
}: {
	$node: Immutable<Node>
	bstate?: Immutable<BaseWalkState>
}): React.HTMLElementType {
	const $type = getꓽtype($node)

	if (NODE_TYPE_TO_COMPONENT[$type]) {
		let element_type = NODE_TYPE_TO_COMPONENT[$type]
		if (element_type === "div" && $node.$heading) {
			// a bit more semantic
			element_type = "section"
		}
		return element_type
	}

	if (!$type.startsWith("_")) return $type as React.HTMLElementType

	if ($type === "_h") {
		assert(bstate, "_h is internal, can't appear at root level")

		if (bstate.depthⵧlist >= 0) {
			// lists heading are simple text
			return "span"
		}

		switch (bstate.depthⵧh) {
			case 0:
				return "h1"
			case 1:
				return "h2"
			case 2:
				return "h3"
			case 3:
				return "h4"
			case 4:
				return "h5"
			default:
				return "h6"
		}
	}

	debugger
	throw new Error("NIMP")
}

function _getꓽfinal_element_creator({
	$node,
	bstate,
	classes,
}: {
	$node: Immutable<StrictNode>
	bstate: Immutable<BaseWalkState>
	classes: Set<string>
}): (children: ReactNode[]) => React.ReactNode {
	const { $type, $heading, $hints } = $node

	if (!Enum.isType(NodeType, $type)) {
		throw new Error(`Unknown node type "${$type}"!`)
	}

	const has_classes = classes.size !== 0
	const classProps = {
		...(has_classes && { className: classNames(Array.from(classes.values())) }),
	}

	const key = _generateꓽown_react_key({ $snk: bstate.$snk, $node })

	if ($hints.href) {
		const props = {
			key,
			...classProps,
			href: getꓽuriⵧnormalized‿str($hints.href),
		} as any
		const urlⵧcurrent‿obj = new URL(window.location.href)
		const urlⵧtarget‿obj = new URL(props.href)
		const isꓽexternal = urlⵧcurrent‿obj.origin !== urlⵧtarget‿obj.origin
		if (isꓽexternal) {
			props.target = "_blank"
			props.rel = "noopener external" // default safe
		}

		return (children) => React.createElement("a", props, children)
	}

	let element_type = _getꓽHTMLElementType({ $node, bstate })

	return (children) => {
		const has_only_str_children = children.every((child) => typeof child === "string")

		if (element_type === "span" && !has_classes && has_only_str_children) {
			return children.join("") // directly as a string
		}

		let cleaned_children: ReactNode[] | undefined = children

		if (children.length === 0 || (has_only_str_children && children.join("") === "")) {
			// this is equivalent to not having children
			cleaned_children = undefined
		}

		if (isꓽlist($node) && $node.$heading && cleaned_children) {
			// a list heading should be a single text above it
			cleaned_children = [...cleaned_children]
			const heading_elt = cleaned_children.shift()!
			cleaned_children = [
				heading_elt,
				React.createElement(
					element_type,
					{
						key,
						...classProps,
					},
					cleaned_children,
				),
			]
			return React.createElement(
				"div",
				{
					key,
				},
				cleaned_children,
			)
		}

		return React.createElement(
			element_type,
			{
				key,
				...classProps,
			},
			cleaned_children,
		)
	}
}

/////////////////////////////////////////////////

interface WalkState {
	element: undefined | React.ReactNode // core result

	// this is where the sub-nodes concatenation happens
	children_states: Array<WalkState>
}

const createꓽstate: WalkerCallbacks<WalkState, RenderingOptionsⵧToReact>["createꓽstate"] = (): WalkState => {
	return {
		element: undefined,
		children_states: [],
	}
}

const onꓽnodeⵧexit: WalkerCallbacks<WalkState, RenderingOptionsⵧToReact>["onꓽnodeⵧexit"] = ({
	bstate,
	xstate,
	$node,
}) => {
	if ($node.$type === NodeType.br || $node.$type === NodeType.hr) {
		xstate.children_states = []
	}

	const children = _getꓽaggregated_keyed_children({ xstate })
	const classes = _getꓽaggregated_classes({ $node })
	const create_element = _getꓽfinal_element_creator({ $node, bstate, classes })

	xstate.element = create_element(children)

	return xstate
}

const onꓽconcatenateⵧstr: WalkerCallbacks<WalkState, RenderingOptionsⵧToReact>["onꓽconcatenateⵧstr"] = ({
	xstate,
	str,
}) => {
	xstate.children_states.push({
		element: str,
		children_states: [],
	})
	return xstate
}

const onꓽconcatenateⵧsub_node: WalkerCallbacks<WalkState, RenderingOptionsⵧToReact>["onꓽconcatenateⵧsub_node"] = ({
	xstate,
	xstateⵧsub,
}) => {
	xstate.children_states.push(xstateⵧsub)

	return xstate
}

/*
const onꓽfilterꘌCapitalize: WalkerCallbacks<WalkState, RenderingOptionsⵧToReact>["on_filter"] = ({ xstate }) => {
	//console.warn('rich-text-to-react Capitalize', state)

	if (typeof xstate.element === "string") state.element = capitalizeⵧfirst(xstate.element)
	else if (isꓽReactElement(xstate.element))
		xstate.element = React.cloneElement(xstate.element, {
			// TODO deep capitalize?
			children: React.Children.map(xstate.element.props.children, (child) => (typeof child === "string" ? capitalizeⵧfirst(child) : child)),
		})

	return xstate
}*/

const callbacksⵧto_react: Partial<WalkerCallbacks<WalkState, RenderingOptionsⵧToReact>> = {
	createꓽstate,
	onꓽnodeⵧexit,
	onꓽconcatenateⵧstr,
	onꓽconcatenateⵧsub_node,
	//onꓽfilterꘌCapitalize,
}

/////////////////////////////////////////////////

function renderⵧto_react(
	$doc: Immutable<NodeLike>,
	callback_overrides: Partial<WalkerCallbacks<WalkState, RenderingOptionsⵧToReact>> = {},
	raw_options: Partial<RenderingOptionsⵧToReact> = {},
) {
	//console.log(`${LIB} Rendering a rich text:`, $doc)

	const callbacks: Partial<WalkerCallbacks<WalkState, RenderingOptionsⵧToReact>> = {
		...callbacksⵧto_react,
		...callback_overrides,
	}

	const options: RenderingOptionsⵧToReact = {
		...DEFAULT_RENDERING_OPTIONSⵧToReact,
		...raw_options,
	}

	$doc = promoteꓽto_node($doc)
	const state = walk<WalkState, RenderingOptionsⵧToReact>($doc, callbacks, options)

	if (isꓽReactElement(state.element)) {
		// optim to avoid a useless div
		// do not lose infos!
		const key = options.key || state.element.key || "rich-text-format-to-react--root"
		const props = (state.element.props || {}) as any
		const className = "o⋄rich-text " + (props.className || "")
		return React.cloneElement(state.element, {
			...props,
			key,
			className,
		})
	}

	return React.createElement(
		_getꓽHTMLElementType({ $node: $doc }),
		{
			key: options.key || "rich-text-format-to-react--root",
			className: "o⋄rich-text",
		},
		state.element,
	)
}

/////////////////////////////////////////////////

export { type RenderingOptionsⵧToReact, renderⵧto_react }
export default renderⵧto_react
