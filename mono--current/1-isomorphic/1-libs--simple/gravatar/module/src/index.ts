/////////////////////////////////////////////////

// https://docs.gravatar.com/sdk/images/
export async function getꓽgravatar_url(email: Email‿str, { size‿px = 256 } = {}): Promise<Url‿str> {
	const ǃ = assert_from({ getꓽgravatar_url })
	ǃ.forⵧparam({ email }).require(!!email.trim(), "non-empty email")

	const normalized‿email = email.trim().toLowerCase() // spec https://docs.gravatar.com/rest/hash/
	const bytes = new TextEncoder().encode(normalized‿email)
	const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes)
	const email‿sha256 = Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("")

	// https://docs.gravatar.com/sdk/images/
	return `https://www.gravatar.com/avatar/${email‿sha256}?s=${size‿px}`
}

/////////////////////////////////////////////////

import { assert_from } from "@monorepo-private/assert"
import { type Url‿str, type Email‿str } from "@monorepo-private/ts--types--hypermedia"
