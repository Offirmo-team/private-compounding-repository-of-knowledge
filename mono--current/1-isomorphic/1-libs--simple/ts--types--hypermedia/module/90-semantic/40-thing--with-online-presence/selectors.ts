import { assert_from, assert } from "@monorepo-private/assert"
import { normalize_unicode, normalizeꓽemailⵧsafe, normalizeꓽurl } from "@monorepo-private/normalize-string"
import type { Immutable } from "@monorepo-private/ts--types"

import type { Url‿str } from "../../01-links/index.ts"
import * as ThingSelectors from "../30-thing/selectors.ts"

import type { ThingWithOnlinePresence } from "./types.ts"

/////////////////////////////////////////////////
// ThingWithOnlinePresence extends Thing, WithOnlinePresence
export * from "../10-with-online-presence/selectors.ts"
export * from "../30-thing/selectors.ts"

/////////////////////////////////////////////////

// should not be called "naked", this is a fallback for a semantic contact need
function _getꓽcontact(thing: Immutable<ThingWithOnlinePresence>): Url‿str {
	if (thing.contact) return normalizeꓽurl(thing.contact)

	const url = thing.contact || ThingSelectors.getꓽauthor__contact(thing)
	assert(url, "Thing: should have at last a point of contact!")
	return url
}

// this is for contacting the HUMAN
function getꓽcontactⵧhuman(thing: Immutable<ThingWithOnlinePresence>): Url‿str {
	return ThingSelectors.getꓽauthor__contact(thing) ?? _getꓽcontact(thing)
}

function getꓽcontactⵧsecurity(thing: Immutable<ThingWithOnlinePresence>): Url‿str {
	return thing.contactⵧsecurity ? normalizeꓽurl(thing.contactⵧsecurity) : _getꓽcontact(thing)
}

function getꓽcontactⵧsupport(thing: Immutable<ThingWithOnlinePresence>): Url‿str {
	return thing.contactⵧsupport ? normalizeꓽurl(thing.contactⵧsupport) : _getꓽcontact(thing)
}

/////////////////////////////////////////////////

export { getꓽcontactⵧhuman, getꓽcontactⵧsecurity, getꓽcontactⵧsupport }
