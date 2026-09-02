import { expect } from "chai"

import { getꓽrandom, getꓽengine } from "./index.ts" // TODO self-ref

/////////////////////////////////////////////////

describe("@monorepo-private/random", function () {
	describe("usage", function () {
		it("should provide a convenient API -- generators -- bool", () => {
			const gen = getꓽrandom.generator_of.bool()
			const engine = getꓽengine.prng.good_enough()
			let rv = gen(engine)
			expect(rv).to.be.a("boolean")
			rv = gen(engine)
			expect(rv).to.be.a("boolean")
		})

		it("should provide a convenient API -- generators -- bool -- weighted", () => {
			const gen = getꓽrandom.generator_of.bool.weighted(1.0)
			const engine = getꓽengine.prng.good_enough()
			let rv = gen(engine)
			expect(rv).to.equal(true)
			rv = gen(engine)
			expect(rv).to.equal(true)
		})

		it("should provide a convenient API -- generators -- integer", () => {
			const gen = getꓽrandom.generator_of.integer.between(1, 6)
			const engine = getꓽengine.prng.good_enough()
			let rv = gen(engine)
			expect(rv).to.be.a("number")
			rv = gen(engine)
			expect(rv).to.be.a("number")
		})
	})
})
