import { expect } from "chai"

import { getꓽRNGⵧISAAC32 } from "@monorepo-private/random"

import { generate_uuid, UUID_LENGTH } from "./index.ts"

describe("@monorepo-private/uuid - generate", function () {
	describe("generate_uuid()", function () {
		context("when provided a random generator", function () {
			it("should return correct uuids", function () {
				const rng = getꓽRNGⵧISAAC32().seed(123)

				for (let i = 0; i < 10; ++i) {
					const uuid = generate_uuid({ rng })
					//console.log(uuid)
					expect(uuid).to.be.a("string")
					expect(uuid).to.have.lengthOf(UUID_LENGTH)
					expect(uuid.startsWith("uu1")).to.be.true
				}
			})
		})

		context("when NOT provided a random generator", function () {
			it("should return correct uuids", function () {
				for (let i = 0; i < 10; ++i) {
					const uuid = generate_uuid()
					//console.log(uuid)
					expect(uuid).to.be.a("string")
					expect(uuid).to.have.lengthOf(UUID_LENGTH)
					expect(uuid.startsWith("uu1")).to.be.true
				}
			})
		})
	})
})
