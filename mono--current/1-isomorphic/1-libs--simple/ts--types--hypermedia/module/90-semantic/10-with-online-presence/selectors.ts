import { normalizeꓽurlⵧhttpₓ } from "@monorepo-private/normalize-string"
import type { Immutable } from "@monorepo-private/ts--types"

import type { Url‿str } from "../../01-links/index.ts"

import type { WithOnlinePresence } from "./types.ts"

/////////////////////////////////////////////////

function getꓽurlⵧcanonical(wop: Immutable<WithOnlinePresence>): Url‿str {
	return normalizeꓽurlⵧhttpₓ(wop.urlⵧcanonical)
}

/////////////////////////////////////////////////

export { getꓽurlⵧcanonical }
