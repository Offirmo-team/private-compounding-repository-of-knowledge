import { describe, it, expect } from "vitest"

import { getꓽRNGⵧISAAC32 } from "@monorepo-private/random"

import { type UUID, type WithUUID, generate_uuid, xxx_test_unrandomize_element } from "./index.ts"

/////////////////////////////////////////////////

interface Test extends WithUUID {
	another: UUID
}

describe("@monorepo-private/uuid - utils", () => {
	describe("xxx_test_unrandomize_element()", () => {
		describe("when provided a uuid prop", () => {
			it("should turn it into a fixed value", () => {
				const rng = getꓽRNGⵧISAAC32().seed(123)

				const out: Readonly<Test> = {
					uuid: generate_uuid({ rng }),
					another: generate_uuid({ rng }),
				}

				const randomized: Readonly<Test> = xxx_test_unrandomize_element(out)

				expect(randomized.uuid).not.toBe(out.uuid)
				expect(randomized.another).toBe(out.another)
			})
		})
	})
})
