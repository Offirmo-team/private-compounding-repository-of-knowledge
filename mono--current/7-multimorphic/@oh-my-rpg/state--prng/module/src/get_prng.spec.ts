import { expect } from "chai"

import { getꓽrandom } from "@monorepo-private/random"

import { LIB } from "./consts.ts"

import { create, update_use_count, getꓽprng, xxx_internal_reset_prng_cache } from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} - get`, function () {
	beforeEach(xxx_internal_reset_prng_cache)
	const gen = getꓽrandom.generator_of.integer.between(0, 10)

	it("should return a working PRNG engine", function () {
		const state = create()

		const prng = getꓽprng(state)
		/*console.log(gen(prng))
		console.log(gen(prng))
		console.log(gen(prng))
		console.log(gen(prng))
		console.log(gen(prng))
		console.log(gen(prng))
		console.log(gen(prng))
		console.log(gen(prng))*/

		expect(gen(prng), "random 1").to.equal(1)
		expect(gen(prng), "random 2").to.equal(2)
		expect(gen(prng), "random 3").to.equal(0)
		expect(gen(prng), "random 4").to.equal(7)
		expect(gen(prng), "random 5").to.equal(7)
		expect(gen(prng), "random 6").to.equal(1)
		expect(gen(prng), "random 7").to.equal(5)
		expect(gen(prng), "random 8").to.equal(6)
	})

	it("should return a repeatable PRNG engine", function () {
		let state = create()

		let prng = getꓽprng(state)
		expect(gen(prng), "random 1").to.equal(1)
		expect(gen(prng), "random 2").to.equal(2)
		expect(gen(prng), "random 3").to.equal(0)

		state = update_use_count(state, prng)
		expect(gen(prng), "random 4a").to.equal(7)
		expect(gen(prng), "random 5a").to.equal(7)
		expect(gen(prng), "random 6a").to.equal(1)

		xxx_internal_reset_prng_cache()
		prng = getꓽprng(state)
		expect(gen(prng), "random 4b").to.equal(7)
		expect(gen(prng), "random 5b").to.equal(7)
		expect(gen(prng), "random 6b").to.equal(1)
	})
})
