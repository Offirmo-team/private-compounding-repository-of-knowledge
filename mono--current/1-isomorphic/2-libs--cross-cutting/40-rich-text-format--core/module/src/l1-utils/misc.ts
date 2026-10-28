import { assert_from } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { NodeⳇLike } from "../l1-types/index.ts"
import { NodeType, isꓽNodeⳇPromotable, getꓽdisplay_type, assertꓽNodeInvariants } from "../l1-types/index.ts"

/////////////////////////////////////////////////
// selectors

function getꓽtype($node: Immutable<NodeⳇLike>): NodeType {
	if (isꓽNodeⳇPromotable($node)) {
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

function isꓽdisplayⵧinline(node: Immutable<NodeⳇLike>): boolean {
	return getꓽdisplay_type(node) === "inline"
}
function isꓽdisplayⵧblock(node: Immutable<NodeⳇLike>): boolean {
	return getꓽdisplay_type(node) === "block"
}

function isꓽlist($node: Immutable<NodeⳇLike>): boolean {
	const $type = getꓽtype($node)

	return $type === "ol" || $type === "ul"
}

/////////////////////////////////////////////////

export { getꓽtype, isꓽlist, getꓽdisplay_type, isꓽdisplayⵧinline, isꓽdisplayⵧblock }
