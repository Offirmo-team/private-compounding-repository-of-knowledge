import { describe, it, expect, expectTypeOf } from "vitest"

import { poll } from "./index.ts"

describe("@monorepo-private/poll", () => {
	it("resolves (zalgo) immediately if the predicate is already truthy", async () => {
		await expect(poll(() => true)).resolves.toBe(true)
	})

	it("resolves with the first truthy value returned by the predicate", async () => {
		const values = [undefined, 0, "", "found", "too late"]
		let call_count = 0

		await expect(poll(() => values[call_count++], { periodMs: 5, timeoutMs: 1000 })).resolves.toBe("found")
	})

	it("is typed with the truthy part of the predicate's return type", () => {
		expectTypeOf(poll(() => true as boolean)).resolves.toEqualTypeOf<true>()
		expectTypeOf(poll(() => "foo" as string | undefined)).resolves.toEqualTypeOf<string>()
	})

	it("rejects on timeout, with the debugId in the error message", async () => {
		const promise = poll(() => false, { periodMs: 10, timeoutMs: 50, debugId: "test-timeout" })

		await expect(promise).rejects.toBeInstanceOf(Error)
		await expect(promise).rejects.toThrow("Timed out")
		await expect(promise).rejects.toThrow("test-timeout")
	})

	it("rejects as soon as the predicate throws, without waiting for the timeout", async () => {
		const error = new Error("boom")
		let call_count = 0

		await expect(
			poll(
				() => {
					call_count++
					if (call_count >= 2) throw error
					return false
				},
				{ periodMs: 5, timeoutMs: 60_000 },
			),
		).rejects.toBe(error)
	})

	it("rejects (instead of throwing synchronously) when the predicate throws on the early check", async () => {
		const error = new Error("boom")

		const promise = poll(() => {
			throw error
		})

		await expect(promise).rejects.toBe(error)
	})

	it("stops polling once settled", async () => {
		let call_count = 0

		await poll(() => ++call_count >= 2, { periodMs: 5, timeoutMs: 1000 })
		const call_count_when_settled = call_count
		await new Promise((resolve) => setTimeout(resolve, 50))

		expect(call_count).toBe(call_count_when_settled)
	})

	it("respects the periodMs interval", async () => {
		let call_count = 0
		const start = Date.now()
		await poll(() => ++call_count >= 5, { periodMs: 20, timeoutMs: 2000 })
		const elapsed = Date.now() - start
		// 5 checks at 20ms intervals = at least ~80ms (first check is immediate, then 4 intervals)
		expect(elapsed).toBeGreaterThanOrEqual(60) // some tolerance
	})
})
