import { expect } from "chai"

import { ENTRIES } from "./index.ts"

describe("@tbrpg/logic--monsters - data:", function () {
	it("should have all the expected monsters", () => {
		expect(ENTRIES).to.have.lengthOf(76)
	})
})
