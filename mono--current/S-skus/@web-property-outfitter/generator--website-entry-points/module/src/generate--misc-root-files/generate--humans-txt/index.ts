import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽauthor__name, getꓽauthor__intro, getꓽcontactⵧhuman } from "../../selectors/index.ts"
import type { WebPropertySpec } from "../../types.ts"

/////////////////////////////////////////////////

function generate(spec: Immutable<WebPropertySpec>): string {
	// ## Credits
	// (TODO one day: SBoM)

	return `
# https://humanstxt.org/

## Author
Hi, I'm ${getꓽauthor__name(spec)}, ${getꓽauthor__intro(spec) || "creator"}.

If you need to get in touch: ${getꓽcontactⵧhuman(spec)}.
`.trimStart()
}

/////////////////////////////////////////////////

export default generate
export { generate }
