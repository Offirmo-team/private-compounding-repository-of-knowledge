import { assert_from } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { NodeLike } from "../l1-types/index.ts"
import { NodeType, isꓽNodeLikeⵧnot_node, getꓽdisplay_type, assertꓽNodeInvariants } from "../l1-types/index.ts"

/////////////////////////////////////////////////
// selectors

function getꓽtype($node: Immutable<NodeLike>): NodeType {
	if (isꓽNodeLikeⵧnot_node($node)) {
		// it's a primitive: string or number
		return "fragmentⵧinline"
	}

	assertꓽNodeInvariants($node)

	if ($node.$type && $node.$type !== "auto") {
		return $node.$type
	}

	return getꓽdisplay_type($node) === "block" ? "fragmentⵧblock" : "fragmentⵧinline"
}

/////////////////////////////////////////////////

function isꓽdisplayⵧinline(node: Immutable<NodeLike>): boolean {
	return getꓽdisplay_type(node) === "inline"
}
function isꓽdisplayⵧblock(node: Immutable<NodeLike>): boolean {
	return getꓽdisplay_type(node) === "block"
}

function isꓽlist($node: Immutable<NodeLike>): boolean {
	const $type = getꓽtype($node)

	return $type === "ol" || $type === "ul"
}

/////////////////////////////////////////////////

export { getꓽtype, isꓽlist, getꓽdisplay_type, isꓽdisplayⵧinline, isꓽdisplayⵧblock }
