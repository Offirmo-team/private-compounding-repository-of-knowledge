import * as jsondiffpatch from "jsondiffpatch"
import memoize_once from "memoize-one"

import type { Immutable, JsonⳇObject } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

// @ts-ignore "memoize-one" has a type declaration issue as of 2026/10
const _getꓽadvanced_json_differ = memoize_once(() => {
	const advanced_json_differ = jsondiffpatch.create({
		// method used to match objects when diffing arrays
		// by default === operator is used
		objectHash: (obj: any) => JSON.stringify(obj), // TODO use stable stringify?
	})

	return advanced_json_differ
})

// used only in tests
function getꓽjson_difference(a: Immutable<any>, b: Immutable<any>): JsonⳇObject {
	// TODO assert params JSON objects?
	return _getꓽadvanced_json_differ().diff(a, b) as any // hide the proprietary return type, not needed for now
}

/////////////////////////////////////////////////

export { getꓽjson_difference }
