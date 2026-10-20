/////////////////////////////////////////////////

import { hello } from "./index.ts"

describe(`Lib`, function () {
	describe("hello()", function () {
		it("should work", () => {
			hello("world")
		})
	})
})

/////////////////////////////////////////////////

import { describe, it } from "mocha"
