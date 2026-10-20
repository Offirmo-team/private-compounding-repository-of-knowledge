import { describe, it, expect } from "vitest"

import { elapsed_time_ms } from "./awaitable.ts"
import { forArray } from "./promises.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/utils--async", () => {
	describe("promises", () => {
		describe("PromiseArray()", () => {
			describe(".resolveSequentially()", () => {
				it("should work with an empty array", async () => {
					await forArray([]).executeSequentially(async () => {})
				})

				it("should work with a single element", async () => {
					await forArray([42]).executeSequentially(async () => {})
				})

				it("should work in a complex case", async () => {
					const callLog = ["start"] as string[]
					await forArray(["foo", "bar", "baz"]).executeSequentially(async (s, i) => {
						callLog.push(`starting to resolve ` + s)
						await elapsed_time_ms(100 - i * 30)
						callLog.push(`finishing to resolve ` + s)
					})
					callLog.push(`stop`)
					expect(callLog).toStrictEqual([
						"start",
						"starting to resolve foo",
						"finishing to resolve foo",
						"starting to resolve bar",
						"finishing to resolve bar",
						"starting to resolve baz",
						"finishing to resolve baz",
						"stop",
					])
				})
			})
		})
	})
})
