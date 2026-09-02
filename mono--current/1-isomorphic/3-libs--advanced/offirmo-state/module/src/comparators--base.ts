import * as jsondiffpatch from "jsondiffpatch"
import memoize_one from "memoize-one"

import type { Immutable, JSONObject } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const _getꓽadvanced_json_differ = memoize_one(() => {
	const advanced_json_differ = jsondiffpatch.create({
		// method used to match objects when diffing arrays
		// by default === operator is used
		objectHash: (obj: any) => JSON.stringify(obj), // TODO use stable stringify?
	})

	return advanced_json_differ
})

// used only in tests
function getꓽjson_difference(a: Immutable<any>, b: Immutable<any>): JSONObject {
	// TODO assert params JSON objects?
	return _getꓽadvanced_json_differ().diff(a, b) as any // hide the proprietary return type, not needed for now
}

/////////////////////////////////////////////////

export { getꓽjson_difference }
