/////////////////////

import { expect } from "chai"

import { LIB, SCHEMA_VERSION } from "./consts.ts"
import { DEMO_STATE } from "./examples.ts"
import { migrate_toꓽlatest } from "./migrations.ts"
import { getꓽSXC } from "./sec.ts"

/////////////////////

describe(`${LIB} - examples`, function () {
	describe("DEMO_STATE", function () {
		it("should be stable and up to date", () => {
			expect(DEMO_STATE.schema_version).to.equal(SCHEMA_VERSION)
			const migrated = migrate_toꓽlatest(getꓽSXC(), DEMO_STATE)
			expect(migrated).to.deep.equal(DEMO_STATE)
			expect(migrated).to.equal(DEMO_STATE)
		})
	})
})
