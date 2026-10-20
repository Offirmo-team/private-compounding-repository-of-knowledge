import { describe, it, expect } from "vitest"

import promiseTry from "@monorepo-private/promise-try"

describe("@monorepo-private/promise-try", () => {
	it("should work - resolution", async () => {
		await expect(promiseTry(() => 42)).resolves.toBe(42)
	})

	it("should work - rejection", async () => {
		const test_error = new Error("Foo!")

		await expect(
			promiseTry(() => {
				throw test_error
			}),
		).rejects.toBe(test_error)
	})
})
