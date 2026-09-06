import { assert_from, assert } from "@monorepo-private/assert"
import { normalize_unicode } from "@monorepo-private/normalize-string"
import type { Immutable } from "@monorepo-private/ts--types"

import * as AuthorSelectors from "../20-creator/selectors.ts"

import type { Thing } from "./types.ts"

/////////////////////////////////////////////////

function getꓽdescription(thing: Immutable<Thing>): string {
	assert(thing.caption, `should have a description`)
	return normalize_unicode(thing.caption).trim()
}

function getꓽauthor__name(thing: Immutable<Thing>): string {
	assert(thing.creator, `should have an author`)
	return AuthorSelectors.getꓽname(thing.creator)
}
function getꓽauthor__intro(thing: Immutable<Thing>): string | undefined {
	return thing.creator ? AuthorSelectors.getꓽintro(thing.creator) : undefined
}
function getꓽauthor__contact(thing: Immutable<Thing>): string | undefined {
	return thing.creator ? AuthorSelectors.getꓽcontact(thing.creator) : undefined
}

/////////////////////////////////////////////////

export { getꓽdescription, getꓽauthor__name, getꓽauthor__intro, getꓽauthor__contact }
