import type { Immutable } from "@monorepo-private/ts--types"

import type { CssⳇFilterSpec } from "./types.ts"

/////////////////////////////////////////////////

function getꓽCssⳇfilter__value(filter_spec: Immutable<CssⳇFilterSpec>): string {
	if (filter_spec.length === 0) return "none"

	return filter_spec.map(([func, value]) => `${func}(${String(value)})`).join(" ")
}

/////////////////////////////////////////////////

export { getꓽCssⳇfilter__value }
