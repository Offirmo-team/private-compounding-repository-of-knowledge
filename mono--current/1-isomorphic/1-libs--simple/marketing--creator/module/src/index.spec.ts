import { describe, it, expect } from "vitest"

import { expectㆍtoㆍbeㆍaㆍvalidㆍCreator } from "@monorepo-private/ts--types--hypermedia/_expect"

import { CREATOR } from "./index.ts"

/////////////////////////////////////////////////

describe(`marketing--creator`, () => {
	describe(`CREATOR`, () => {
		it("should be valid", () => {
			expectㆍtoㆍbeㆍaㆍvalidㆍCreator(CREATOR)
		})
	})
})
