import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import {
	type Url‿str,
	getꓽuriⵧnormalized‿str as _getꓽuriⵧnormalized‿str,
	type Uri‿x,
} from "@monorepo-private/ts--types--hypermedia"

import { isꓽOHAHyperLink } from "./type-guards.ts"
import type { OHAⳇHyperLink, OHAⳇHyperLink‿x, OHAⳇLinkRelation } from "./types.ts"

/////////////////////////////////////////////////

// promote to the most expressive of "X"
function promote_toꓽOHAHyperLink(
	link: Immutable<OHAⳇHyperLink‿x>,
	hints: Immutable<Partial<Omit<OHAⳇHyperLink, "href">>> = {},
): Immutable<OHAⳇHyperLink> {
	if (isꓽOHAHyperLink(link))
		return {
			...link,
			rel: Array.from(new Set<OHAⳇLinkRelation>([...(link.rel ?? []), ...(hints.rel ?? [])]).values()).sort(),
		}

	return {
		...hints,
		href: link as Uri‿x, // TODO better TS discrimination
	}
}

function getꓽuriⵧnormalized‿str(link: Immutable<OHAⳇHyperLink‿x>): Url‿str {
	if (isꓽOHAHyperLink(link)) return _getꓽuriⵧnormalized‿str(link.href)

	return _getꓽuriⵧnormalized‿str(link as Uri‿x) // TODO better TS discrimination
}

/////////////////////////////////////////////////

export { promote_toꓽOHAHyperLink, getꓽuriⵧnormalized‿str }
