import { expect } from "chai"

import { getꓽdimensions2D } from "./selectors.ts"

/////////////////////////////////////////////////

describe(`@monorepo-private/ts--types--hypermedia -- HTML`, function () {
	describe("getꓽdimensions2D()", function () {
		describe("when enough specs", function () {
			it("should work -- W+H", () => {
				expect(
					getꓽdimensions2D({
						width: 16,
						height: 9,
					}),
				).to.deep.equal({
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
				).to.deep.equal({
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
				).to.deep.equal({
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
				).to.deep.equal({
					width: 16,
					height: 9,
				})
			})
		})

		describe("when NOT enough specs", function () {})
	})
})
