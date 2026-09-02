import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import { isꓽobjectⵧliteral } from "@monorepo-private/type-detection"

import type { OHAHyperLink, OHAHyperActionBlueprint } from "./types.js"

/////////////////////////////////////////////////

function isꓽOHAHyperLink(x: Immutable<any>): x is OHAHyperLink {
	if (!isꓽobjectⵧliteral(x)) return false

	return Object.hasOwn(x, "href")
}

function isꓽOHAHyperActionBlueprint(x: Immutable<any>): x is OHAHyperActionBlueprint {
	if (!isꓽobjectⵧliteral(x)) return false

	return !isꓽOHAHyperLink(x)
}

/////////////////////////////////////////////////

export { isꓽOHAHyperLink, isꓽOHAHyperActionBlueprint }
