/////////////////////////////////////////////////

describe(`${LIB} - core`, () => {
	describe("create()", () => {
		it("should work with no params", () => {
			const logger = create()
			logger.fatal("Hello!")
		})
	})

	describe("checkLevel()", () => {
		it("should throw if not a level", () => {
			expect(() => checkLevel("foo")).toThrow("Not a valid log level")
		})
	})

	// TODO should be compatible with bunyan
	// https://github.com/trentm/node-bunyan#log-record-fields
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import { LIB } from "./consts.ts"
import { create, checkLevel } from "./core.ts"
