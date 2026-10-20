//////////////////////////////////////////////////////////////////////

import { expect } from "chai"

import { LIB } from "../consts.ts"
import { migrate_toꓽlatest } from "../migrations/index.ts"
import { getꓽSXC } from "../utils/sec.ts"

import { DEMO_STATE } from "./index.ts"

//////////////////////////////////////////////////////////////////////

describe(`${LIB} - examples`, function () {
	describe("DEMO_STATE", function () {
		it("should be stable and up to date", () => {
			const migrated = migrate_toꓽlatest(getꓽSXC(), DEMO_STATE)
			expect(migrated).to.equal(DEMO_STATE)
		})
	})
})

//////////////////////////////////////////////////////////////////////
