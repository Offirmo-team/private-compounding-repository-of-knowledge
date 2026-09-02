import { expect } from "chai"

import { getꓽjson_difference } from "./comparators--base.ts"
import { LIB } from "./consts.ts"

describe(`${LIB} - comparators`, function () {
	describe("getꓽjson_difference()", function () {
		it("should work", () => {
			const nodiff = getꓽjson_difference(
				{
					foo: 33,
				},
				{
					foo: 33,
				},
			)
			expect(nodiff, "no diff").to.deep.equal(undefined)

			const diff = getꓽjson_difference(
				{
					foo: 33,
					bar: 42,
				},
				{
					foo: 34,
					baz: 42,
				},
			)
			//console.log(diff)
			expect(diff).to.deep.equal({
				foo: [33, 34],
				bar: [42, 0, 0],
				baz: [42],
			})
		})
	})
})
