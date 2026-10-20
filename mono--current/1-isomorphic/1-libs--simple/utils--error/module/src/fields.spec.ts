import { describe, it, expect } from "vitest"

import { QUASI_STANDARD_ERROR_FIELDS, COMMON_ERROR_FIELDS } from "./fields.ts"

describe(`@monorepo-private/utils--error`, () => {
	describe("fields", () => {
		describe("QUASI_STANDARD_ERROR_FIELDS", () => {
			it("should be healthy", () => {
				expect(QUASI_STANDARD_ERROR_FIELDS.has("message")).toBe(true)
				expect(QUASI_STANDARD_ERROR_FIELDS.has("name")).toBe(true)
				expect(QUASI_STANDARD_ERROR_FIELDS.has("stack")).toBe(true)
			})
		})

		describe("COMMON_ERROR_FIELDS", () => {
			it("should contain the standard error fields", () => {
				for (let field of QUASI_STANDARD_ERROR_FIELDS.keys()) {
					expect(QUASI_STANDARD_ERROR_FIELDS.has(field)).toBe(true)
					expect(COMMON_ERROR_FIELDS.has(field)).toBe(true)
				}
			})

			it("should contain extra fields", () => {
				expect(COMMON_ERROR_FIELDS.size).toBeGreaterThan(QUASI_STANDARD_ERROR_FIELDS.size)
			})
		})
	})
})
