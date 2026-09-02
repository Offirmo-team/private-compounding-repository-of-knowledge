import { expect } from "chai"

import { ALL_LOG_LEVELS } from "@monorepo-private/practical-logger--core"

import { LIB } from "../consts.ts"

import { LEVEL_TO_CONSOLE_METHOD } from "./common.ts"

describe(`${LIB} / sinks - common`, () => {
	describe("LEVEL_TO_CONSOLE_METHOD", () => {
		it("should be correct", () => {
			expect(Object.keys(LEVEL_TO_CONSOLE_METHOD).sort().join(",")).to.equal([...ALL_LOG_LEVELS].sort().join(","))
		})
	})
})
