import { expect } from "chai"

import promiseTry from "@monorepo-private/promise-try"

describe("@monorepo-private/promise-try", function () {
	it("should work - resolution", () => {
		return promiseTry(() => 42).then((val) => {
			expect(val).to.equal(42)
		})
	})

	it("should work - rejection", () => {
		const test_error = new Error("Foo!")

		return promiseTry(() => {
			throw test_error
		})
			.then((val) => {
				throw new Error("Unexpected resolution!")
			})
			.catch((err) => {
				expect(err).to.equal(test_error)
			})
	})
})
