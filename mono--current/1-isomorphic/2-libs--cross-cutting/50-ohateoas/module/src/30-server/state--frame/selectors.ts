import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import { type Url‿str } from "@monorepo-private/ts--types--hypermedia"

import { OHALinkRelation } from "../../01-types/index.ts"
import { getꓽlinks, getꓽlink‿str } from "../../10-representation/index.ts"

import type { State } from "./types.js"

/////////////////////////////////////////////////

function getꓽurlⵧself(state: Immutable<State>): Url‿str {
	if (state.$representation) {
		const links = getꓽlinks(state.$representation)
		if (OHALinkRelation.self in links) {
			return getꓽlink‿str(links[OHALinkRelation.self]!)
		}
	}

	return state.urlⵧload
}

/*
function getꓽurl_for_display(state: Immutable<State>): Url‿str {
	return state.urlⵧself || state.urlⵧload
}
*/

/////////////////////////////////////////////////

export { getꓽurlⵧself }
