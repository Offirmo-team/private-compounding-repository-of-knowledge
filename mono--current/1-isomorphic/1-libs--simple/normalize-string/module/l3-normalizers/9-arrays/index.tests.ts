import { expect } from "chai"

import { LIB } from "../../consts.ts"

import { normalizeꓽarrayⵧof_strings } from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- arrays`, function () {
	it("should work -- default settings", function () {
		expect(normalizeꓽarrayⵧof_strings()).to.deep.equal([])
		expect(normalizeꓽarrayⵧof_strings(null)).to.deep.equal([])
		expect(normalizeꓽarrayⵧof_strings([])).to.deep.equal([])
		expect(normalizeꓽarrayⵧof_strings([null, undefined, "", "    ", "\t \n"])).to.deep.equal([])
	})

	it("should work -- default + dedupe", function () {
		expect(normalizeꓽarrayⵧof_strings([null, undefined, "", "b", "a", "\ta\n"], { deduplicate: true })).to.deep.equal(
			["b", "a"],
		)
	})

	it("should work -- default + sort", function () {
		expect(normalizeꓽarrayⵧof_strings([null, undefined, "", "a", "b", "\ta\n"], { sort: true })).to.deep.equal([
			"a",
			"a",
			"b",
		])
	})
})
