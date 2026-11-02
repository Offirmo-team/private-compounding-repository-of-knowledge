/////////////////////////////////////////////////

export function isꓽNodeⳇPromotable($nodelike: Immutable<any>): $nodelike is Immutable<NodeⳇPromotable>
export function isꓽNodeⳇPromotable($nodelike: any): $nodelike is NodeⳇPromotable
export function isꓽNodeⳇPromotable($nodelike: Immutable<any>): $nodelike is Immutable<NodeⳇPromotable> {
	switch (typeof $nodelike) {
		case "string":
		case "number":
			return true
		default:
			return false
	}
}

// critical helper, needed too much
export function getꓽdisplay_type($nodelike: Immutable<NodeⳇLike>): "inline" | "block" {
	if (isꓽNodeⳇPromotable($nodelike)) {
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

// This is a complex structure with dependencies between properties
// we centralize the internal assertions.
// To be used internally before/after node manipulations
// is part of assertꓽNode / isꓽNode, beware of loops
export function ǃꓽNodeInvariants(candidate: Immutable<Node>) {
	const ǃ = assert_from({ ǃꓽNodeInvariants })
	ǃ.forⵧparam({ candidate }).check(!!candidate, "should be defined")
	if (ǃ.hasꓽissues()) return ǃ

	if (candidate.$type === "br") {
		// convenient, prevent the renderers from having to do special handling
		ǃ.forⵧparam({ candidate }).check(
			candidate.$content === "\n",
			"a br node should have newline content. You should not create a br node manually, use {{br}}",
		)
	}

	if (candidate.$type === "hr") {
		// no content, this one is too special
		ǃ.forⵧparam({ candidate }).check(
			!candidate.$content,
			"a hr node should have NO content. You should not create a hr node manually, use {{hr}}",
		)
	}

	if (candidate.$heading) {
		ǃ.check(
			getꓽdisplay_type(candidate.$heading) === "inline",
			`$heading content should be inline (think markdown header)!`,
		)
	}

	if (getꓽdisplay_type(candidate) === "block") {
		ǃ.check(Array.isArray(candidate.$content) || !candidate.$content, "block nodes $content must have a block shape")
	} else {
		ǃ.check(!Array.isArray(candidate.$content), "inline nodes $content must NOT have a block shape")
	}

	return ǃ
}
export function assertꓽNodeInvariants(candidate: Immutable<Node>): asserts candidate is Immutable<Node>
export function assertꓽNodeInvariants(candidate: Node): asserts candidate is Node
export function assertꓽNodeInvariants(candidate: Immutable<Node>): asserts candidate is Immutable<Node> {
	const ǃ = ǃꓽNodeInvariants(candidate)
	ǃ.assertꓽno_issues()
}

function ǃꓽNode(candidate: Immutable<Node>) {
	const ǃ = assert_from({ ǃꓽNode })

	ǃ.issues.push(...ǃꓽNodeInvariants(candidate).issues)

	const reference: NodeⳇNormalized = (() => {
		// Adapt the reference value to match the candidate's type,
		// so that assertꓽshape's "simple" type_match doesn't reject valid NodeLike variants (number vs string).
		function _adaptꓽNodeLikeꓽref(candidate_subvalue: Immutable<NodeⳇLike>): NodeⳇLike {
			// NodeⳇPromotable
			if (typeof candidate_subvalue === "number") return 42
			if (typeof candidate_subvalue === "string") return "demo"

			// Node
			if (isꓽobjectⵧdefined_non_array(candidate_subvalue)) return { $content: "Hello, ⎨⎨target⎬⎬!" } // allowed

			throw new Error(`Unknown subvalue type: ${candidate_subvalue}`)
		}

		if (getꓽdisplay_type(candidate) === "block") {
			let reference = {
				...$EXAMPLE_COMPLETE_NODEⵧBLOCK,
			}
			// heading is optional
			reference["$heading"] = candidate?.$heading ? _adaptꓽNodeLikeꓽref(candidate?.$heading) : null
			return reference
		}

		let reference = {
			...$EXAMPLE_COMPLETE_NODEⵧINLINE,
		}
		// inline $content can be flexible
		reference.$content = candidate.$content ? _adaptꓽNodeLikeꓽref(candidate.$content as Immutable<NodeⳇLike>) : "foo"

		return reference
	})()
	ǃ.check(
		hasꓽshape(reference, candidate, {
			// "Node" is quite loose, so we only expect at least 1 prop
			match_reference_props: "some",
			// but no extra prop
			allow_extra_props: false,
		}),
		"should have correct shape",
	)

	// validate $type against the enum if present
	if (candidate["$type"] !== undefined && candidate["$type"] !== "auto") {
		ǃ.forⵧparam({ candidate }).check(
			Enum.isType(NodeType, candidate["$type"]),
			`Node type should be an allowed value "${candidate["$type"]}"!`,
		)
	}

	return ǃ
}

export function assertꓽNode(candidate: Immutable<Node>): asserts candidate is Immutable<Node>
export function assertꓽNode(candidate: Node): asserts candidate is Node
export function assertꓽNode(candidate: Immutable<Node>): asserts candidate is Immutable<Node> {
	const ǃ = ǃꓽNode(candidate)
	ǃ.assertꓽno_issues()
}

export function isꓽNode(node: Immutable<any>): node is Immutable<Node>
export function isꓽNode(node: any): node is Node
export function isꓽNode(node: Immutable<any>): node is Immutable<Node> {
	// shortcuts
	if (Array.isArray(node)) {
		// common case of checking the $content
		return false
	}
	if (!node || !isꓽobjectⵧdefined_non_array(node)) {
		return false
	}

	const ǃ = ǃꓽNode(node)
	return ǃ.hasꓽno_issues()
}

export function isꓽNodeLike($nodelike: Immutable<any>): $nodelike is Immutable<NodeⳇLike>
export function isꓽNodeLike($nodelike: any): $nodelike is NodeⳇLike
export function isꓽNodeLike($nodelike: Immutable<any>): $nodelike is Immutable<NodeⳇLike> {
	if (isꓽNodeⳇPromotable($nodelike)) return true

	return isꓽNode($nodelike)
}

/////////////////////////////////////////////////

import { Enum } from "typescript-string-enums"

import { assert_from } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import { hasꓽshape, isꓽobjectⵧdefined_non_array } from "@monorepo-private/type-detection"

import { $EXAMPLE_COMPLETE_NODEⵧBLOCK, $EXAMPLE_COMPLETE_NODEⵧINLINE } from "../__examples/index.ts"

import type { Node, NodeⳇPromotable, NodeⳇNormalized, NodeⳇLike } from "./types.ts"
import { NodeType } from "./types.ts"
