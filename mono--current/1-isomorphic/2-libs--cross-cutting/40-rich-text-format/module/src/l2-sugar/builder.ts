import { assert_from, assert } from "@monorepo-private/assert"
import { assertꓽstringⵧnormalized, assertꓽstringⵧnormalized_and_trimmed } from "@monorepo-private/normalize-string"
import type { Immutable } from "@monorepo-private/ts--types"
import { hasꓽemoji } from "@monorepo-private/type-detection"

import { LIB, SCHEMA_VERSION } from "../consts.ts"
import {
	NodeType,
	type SubNodeKey,
	type Hints as DefaultHints,
	type StrictNode,
	type Node,
	type Document,
	type NodeLike,
	isꓽNode,
} from "../l1-types/index.ts"
import { simplifyꓽnode, getꓽtype, getꓽdisplay_type, isꓽlist } from "../l1-utils/index.ts"
import { promoteꓽto_node, promoteꓽto_string_for_node_content } from "../l1-utils/promote.ts"
import { wrap } from "../l1-utils/wrap.ts"

/////////////////////////////////////////////////

interface CommonPushOptions {
	id?: SubNodeKey
	classes?: string[]
}

type SubNodes = StrictNode["$refs"]
type SubNode = StrictNode["$refs"][string]

interface Builder {
	setHeading(node: SubNode): Builder

	// content NOT a node = text/number only
	pushText(str: Exclude<NodeLike, Node>): Builder
	pushStrong(str: SubNode, options?: Immutable<CommonPushOptions>): Builder
	pushWeak(str: SubNode, options?: Immutable<CommonPushOptions>): Builder
	pushEm(str: SubNode, options?: Immutable<CommonPushOptions>): Builder
	pushEmoji(e: string, options?: Immutable<CommonPushOptions>): Builder // TODO review
	pushInlineFragment($doc: SubNode, options?: Immutable<CommonPushOptions>): Builder

	pushHorizontalRule(): Builder
	pushLineBreak(): Builder
	pushBlockFragment($doc: SubNode, options?: Immutable<CommonPushOptions>): Builder

	// TODO review = this is a table!
	// to be used in ol/ul only, inserts a predefined string "⎨⎨key⎬⎬: ⎨⎨value⎬⎬"
	pushKeyValue(key: SubNode, value: SubNode, options?: Immutable<CommonPushOptions>): Builder
	//pushListItem No! this is an internal node type, just use addSub()/pushKeyValue() instead

	// node ref is auto added into content
	pushSubNode(node: SubNode, options?: Immutable<Pick<CommonPushOptions, "id">>): Builder
	pushSubNodes(nodes: SubNodes): Builder

	// Raw = NOTHING is added into content (this node may end up not being referenced)
	// useful for
	// 1. lists
	// 2. manual stuff
	addSub(node: SubNode, options?: Immutable<CommonPushOptions>): Builder
	addSubs(nodes: SubNodes): Builder
	pushRef(node_id: SubNodeKey): Builder // syntactic sugar for pushText(`⎨⎨${id}⎬⎬`)

	//addHeading(str: SubNode, options?: Immutable<CommonPushOptions>): Builder
	addClass(...classes: ReadonlyArray<string>): Builder
	addHints<Hints = DefaultHints>(hints: Partial<Hints>): Builder

	// use $node if not wanting a NodeLike
	done(): NodeLike

	assemble(fn: ($builder: Builder) => void): NodeLike

	$node: StrictNode
}

/////////////////////////////////////////////////

function _createꓽbuilder($node: StrictNode): Builder {
	const builder: Builder = {
		setHeading,

		addClass,
		addHints,

		pushText,
		pushEmoji,

		pushSubNode,
		pushSubNodes,
		addSub,
		addSubs,
		pushRef,

		pushInlineFragment,
		pushBlockFragment,

		pushStrong,
		pushEm,
		pushWeak,
		pushHorizontalRule,
		pushLineBreak,

		pushKeyValue,

		done,
		assemble,

		$node,
	}

	const built_node__display_type = getꓽdisplay_type($node)

	let sub_id = 0
	function _get_next_id() {
		return String(++sub_id).padStart(4, "0")
	}

	//let locale = 'en-US' TODO 1D

	function setHeading(node: SubNode): Builder {
		assert(!$node.$heading, `setHeading: should not already have one!`)
		assert(built_node__display_type === "block", `setHeading: the node should be a block!`)

		$node.$heading = node

		return builder
	}

	function addClass(...classes: ReadonlyArray<string>): Builder {
		try {
			classes.forEach(assertꓽstringⵧnormalized_and_trimmed)
		} catch (cause) {
			const err = new Error(`${LIB}: sugar: addClass(): Invalid class name(s) !`)
			err.cause = cause
			throw err
		}

		$node.$classes = Array.from(new Set<string>([...$node.$classes, ...classes]))
		return builder
	}

	function addHints<Hints = DefaultHints>(hints: Hints): Builder {
		$node.$hints = {
			...$node.$hints,
			...hints,
		}
		return builder
	}

	function pushText(content: Immutable<Exclude<NodeLike, Node>>): Builder {
		switch (typeof content) {
			case "number":
			// fallthrough
			case "string": {
				content = promoteꓽto_string_for_node_content(content) // contains assertions

				// no, allow empty strings. sometimes it's easier for control flow reasons.
				//assert(!!content, `${LIB}: sugar: pushText(): Empty string?!`)

				// TODO 1D
				//if (hasꓽemoji(content)) {
				//assert($node.$type === NodeType.emoji, `${LIB}: sugar: pushText(): Emoji detected in a non-emoji node!`)
				//}
				break
			}

			default:
				assert(false, `${LIB}: sugar: pushText(): Unknown pseudo-node type!`)
		}

		if (built_node__display_type === "inline") {
			$node.$content += content
			return builder
		}

		assert(Array.isArray($node.$content), `pushRef on block expects $content to be an array!`)
		if (typeof $node.$content.at(-1) !== "string") {
			$node.$content.push(content)
		} else {
			const last = $node.$content.pop()!
			$node.$content.push(last + content)
		}
		return builder
	}

	function _buildAndPush(builder: Builder, sub: SubNode, options: Immutable<CommonPushOptions> = {}) {
		if (isꓽNode(sub)) builder.pushSubNode(sub)
		else builder.pushText(sub)

		builder.addClass(...(options.classes || []))

		return pushSubNode(builder.done(), options.id ? { id: options.id } : undefined)
	}

	function addSub(subnode: SubNode, options: Immutable<CommonPushOptions> = {}): Builder {
		// params check
		if (Object.keys(options).filter((k) => k !== "id").length)
			assert(false, `${LIB}: sugar: addSub(): Cannot pass any option other than id!`) // make no sense at the level of this primitive. Other options should be filtered out by the caller.

		// sanity checks
		assert(
			getꓽtype(subnode) !== NodeType._li,
			`${LIB}: sugar: The LI type is just for internal use during walk, end users should not use it!`,
		)
		// 1. inline vs block
		assert(
			built_node__display_type === "block" || getꓽdisplay_type(subnode) !== "block",
			`${LIB}: sugar: Cannot push a block node into an inline node!`,
		)
		// 2. list item
		/*if (isꓽlist($node)) {
			if (getꓽtype(subnode) !== NodeType.li) {
				assert(false, `${LIB}: sugar: Cannot push a non-list-item node into a list!`)
			}
		}
		else {
			if (getꓽtype(subnode) === NodeType.li) {
				assert(false, `${LIB}: sugar: Cannot push a list-item node into a non-list!`)
			}
		}*/

		const id = options.id || _get_next_id()
		assertꓽstringⵧnormalized_and_trimmed(id)
		$node.$refs[id] = subnode
		return builder
	}
	function addSubs(nodes: SubNodes): Builder {
		Object.entries(nodes).forEach(([id, node]) => addSub(node, { id }))
		return builder
	}
	function pushRef(id: SubNodeKey): Builder {
		return pushText(`⎨⎨${id}⎬⎬`)
	}

	function pushSubNode(node: SubNode, options: Immutable<CommonPushOptions> = {}): Builder {
		const id = options.id || _get_next_id()

		return pushRef(id).addSub(node, { ...options, id })
	}
	function pushSubNodes(nodes: SubNodes): Builder {
		if (isꓽlist($node)) {
			assert(Array.isArray($node.$content))
			throw new Error("TODO REVIEW")
			//$node.$content.push(...nodes)
			//return builder
		}

		Object.entries(nodes).forEach(([id, node]) => {
			pushSubNode(node, { id })
		})
		return builder
	}

	function pushInlineFragment(str: SubNode, options?: Immutable<CommonPushOptions>): Builder {
		return _buildAndPush(fragmentⵧinline(), str, options)
	}

	function pushBlockFragment(str: SubNode, options?: Immutable<CommonPushOptions>): Builder {
		return _buildAndPush(fragmentⵧblock(), str, options)
	}

	function pushEmoji(str: string, options?: Immutable<CommonPushOptions>): Builder {
		// TODO extra emoji details
		// TODO recognize emoji code
		return _buildAndPush(emoji(), str, options)
	}

	function pushStrong(str: SubNode, options?: Immutable<CommonPushOptions>): Builder {
		return _buildAndPush(strong(), str, options)
	}

	function pushEm(str: SubNode, options?: Immutable<CommonPushOptions>): Builder {
		return _buildAndPush(em(), str, options)
	}

	function pushWeak(str: SubNode, options?: Immutable<CommonPushOptions>): Builder {
		return _buildAndPush(weak(), str, options)
	}

	function pushHorizontalRule(): Builder {
		assert(built_node__display_type === "block", `${LIB}: sugar: Cannot push a hr block node into an inline node!`)
		assert(Array.isArray($node.$content))

		$node.$content.push("⎨⎨hr⎬⎬")

		return builder
	}

	function pushLineBreak(): Builder {
		return pushText("⎨⎨br⎬⎬")
	}

	function pushKeyValue(key: SubNode, value: SubNode, options: Immutable<CommonPushOptions> = {}): Builder {
		if ($node.$type !== NodeType.ol && $node.$type !== NodeType.ul)
			throw new Error(`${LIB}: Key/value is intended to be used in a ol/ul only!`)

		return addSub(keyꓺvalue(key, value).done(), options)
	}

	// TODO rename to value() like lodash chain?
	// to not simplify -> access $node directly
	function done(): NodeLike {
		return simplifyꓽnode($node)
	}

	function assemble(fn: ($builder: Builder) => void): ReturnType<typeof done> {
		fn(builder)
		return done()
	}

	return builder
}

function _create($type: NodeType, content: Immutable<NodeLike> = ""): Builder {
	const is_block = getꓽdisplay_type({ $type }) === "block"

	const $node_base = ((): Immutable<Node> => {
		if (isꓽNode(content)) {
			// ensure right type (will "lift" if possible to avoid an unneeded subnode)
			content = wrap(content, $type)
		}

		return promoteꓽto_node(content)
	})()

	let $content = $node_base.$content
		? structuredClone<StrictNode["$content"]>($node_base.$content as any)
		: is_block
			? []
			: ""
	if (is_block && !Array.isArray($content)) {
		$content = [$content]
	}

	const $node: StrictNode = {
		$v: SCHEMA_VERSION,
		$type,
		$heading: null,
		$classes: [...($node_base.$classes || [])],
		$content,
		$refs: $node_base.$refs ? structuredClone<StrictNode["$refs"]>($node_base.$refs as any) : {},
		$hints: $node_base.$hints ? structuredClone<StrictNode["$hints"]>($node_base.$hints as any) : {},
	}

	return _createꓽbuilder($node)
}

function fragmentⵧinline(content?: Immutable<NodeLike>): Builder {
	return _create(NodeType.fragmentⵧinline, content)
}
function strong(content?: Immutable<NodeLike>): Builder {
	return _create(NodeType.strong, content)
}
function weak(content?: Immutable<NodeLike>): Builder {
	return _create(NodeType.weak, content)
}
function em(content?: Immutable<NodeLike>): Builder {
	return _create(NodeType.em, content)
}
function emoji(content?: Immutable<NodeLike>): Builder {
	return _create(NodeType.emoji, content)
}

function fragmentⵧblock(content?: Immutable<NodeLike>): Builder {
	return _create(NodeType.fragmentⵧblock, content)
}

// reminder: lists should then be pushed addSub/addSubs/pushKeyValue
function listⵧordered(
	content?: Immutable<
		| Array<NodeLike> // items
		| Record<string, NodeLike> // KV TODO review
	>,
): Builder {
	const list = _create(NodeType.ol)
	if (content) {
		if (Array.isArray(content)) {
			;(content as Array<NodeLike>).forEach((item) => list.addSub(item))
		} else {
			Object.entries(content as Record<string, NodeLike>).forEach(([key, value]) => list.pushKeyValue(key, value))
		}
	}
	return list
}
function listⵧunordered(
	content?: Immutable<
		| Array<NodeLike> // items
		| Record<string, NodeLike> // KV
	>,
): Builder {
	const list = _create(NodeType.ul)
	if (content) {
		if (Array.isArray(content)) {
			;(content as Array<NodeLike>).forEach((item) => list.addSub(item))
		} else {
			Object.entries(content as Record<string, NodeLike>).forEach(([key, value]) => list.pushKeyValue(key, value))
		}
	}
	return list
}
// reminder: hr is through pushHorizontalRule

// reminder: br is through pushLineBreak

// TODO review, this is a table
function keyꓺvalue(key: SubNode, value: SubNode): Builder {
	return fragmentⵧinline() // K/V are meant to be separated, but this will happen atomatically thanks to the list parent
		.pushSubNode(key, { id: "key" })
		.pushText(": ")
		.pushSubNode(value, { id: "value" })
}

/////////////////////////////////////////////////

export {
	// for convenience
	NodeType,
	type Document,
	type Builder,
	_create,
	fragmentⵧinline,
	strong,
	em,
	weak,
	emoji,
	fragmentⵧblock,
	listⵧordered,
	listⵧunordered,
	keyꓺvalue,
}
