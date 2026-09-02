// Reminder: code will be prettified, no need to indent or format it.
// put the comments in the code, it's up to the consumer to optimize or not

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽdirⵧfiles_to_serve } from "../selectors/index.ts"
import type { WebPropertySpec, FilesMap } from "../types.ts"

import generateꓽhost_specific from "./generate--host-specific/index.ts"
import generateꓽhumansᐧtxt from "./generate--humans-txt/index.ts"
import generateꓽrobotsᐧtxt from "./generate--robots-txt/index.ts"

/////////////////////////////////////////////////

// Well-known https://en.wikipedia.org/wiki/Well-known_URI
function generate(spec: Immutable<WebPropertySpec>): FilesMap {
	return {
		[`${getꓽdirⵧfiles_to_serve(spec)}/humans.txt`]: generateꓽhumansᐧtxt(spec),
		[`${getꓽdirⵧfiles_to_serve(spec)}/robots.txt`]: generateꓽrobotsᐧtxt(spec),
		[`${getꓽdirⵧfiles_to_serve(spec)}/ads.txt`]: `placeholder, placeholder, DIRECT, placeholder`, // https://en.wikipedia.org/wiki/Ads.txt
		[`${getꓽdirⵧfiles_to_serve(spec)}/trust.txt`]: `datatrainingallowed=no`, // https://journallist.net/reference-document-for-trust-txt-specifications
		[`${getꓽdirⵧfiles_to_serve(spec)}/webhook-authorized-senders.json`]: JSON.stringify({
			// https://intempus.dk/webhook-authorization
			"authorized-senders": [],
		}),
		//[`${getꓽdirⵧfiles_to_serve(spec)}/funding.json`]: TODO https://fundingjson.org/

		...generateꓽhost_specific(spec),
	}
}

/////////////////////////////////////////////////

export default generate
