import { assert_from, assert } from "@monorepo-private/assert"
import { normalize_unicode } from "@monorepo-private/normalize-string"
import type { Immutable } from "@monorepo-private/ts--types"

import { LIB, SCHEMA_VERSION } from "../consts.ts"
import { type StrictNode, type Node } from "../l1-types/types.ts"

import { getꓽtype } from "./misc.ts"

/////////////////////////////////////////////////

/** Normalize the given node (not deeply, only 1st level) */
function normalizeꓽnode($raw_node: Node): StrictNode
function normalizeꓽnode($raw_node: Immutable<Node>): Immutable<StrictNode>
function normalizeꓽnode($raw_node: Immutable<Node>): Immutable<StrictNode> {
	assert(!!$raw_node, `normalize_node(): param should be defined!`)

	let {
		// extract fields
		$v = 1, // assume the oldest format (until we can recognize the version)
		$type = "auto", // for now
		$heading = null,
		$content = "",
		$refs = {},
		$classes = [],
		$hints = {},
		...rest
	} = $raw_node

	if (typeof $heading === "string") {
		$heading = normalize_unicode($heading)
	} else {
		// reminder: we don't deep normalize
	}

	if (typeof $content === "string") {
		$content = normalize_unicode($content)
	} else {
		// reminder: we don't deep normalize
	}

	// small validations
	assert(
		Object.keys(rest).length === 0,
		`[${LIB}] normalizeꓽnode() node contain extraneous keys! (${Object.keys(rest).join(",")})`,
	)
	if ($v !== SCHEMA_VERSION) {
		// add migration when needed
		throw new Error(`[${LIB}] normalizeꓽnode(): unknown schema version "${$v}"!`)
	}

	let $node: Immutable<StrictNode> = {
		$v,
		$type,
		$heading,
		$content,
		$refs,
		$classes,
		$hints,
	}
	$node = {
		...$node,
		$type: getꓽtype($node),
	}

	return $node
}

/////////////////////////////////////////////////

export { normalizeꓽnode }
