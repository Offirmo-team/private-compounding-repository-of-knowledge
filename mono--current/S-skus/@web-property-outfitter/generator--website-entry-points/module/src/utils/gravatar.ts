import { createHash } from "node:crypto"

import { type Url‿str, type Email‿str } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

// https://docs.gravatar.com/api/avatars/node/
function getꓽgravatar_url(email: Email‿str, { size‿px = 256 } = {}): Url‿str {
	// Step 1: Hash your email address using SHA-256
	const email‿sha256 = createHash("sha256").update(email).digest("hex")
	// Step 2: Construct the Gravatar URL.
	return `https://www.gravatar.com/avatar/${email‿sha256}?s=${size‿px}`
}

/////////////////////////////////////////////////

export { getꓽgravatar_url }
