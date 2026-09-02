/////////////////////////////////////////////////
// Author extends WithOnlinePresence
export * from "../10-with-online-presence/selectors.ts"

/////////////////////////////////////////////////

export function getꓽname(author: Immutable<Author>): string {
	return normalize_unicode(author.name).trim()
}

export function getꓽintro(author: Immutable<Author>): string | undefined {
	return author.intro ? normalize_unicode(author.intro).trim() : `${getꓽname(author)}, author.`
}

export function getꓽemail(author: Immutable<Author>): Url‿str | undefined {
	return author.email ? normalizeꓽemailⵧsafe(author.email) : undefined
}

export function getꓽcontact(author: Immutable<Author>): Url‿str | undefined {
	if (author.contact) return normalizeꓽurl(author.contact)

	const email = getꓽemail(author)
	if (email) return normalizeꓽurl(`mailto:${email}`)

	return undefined
}

/////////////////////////////////////////////////

import { normalize_unicode, normalizeꓽemailⵧsafe, normalizeꓽurl } from "@monorepo-private/normalize-string"
import type { Immutable } from "@monorepo-private/ts--types"

import type { Url‿str } from "../../01-links/types.ts"

import type { Author } from "./types.ts"
