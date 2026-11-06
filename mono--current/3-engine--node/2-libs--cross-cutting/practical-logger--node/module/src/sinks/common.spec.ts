/////////////////////////////////////////////////

describe(`${LIB} / sinks - common`, () => {
	describe("LEVEL_TO_ASCII", () => {
		it("should be correct", () => {
			expect(Object.keys(LEVEL_TO_ASCII).sort().join(",")).toBe([...ALL_LOG_LEVELS].sort().join(","))
		})
	})

	describe("LEVEL_TO_STYLIZE", () => {
		it("should be correct", () => {
			expect(Object.keys(LEVEL_TO_STYLIZE).sort().join(",")).toBe([...ALL_LOG_LEVELS].sort().join(","))
		})
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import { ALL_LOG_LEVELS } from "@monorepo-private/practical-logger--core"

import { LIB } from "../consts.ts"

import { LEVEL_TO_ASCII, LEVEL_TO_STYLIZE } from "./common.ts"
