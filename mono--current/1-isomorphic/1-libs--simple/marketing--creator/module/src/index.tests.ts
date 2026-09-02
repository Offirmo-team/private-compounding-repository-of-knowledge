import { expectㆍtoㆍbeㆍaㆍvalidㆍAuthor } from "@monorepo-private/ts--types--hypermedia/_expect"

import { AUTHOR } from "./index.ts"

/////////////////////////////////////////////////

describe(`marketing--creator`, function () {
	describe(`AUTHOR`, function () {
		it("should be valid", () => {
			expectㆍtoㆍbeㆍaㆍvalidㆍAuthor(AUTHOR)
		})
	})
})
