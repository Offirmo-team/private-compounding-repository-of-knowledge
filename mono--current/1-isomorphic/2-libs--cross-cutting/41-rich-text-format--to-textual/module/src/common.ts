import { assert_from, assert } from "@monorepo-private/assert"
import type { NodeⳇNormalized, NodeⳇLike } from "@monorepo-private/rich-text-format"
import { wrap, isꓽlist, isꓽNodeLike } from "@monorepo-private/rich-text-format"
import { type Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

function isꓽlink($node: Immutable<NodeⳇNormalized>): boolean {
	return !!$node.$hints.href
}

// for iterating only
function getꓽcontent‿nodes_list($node: Immutable<NodeⳇNormalized>): Array<Immutable<NodeⳇLike>> {
	let result: Array<Immutable<NodeⳇLike>> = [] // so far

	if (isꓽNodeLike($node.$content)) {
		// simply promote to array
		result.push($node.$content)
	} else if (Array.isArray($node.$content)) {
		result = $node.$content as Array<Immutable<NodeⳇLike>>
	} else {
		throw new Error("Unknown case!")
	}

	// clean up
	result = result.filter((x) => x !== "")

	const is_list = isꓽlist($node)
	if (is_list && result.length === 0) {
		// allowed for lists
		// default to all the refs
		const keys = Object.keys($node.$refs)
		result = keys.sort().map((k) => `⎨⎨${k}⎬⎬`)
	}

	return result.map(($row_node) => {
		// if list, also preserve the extra semantic meaning
		if (is_list) {
			return wrap($row_node, "_li")
		}

		// Do NOT promote simple nodes to block, that would cause an infinite loop!
		// this list is NOT like a list inside a block, it's just a list for iterating

		return $row_node
	})
}

/////////////////////////////////////////////////

export { isꓽlink, getꓽcontent‿nodes_list }
