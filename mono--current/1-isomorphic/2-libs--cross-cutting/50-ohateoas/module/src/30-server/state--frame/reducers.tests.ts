import { expect } from "chai"

import { LIB } from "./consts.ts"
import { create, navigate_to } from "./reducers.ts"
import { getꓽSXC } from "./sec.ts"

/////////////////////////////////////////////////

describe(`OHATEOAS -- state--frame`, function () {
	describe("create()", function () {
		it("should work", () => {
			create()
		})
	})

	describe("navigate_to()", function () {
		it("should work", () => {
			navigate_to(create(), { href: "/foo" })
		})
	})
})
