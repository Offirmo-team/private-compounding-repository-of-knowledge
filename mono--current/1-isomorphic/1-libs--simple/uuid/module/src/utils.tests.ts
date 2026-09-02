import { expect } from "chai"

import { getꓽRNGⵧISAAC32 } from "@monorepo-private/random"

import { type UUID, type WithUUID, generate_uuid, xxx_test_unrandomize_element } from "./index.ts"

/////////////////////////////////////////////////

interface Test extends WithUUID {
	another: UUID
}

describe("@monorepo-private/uuid - utils", function () {
	describe("xxx_test_unrandomize_element()", function () {
		context("when provided a uuid prop", function () {
			it("should turn it into a fixed value", function () {
				const rng = getꓽRNGⵧISAAC32().seed(123)

				const out: Readonly<Test> = {
					uuid: generate_uuid({ rng }),
					another: generate_uuid({ rng }),
				}

				const randomized: Readonly<Test> = xxx_test_unrandomize_element(out)

				expect(randomized.uuid).not.to.equal(out.uuid)
				expect(randomized.another).to.equal(out.another)
			})
		})
	})
})
