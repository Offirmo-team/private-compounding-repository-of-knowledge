import { expect } from "chai"

import { try_or_fallback } from "./util--try-or-fallback.ts"

describe(`@monorepo-private/utils--error`, () => {
	describe("try_or_fallback()", () => {
		const _demo_error = new Error("[Test!]")

		it("should return the result if ok", () => {
			expect(
				try_or_fallback({
					getter: () => 42,
					fallback_result: -1,
				}),
			).to.equal(42)
		})

		it("should return the fallback if not ok", () => {
			expect(
				try_or_fallback({
					getter: () => {
						if (true as any) throw _demo_error
						return 42
					},
					fallback_result: -1,
				}),
			).to.equal(-1)
		})

		it("should call the hook if not ok", () => {
			let seen: any = undefined
			expect(
				try_or_fallback({
					getter: () => {
						if (true as any) throw _demo_error
						return 42
					},
					fallback_result: -1,
					onꓽerror: (err) => (seen = err),
				}),
			).to.equal(-1)

			expect(seen).to.equal(_demo_error)
		})
	})
})
