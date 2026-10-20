/////////////////////////////////////////////////

describe(`OHATEOAS -- state--frame`, () => {
	describe("create()", () => {
		it("should work", () => {
			create()
		})
	})

	describe("navigate_to()", () => {
		it("should work", () => {
			navigate_to(create(), { href: "/foo" })
		})
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import { create, navigate_to } from "./reducers.ts"
