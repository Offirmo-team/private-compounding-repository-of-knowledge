import { expect } from "chai"

import { ALL_LOG_LEVELS } from "@monorepo-private/practical-logger--core"

import { LIB } from "../../consts.ts"

import { LEVEL_TO_COLOR_STYLE } from "./common.ts"

describe(`${LIB} / sinks / advanced - common`, () => {
	describe("LEVEL_TO_COLOR_STYLE", () => {
		it("should be correct", () => {
			expect(Object.keys(LEVEL_TO_COLOR_STYLE).sort().join(",")).to.equal([...ALL_LOG_LEVELS].sort().join(","))
		})
	})
})
