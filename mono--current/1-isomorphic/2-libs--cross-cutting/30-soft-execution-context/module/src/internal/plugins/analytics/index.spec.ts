/////////////////////////////////////////////////

describe(`${LIB} -- plugins -- analytics`, () => {
	beforeAll(_TEST_ONLY__reset_root_SXC)
	afterEach(_TEST_ONLY__reset_root_SXC)

	describe("setAnalyticsAndErrorDetails", () => {
		it("should work", () => {
			const SXC = getRootSXC()
			SXC.setAnalyticsAndErrorDetails({ v: "1.2.3" })
		})
	})

	describe("analytics event", () => {
		it("should be emitted", async () => {
			const SXC = getRootSXC()

			const seen = new Promise<void>((resolve, reject) => {
				SXC.emitter.on("analytics", function onAnalyticsEvent({ data: { eventId } }) {
					try {
						expect(eventId).toBe("foo")
						resolve()
					} catch (err) {
						reject(err)
					}
				})
			})
			SXC.fireAnalyticsEvent("foo")

			await seen
		})

		it("should have all the properties", async () => {
			const SXC = getRootSXC()

			SXC.setAnalyticsAndErrorDetails({ v: "1.2.3" })

			const seen = new Promise<void>((resolve, reject) => {
				SXC.emitter.on("analytics", function onAnalyticsEvent({ data: { details } }) {
					try {
						console.log(`XXX `, details)
						expect(details).toHaveProperty("v", "1.2.3")
						resolve()
					} catch (err) {
						reject(err)
					}
				})
			})
			SXC.fireAnalyticsEvent("foo")

			await seen
		})
	})
})

/////////////////////////////////////////////////

import { afterEach, beforeAll, describe, expect, it } from "vitest"

import { LIB } from "../../../consts.ts"
import { getRootSXC, _TEST_ONLY__reset_root_SXC } from "../../../index.ts"
