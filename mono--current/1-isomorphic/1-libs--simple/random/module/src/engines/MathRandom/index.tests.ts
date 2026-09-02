import { itᐧshouldᐧbeᐧaᐧvalidᐧengine } from "../__fixtures/_shared.ts"

import { getꓽRNGⵧMathᐧrandom } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/random", function () {
	describe("engines", function () {
		describe("Math.random()", function () {
			itᐧshouldᐧbeᐧaᐧvalidᐧengine(getꓽRNGⵧMathᐧrandom)
		})
	})
})
