import {
	normalize,
	normalize_unicode,
	capitalizeⵧfirst,
	to_lower_case,
	trim,
	coerce_blanks_to_single_spaces,
	coerce_delimiters_to_space,
} from "@monorepo-private/normalize-string"
import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable, WithHints } from "@monorepo-private/ts--types"
import { getꓽuriⵧnormalized‿str } from "@monorepo-private/ts--types--hypermedia"

import { promote_toꓽOHAHyperLink } from "../01-types/selectors.ts"
import { isꓽOHAHyperLink, isꓽOHAHyperActionBlueprint } from "../01-types/type-guards.ts"
import { OHALinkRelation } from "../01-types/types.ts"
import type {
	OHARichTextHints,
	OHAHyperMedia,
	OHAHyperActionBlueprint,
	OHAHyperLink,
	OHAPendingEngagement,
} from "../01-types/types.ts"

/////////////////////////////////////////////////

function getꓽcta(hyper: OHAHyperLink | OHAHyperActionBlueprint | string): RichText.NodeLike {
	let is_code = false

	let candidate: string = (() => {
		if (typeof hyper === "string") {
			switch (hyper) {
				case OHALinkRelation.self:
					return "Reload"
				default:
					return hyper
			}
		}

		const { hints = {} } = hyper
		if (hints.cta) return RichText.renderⵧto_text(hints.cta)

		if (isꓽOHAHyperLink(hyper)) {
			const { rel = [], href } = hyper
			const candidates =
				// trying to find an expressive relation
				rel.filter((r) => r !== OHALinkRelation.continueᝍto && r !== OHALinkRelation.self)
			if (candidates.length === 0) is_code = true
			return candidates[0] ?? getꓽuriⵧnormalized‿str(href) // fallback on the URL itself
		}

		// it's an action
		const { type } = hyper
		return type
	})()

	if (is_code) return candidate // raw

	candidate = normalize(
		candidate,
		normalize_unicode,
		coerce_delimiters_to_space,
		coerce_blanks_to_single_spaces,
		trim,
		//to_lower_case,
		capitalizeⵧfirst,
	)

	if (isꓽOHAHyperActionBlueprint(hyper)) {
		const { hints = {} } = hyper
		switch (hints.change_type) {
			case "none":
				break
			case "create":
				candidate = "🆕 " + candidate
				break
			case "delete":
				candidate = "❌ " + candidate
				break
			case "update":
				candidate = "❇️ " + candidate
				break
			case "upgrade":
				candidate = "✳️ " + candidate
				break
			case "permission":
				candidate = "🪪 " + candidate
				break

			case "reduce":
			// fallthrough
			default:
				candidate = "▶️ " + candidate
				break
		}
	}

	return candidate
}

function getꓽlink‿str(link: Immutable<OHAHyperLink>): string {
	const { href, rel = [], target = "_self", hints = {} } = link
	return `"${href}" [${rel.join(", ")}]  🎯${target}`
}

function getꓽhints(repr: Immutable<OHAHyperMedia>): Immutable<OHARichTextHints> {
	const { $hints = {} } = repr as any
	return $hints
}

function getꓽengagements(repr: Immutable<OHAHyperMedia>): Immutable<Array<OHAPendingEngagement>> {
	const { engagements = [] } = getꓽhints(repr)

	return engagements
}

function getꓽlinks(
	repr: Immutable<OHAHyperMedia>,
	{ filter_outꓽtechnical = false }: { filter_outꓽtechnical?: boolean } = {},
): Record<string, Immutable<OHAHyperLink>> {
	const { links = {} } = getꓽhints(repr)

	return Object.fromEntries(
		Object.entries(links)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.filter(([k, l]) => {
				if (filter_outꓽtechnical) {
					return (
						true &&
						k !== OHALinkRelation.self && // "reload"
						k !== OHALinkRelation.home
					) // "home"
				}

				return true
			})
			.map(([k, l]) => [k, promote_toꓽOHAHyperLink(l, { rel: [k as OHALinkRelation] })]),
	)
}

function getꓽaction_blueprints(repr: Immutable<OHAHyperMedia>): Immutable<Record<string, OHAHyperActionBlueprint>> {
	const { actions = {} } = getꓽhints(repr)
	return actions
}

/////////////////////////////////////////////////

export { getꓽcta, getꓽlink‿str, getꓽhints, getꓽengagements, getꓽlinks, getꓽaction_blueprints }
