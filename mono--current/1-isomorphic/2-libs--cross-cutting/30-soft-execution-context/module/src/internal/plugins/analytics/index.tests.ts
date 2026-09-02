import { expect } from "chai"

import { LIB } from "../../../consts.ts"
import { getRootSXC, _TEST_ONLY__reset_root_SXC } from "../../../index.ts"

describe(`${LIB} -- plugins -- analytics`, function () {
	function _mocha_bug_clean_global() {
		// https://github.com/mochajs/mocha/issues/4954
		_TEST_ONLY__reset_root_SXC()
	}
	before(_TEST_ONLY__reset_root_SXC)
	afterEach(_TEST_ONLY__reset_root_SXC)

	describe("setAnalyticsAndErrorDetails", function () {
		it("should work", () => {
			const SXC = getRootSXC()
			SXC.setAnalyticsAndErrorDetails({ v: "1.2.3" })

			_mocha_bug_clean_global()
		})
	})

	describe("analytics event", function () {
		it("should be emitted", async () => {
			const SXC = getRootSXC()

			const seen = new Promise<void>((resolve, reject) => {
				SXC.emitter.on("analytics", function onAnalyticsEvent({ data: { eventId } }) {
					try {
						expect(eventId).to.equal("foo")
						resolve()
					} catch (err) {
						reject(err)
					}
				})
			})
			SXC.fireAnalyticsEvent("foo")

			await seen.finally(_mocha_bug_clean_global)
		})

		it("should have all the properties", async () => {
			const SXC = getRootSXC()

			SXC.setAnalyticsAndErrorDetails({ v: "1.2.3" })

			const seen = new Promise<void>((resolve, reject) => {
				SXC.emitter.on("analytics", function onAnalyticsEvent({ data: { details } }) {
					try {
						console.log(`XXX `, details)
						expect(details).to.haveOwnProperty("v", "1.2.3")
						resolve()
					} catch (err) {
						reject(err)
					}
				})
			})
			SXC.fireAnalyticsEvent("foo")

			await seen.finally(_mocha_bug_clean_global)
		})
	})
})
