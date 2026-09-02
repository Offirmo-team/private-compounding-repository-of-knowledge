import { Enum } from "typescript-string-enums"

import { assert_from } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import { assertꓽshape, isꓽobjectⵧkv } from "@monorepo-private/type-detection"

import { NodeType } from "./types.ts"
import type { Node, StrictNode, NodeLike } from "./types.ts"

/////////////////////////////////////////////////

function isꓽNodeLikeⵧnot_node($nodelike: Immutable<any>): $nodelike is Immutable<Exclude<NodeLike, Node>>
function isꓽNodeLikeⵧnot_node($nodelike: any): $nodelike is Exclude<NodeLike, Node>
function isꓽNodeLikeⵧnot_node($nodelike: Immutable<any>): $nodelike is Immutable<Exclude<NodeLike, Node>> {
	switch (typeof $nodelike) {
		case "string":
		case "number":
			return true
		default:
			return false
	}
}

// critical helper, needed too much
function getꓽdisplay_type($nodelike: Immutable<NodeLike>): "inline" | "block" {
	if (isꓽNodeLikeⵧnot_node($nodelike)) {
		return "inline"
	}

	if ($nodelike.$type && $nodelike.$type !== "auto") {
		return [
			// classic "inline"
			"strong",
			"em",
			"weak",
			"emoji",
			"fragmentⵧinline",
			// bit special, must be a line for Markdown
			"_h",
			// bit special as well, is a "void" element in HTML
			"br",
		].includes($nodelike.$type)
			? "inline"
			: "block"
	}

	// no type or "auto"

	if (Array.isArray($nodelike.$content)) return "block"

	if ($nodelike.$heading) return "block"

	return "inline"
}

// with all fields, even optionals
const $EXAMPLE_COMPLETE_NODE: StrictNode = {
	$v: 1,
	$type: "fragmentⵧblock",
	$heading: "Some title",
	$content: ["Hello, ⎨⎨target⎬⎬!"],
	$refs: {
		target: "World",
	},
	$classes: ["foo"],
	$hints: {
		possible_emoji: "👋",
	},
}

// Adapt the reference value to match the candidate's type,
// so that assertꓽshape's "simple" type_match doesn't reject valid NodeLike variants (number vs string).
function _adaptꓽNodeLikeꓽref(candidate_value: unknown, candidate?: Immutable<NodeLike>): NodeLike | NodeLike[] {
	if (typeof candidate_value === "number") return 0
	if (typeof candidate_value === "string") return "demo"
	if (candidate && getꓽdisplay_type(candidate) === "block") return ["Hello, ⎨⎨target⎬⎬!"] // mandatory array

	if (isꓽobjectⵧkv(candidate_value)) return { $content: "Hello, ⎨⎨target⎬⎬!" } // allowed

	//if (Array.isArray(candidate_value)) return [] as Array<NodeLike>

	return "Hello, ⎨⎨target⎬⎬!"
}

// This is a complex structure with dependencies between properties
// we centralize the internal assertions.
// To be used internally before/after node manipulations
// is part of assertꓽNode / isꓽNode, beware of loops
function assertꓽNodeInvariants(candidate: Immutable<Node>): asserts candidate is Immutable<Node>
function assertꓽNodeInvariants(candidate: Node): asserts candidate is Node
function assertꓽNodeInvariants(candidate: Immutable<Node>): asserts candidate is Immutable<Node> {
	const ǃ = assert_from({ assertꓽNodeInvariants })
	ǃ.forⵧparam({ candidate }).require(!!candidate, "should be defined")

	if (candidate.$type === "br") {
		// convenient, prevent the renderers from having to do special handling
		ǃ.forⵧparam({ candidate }).require(
			candidate.$content === "\n",
			"a br node should have CR content. You should note create them manually, use {{br}}",
		)
	}

	if (candidate.$type === "hr") {
		// no content, this one is too special
		ǃ.forⵧparam({ candidate }).require(
			!candidate.$content,
			"a hr node should have NO content. You should note create them manually, use {{hr}}",
		)
	}

	if (candidate.$heading) {
		ǃ.require(
			getꓽdisplay_type(candidate.$heading) === "inline",
			`$heading content should be inline (think markdown)!`,
		)
	}

	if (getꓽdisplay_type(candidate) === "block") {
		ǃ.require(
			Array.isArray(candidate.$content) || !candidate.$content,
			"block nodes $content must have a block shape",
		)
	} else {
		ǃ.require(!Array.isArray(candidate.$content), "inline nodes $content must NOT have a block shape")
	}
}

function assertꓽNode(candidate: Immutable<Node>): asserts candidate is Immutable<Node>
function assertꓽNode(candidate: Node): asserts candidate is Node
function assertꓽNode(candidate: Immutable<Node>): asserts candidate is Immutable<Node> {
	assertꓽNodeInvariants(candidate)

	const reference: Record<string, any> = {
		...$EXAMPLE_COMPLETE_NODE,
	}
	// adapt the reference
	if (!candidate?.$heading) {
		reference["$heading"] = null
	} else {
		reference["$heading"] = _adaptꓽNodeLikeꓽref(candidate?.$heading)
	}
	reference["$content"] = _adaptꓽNodeLikeꓽref(candidate?.$content, candidate)

	assertꓽshape(reference, candidate, {
		// "Node" is quite loose, so we only expect at least 1 prop
		match_reference_props: "some",
		// but no extra prop
		allow_extra_props: false,
	})

	const ǃ = assert_from({ assertꓽNode })

	// validate $type against the enum if present
	if (candidate["$type"] !== undefined && candidate["$type"] !== "auto") {
		ǃ.forⵧparam({ candidate }).require(
			Enum.isType(NodeType, candidate["$type"]),
			`Node type should be an allowed value "${candidate["$type"]}"!`,
		)
	}
}

function isꓽNode(node: Immutable<any>): node is Immutable<Node>
function isꓽNode(node: any): node is Node
function isꓽNode(node: Immutable<any>): node is Immutable<Node> {
	// shortcut to not trigger the assertion debug
	if (Array.isArray(node)) {
		// common case of checking the $content
		return false
	}
	if (!node || !isꓽobjectⵧkv(node)) {
		return false
	}

	try {
		assertꓽNode(node)
		return true
	} catch (err) {
		return false
	}
}

function isꓽNodeLike($nodelike: Immutable<any>): $nodelike is Immutable<NodeLike>
function isꓽNodeLike($nodelike: any): $nodelike is NodeLike
function isꓽNodeLike($nodelike: Immutable<any>): $nodelike is Immutable<NodeLike> {
	if (isꓽNodeLikeⵧnot_node($nodelike)) return true

	return isꓽNode($nodelike)
}

/////////////////////////////////////////////////

export {
	$EXAMPLE_COMPLETE_NODE,
	isꓽNodeLikeⵧnot_node,
	getꓽdisplay_type,
	assertꓽNodeInvariants,
	assertꓽNode,
	isꓽNode,
	isꓽNodeLike,
}
