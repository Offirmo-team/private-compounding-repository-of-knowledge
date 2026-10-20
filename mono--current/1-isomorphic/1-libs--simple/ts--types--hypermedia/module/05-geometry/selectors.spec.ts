import { describe, it, expect } from "vitest"

import { getꓽdimensions2D } from "./selectors.ts"

/////////////////////////////////////////////////

describe(`@monorepo-private/ts--types--hypermedia -- HTML`, () => {
	describe("getꓽdimensions2D()", () => {
		describe("when enough specs", () => {
			it("should work -- W+H", () => {
				expect(
					getꓽdimensions2D({
						width: 16,
						height: 9,
					}),
				).toStrictEqual({
					width: 16,
					height: 9,
				})
			})

			it("should work -- W+AR", () => {
				expect(
					getꓽdimensions2D({
						width: 16,
						aspect_ratio: 16 / 9,
					}),
				).toStrictEqual({
					width: 16,
					height: 9,
				})
			})

			it("should work -- H+AR", () => {
				expect(
					getꓽdimensions2D({
						height: 9,
						aspect_ratio: 16 / 9,
					}),
				).toStrictEqual({
					width: 16,
					height: 9,
				})
			})

			it("should work -- W+H+AR", () => {
				expect(
					getꓽdimensions2D({
						width: 16,
						height: 9,
						aspect_ratio: 16 / 9,
					}),
				).toStrictEqual({
					width: 16,
					height: 9,
				})
			})
		})

		describe.todo("when NOT enough specs")
	})
})
