import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import { type NodeLike, type Node, isꓽNodeLike, assertꓽNodeInvariants } from "../l1-types/index.ts"
import { NodeType, isꓽNode, getꓽdisplay_type } from "../l1-types/index.ts"

import { getꓽtype } from "./misc.ts"
import { promoteꓽto_node } from "./promote.ts"

/////////////////////////////////////////////////

function wrap($nodeⵧto_wrap: Immutable<NodeLike>, typeⵧwrapper: NodeType): Immutable<NodeLike> {
	assert(typeⵧwrapper !== "fragmentⵧinline", `should not wrap in a type with no semantic meaning!`)

	const typeⵧwrapped = getꓽtype($nodeⵧto_wrap)
	if (typeⵧwrapped === typeⵧwrapper) {
		// nothing to do
		return $nodeⵧto_wrap
	}

	const display_typeⵧwrapped = getꓽdisplay_type($nodeⵧto_wrap)
	assert(display_typeⵧwrapped)
	const display_typeⵧwrapper = getꓽdisplay_type({ $type: typeⵧwrapper })
	assert(display_typeⵧwrapper)
	if (display_typeⵧwrapped === "block") {
		assert(display_typeⵧwrapper === "block", "wrap(): cannot wrap a block inside an inline!")
	}

	if (typeⵧwrapper === "fragmentⵧblock" && display_typeⵧwrapped === "block") {
		// it's already a block,
		// and this type has no semantic meaning
		// = nothing to do
		return $nodeⵧto_wrap
	}

	if (typeⵧwrapped === "fragmentⵧblock" || typeⵧwrapped === "fragmentⵧinline") {
		// wrapped has no semantic meaning = type can be replaced in-place
		const $promoted = promoteꓽto_node($nodeⵧto_wrap)
		let $content = $promoted.$content

		// BUT inline -> block need correct shape
		if (display_typeⵧwrapper === "block" && $content && !Array.isArray($content)) {
			$content = [$content] as any
		}

		const $nodeⵧwrapper: Immutable<Node> = {
			...$promoted,
			$type: typeⵧwrapper,
			...($content && { $content }),
		}
		assertꓽNodeInvariants($nodeⵧwrapper)

		return $nodeⵧwrapper
	}

	// actually wrap
	// (known case: sub node into li)
	const $nodeⵧwrapper: Immutable<Node> = {
		$type: typeⵧwrapper,
		$content: display_typeⵧwrapper === "block" ? [$nodeⵧto_wrap] : $nodeⵧto_wrap,
	}
	assertꓽNodeInvariants($nodeⵧwrapper)

	return $nodeⵧwrapper
}
/////////////////////////////////////////////////

export { wrap }
