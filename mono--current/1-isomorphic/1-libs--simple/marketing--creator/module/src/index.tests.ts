import { expectㆍtoㆍbeㆍaㆍvalidㆍCreator } from "@monorepo-private/ts--types--hypermedia/_expect"

import { CREATOR } from "./index.ts"

/////////////////////////////////////////////////

describe(`marketing--creator`, function () {
	describe(`CREATOR`, function () {
		it("should be valid", () => {
			expectㆍtoㆍbeㆍaㆍvalidㆍCreator(CREATOR)
		})
	})
})
