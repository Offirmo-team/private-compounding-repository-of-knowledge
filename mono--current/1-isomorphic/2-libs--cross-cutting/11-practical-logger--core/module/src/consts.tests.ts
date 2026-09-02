import { expect } from "chai"

import { LIB, LOG_LEVEL_TO_INTEGER, ALL_LOG_LEVELS, LOG_LEVEL_TO_HUMAN } from "./consts.ts"

describe(`${LIB} - consts`, () => {
	describe("LOG_LEVEL_TO_INTEGER", () => {
		it("should be correct", () => {
			//console.log(LOG_LEVEL_TO_INTEGER)

			const keys = Object.keys(LOG_LEVEL_TO_INTEGER)
			expect(keys).to.have.lengthOf(14)
		})
	})

	describe("ALL_LOG_LEVELS", () => {
		it("should be correct", () => {
			//console.log(ALL_LOG_LEVELS)

			expect(ALL_LOG_LEVELS).to.have.lengthOf(14)
			expect([...ALL_LOG_LEVELS].sort().join(",")).to.equal(Object.keys(LOG_LEVEL_TO_INTEGER).sort().join(","))
		})
	})

	describe("LOG_LEVEL_TO_HUMAN", () => {
		it("should be correct", () => {
			//console.log(LOG_LEVEL_TO_HUMAN)

			expect(Object.keys(LOG_LEVEL_TO_HUMAN).sort().join(",")).to.equal(
				Object.keys(LOG_LEVEL_TO_INTEGER).sort().join(","),
			)

			Object.entries(LOG_LEVEL_TO_HUMAN).forEach(([ll, h]) => {
				expect(h).to.be.a("string")
				expect(h.slice(0, 4), `human "${h}" should match log lovel "${ll}"`).to.equal(ll.slice(0, 4))
			})
		})
	})
})
