import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import { isꓽobjectⵧliteral } from "@monorepo-private/type-detection"

import { SCHEMA_VERSION } from "../consts.ts"
import { NodeType, type StrictNode, type Node, type NodeLike } from "../l1-types/types.ts"

import { getꓽtype, isꓽdisplayⵧinline } from "./misc.ts"

/////////////////////////////////////////////////

function simplifyꓽnode($any_node: NodeLike): NodeLike
function simplifyꓽnode($any_node: Immutable<NodeLike>): Immutable<NodeLike> {
	assert($any_node != null, `simplifyꓽnode(): param should be defined!`)

	if (!isꓽobjectⵧliteral($any_node)) {
		return $any_node // already simplest
	}

	let {
		// extract fields
		$v = 1, // assume the oldest format (until we can recognize the version)
		$type = "auto",
		$heading = null,
		$content = "",
		$refs = {},
		$classes = [],
		$hints = {},
	} = $any_node as Node // cast out the Immutability: we know what we're doing 🤙

	let $node: Node = {
		$v,
		$type,
		$heading,
		$content,
		$refs,
		$classes,
		$hints,
	} satisfies StrictNode
	$type = getꓽtype($node)
	$node = {
		...$node,
		$type,
	}

	if ($v === SCHEMA_VERSION) {
		delete $node.$v
	}
	if (Object.keys($refs).length === 0) {
		delete $node.$refs
	}
	if ($classes.filter((c) => c?.trim()).length === 0) {
		delete $node.$classes
	}
	if (Object.keys($node.$hints!).length === 0) {
		delete $node.$hints
	}
	if (!$heading) {
		delete $node.$heading
	}

	// content & type are a bit more complicated
	let $content_: Array<NodeLike> = Array.isArray($content) ? $content : [$content]
	$content_ = $content_.map(simplifyꓽnode)

	if (isꓽdisplayⵧinline($node)) {
		$node.$content = $content_[0] ?? ""
		if ($type === NodeType.fragmentⵧinline) {
			delete $node.$type
		}
	} else {
		$node.$content = $content_
		if ($type === NodeType.fragmentⵧblock) {
			delete $node.$type
		}
	}

	const non_content_props = Object.keys($node).filter((k) => k !== "$content")
	if (non_content_props.length === 0 && $type === NodeType.fragmentⵧinline) {
		if (typeof $node.$content === "string") return $node.$content
		if (typeof $node.$content === "number") return $node.$content
	}

	return $node
}

/////////////////////////////////////////////////

export { simplifyꓽnode }
