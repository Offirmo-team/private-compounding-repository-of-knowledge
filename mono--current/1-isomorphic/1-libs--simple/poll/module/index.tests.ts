import { expect } from "chai"

import { poll } from "./index.ts"

describe("[Claude code] @monorepo-private/poll", function () {
	it("should resolve immediately if predicate is already true", async () => {
		const result = await poll(() => true)
		expect(result).to.be.true
	})

	it("should resolve when predicate becomes true after some polls", async () => {
		let count = 0
		const result = await poll(
			() => {
				count++
				return count >= 3
			},
			{ periodMs: 10, timeoutMs: 1000 },
		)
		expect(result).to.be.true
		expect(count).to.be.gte(3)
	})

	it("should reject on timeout", async () => {
		try {
			await poll(() => false, { periodMs: 10, timeoutMs: 50, debugId: "test-timeout" })
			expect.fail("should have thrown")
		} catch (err: any) {
			expect(err).to.be.an.instanceOf(Error)
			expect(err.message).to.include("Timed out")
			expect(err.message).to.include("test-timeout")
		}
	})

	it("should use the debugId in error messages", async () => {
		try {
			await poll(() => false, { periodMs: 10, timeoutMs: 50, debugId: "my-custom-id" })
			expect.fail("should have thrown")
		} catch (err: any) {
			expect(err.message).to.include("my-custom-id")
		}
	})

	it("should respect periodMs interval", async () => {
		let call_count = 0
		const start = Date.now()
		await poll(
			() => {
				call_count++
				return call_count >= 5
			},
			{ periodMs: 20, timeoutMs: 2000 },
		)
		const elapsed = Date.now() - start
		// 5 checks at 20ms intervals = at least ~80ms (first check is immediate, then 4 intervals)
		expect(elapsed).to.be.gte(60) // some tolerance
	})
})
