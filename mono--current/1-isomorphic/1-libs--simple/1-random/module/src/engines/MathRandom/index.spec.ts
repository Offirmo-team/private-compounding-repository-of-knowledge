import { describe, expect } from "vitest"

import { itᐧshouldᐧbeᐧaᐧvalidᐧengine } from "../__fixtures/_shared.ts"

import { getꓽRNGⵧMathᐧrandom } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/random", () => {
	describe("engines", () => {
		describe("Math.random()", () => {
			itᐧshouldᐧbeᐧaᐧvalidᐧengine(getꓽRNGⵧMathᐧrandom)
		})
	})
})
