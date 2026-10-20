import { describe, it, expect } from "vitest"

import { getꓽRNGⵧISAAC32 } from "@monorepo-private/random"

import { generate_uuid, UUID_LENGTH } from "./index.ts"

describe("@monorepo-private/uuid - generate", () => {
	describe("generate_uuid()", () => {
		describe("when provided a random generator", () => {
			it("should return correct uuids", () => {
				const rng = getꓽRNGⵧISAAC32().seed(123)

				for (let i = 0; i < 10; ++i) {
					const uuid = generate_uuid({ rng })
					//console.log(uuid)
					expect(uuid).toBeTypeOf("string")
					expect(uuid).toHaveLength(UUID_LENGTH)
					expect(uuid.startsWith("uu1")).toBe(true)
				}
			})
		})

		describe("when NOT provided a random generator", () => {
			it("should return correct uuids", () => {
				for (let i = 0; i < 10; ++i) {
					const uuid = generate_uuid()
					//console.log(uuid)
					expect(uuid).toBeTypeOf("string")
					expect(uuid).toHaveLength(UUID_LENGTH)
					expect(uuid.startsWith("uu1")).toBe(true)
				}
			})
		})
	})
})
