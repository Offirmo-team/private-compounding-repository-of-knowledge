// Reminder: code will be prettified, no need to indent or format it.
// put the comments in the code, it's up to the consumer to optimize or not

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽdirⵧfiles_to_serve } from "../selectors/index.ts"
import type { WebPropertySpec, FilesMap } from "../types.ts"

import generateꓽsecurityᐧtxt from "./security-txt/index.ts"

/////////////////////////////////////////////////

// Well-known https://en.wikipedia.org/wiki/Well-known_URI
function generate(spec: Immutable<WebPropertySpec>): FilesMap {
	return {
		[`${getꓽdirⵧfiles_to_serve(spec)}/.well-known/security.txt`]: generateꓽsecurityᐧtxt(spec),
	}
}

/////////////////////////////////////////////////

export default generate
