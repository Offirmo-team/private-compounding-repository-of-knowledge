import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import { isꓽdebug } from "../selectors/index.ts"
import type { WebPropertySpec } from "../types.ts"

/////////////////////////////////////////////////

function ifꓽdebug(spec: Immutable<WebPropertySpec>) {
	return {
		prefixꓽwith(prefix: string, str: string): string {
			return `${isꓽdebug(spec) ? prefix : ""}${str}`
		},
	}
}

/////////////////////////////////////////////////

export { ifꓽdebug }
