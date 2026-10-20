import { describe, it, expect, expectTypeOf } from "vitest"

import type { UUID, WithUUID } from "./types.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/uuid - types", () => {
	it("should allow extending WithUUID", () => {
		interface Test extends WithUUID {
			another: UUID
		}

		expectTypeOf<Test>().toHaveProperty("uuid").toEqualTypeOf<UUID>()
		expectTypeOf<Test>().toHaveProperty("another").toEqualTypeOf<UUID>()
		expectTypeOf<Test>().toExtend<WithUUID>()

		const test: Test = { uuid: "uu1", another: "uu1" }
		// @ts-expect-error uuid is readonly
		test.uuid = "uu2"
	})
})
