import { describe, it, expect } from "vitest"

import { getꓽjson_difference } from "./comparators--base.ts"
import { LIB } from "./consts.ts"

describe(`${LIB} - comparators`, () => {
	describe("getꓽjson_difference()", () => {
		it("should work", () => {
			const nodiff = getꓽjson_difference(
				{
					foo: 33,
				},
				{
					foo: 33,
				},
			)
			expect(nodiff, "no diff").toBeUndefined()

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
			expect(diff).toStrictEqual({
				foo: [33, 34],
				bar: [42, 0, 0],
				baz: [42],
			})
		})
	})
})
