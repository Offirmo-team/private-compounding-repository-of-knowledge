import { describe, it, expect } from "vitest"

import { LIB } from "../../consts.ts"

import { normalizeꓽarrayⵧof_strings } from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- arrays`, () => {
	it("should work -- default settings", () => {
		expect(normalizeꓽarrayⵧof_strings()).toStrictEqual([])
		expect(normalizeꓽarrayⵧof_strings(null)).toStrictEqual([])
		expect(normalizeꓽarrayⵧof_strings([])).toStrictEqual([])
		expect(normalizeꓽarrayⵧof_strings([null, undefined, "", "    ", "\t \n"])).toStrictEqual([])
	})

	it("should work -- default + dedupe", () => {
		expect(normalizeꓽarrayⵧof_strings([null, undefined, "", "b", "a", "\ta\n"], { deduplicate: true })).toStrictEqual(
			["b", "a"],
		)
	})

	it("should work -- default + sort", () => {
		expect(normalizeꓽarrayⵧof_strings([null, undefined, "", "a", "b", "\ta\n"], { sort: true })).toStrictEqual([
			"a",
			"a",
			"b",
		])
	})
})
