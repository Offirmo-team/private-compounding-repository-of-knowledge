import { expect } from "chai"

import { ROUNDS_COUNT } from "../__fixtures/_shared.ts"
import { getꓽRNGⵧMathᐧrandom } from "../engines/MathRandom/index.ts"
import type { RNGEngine } from "../types.ts"

import { getꓽrandom_generator_ofꓽbool, getꓽrandom_generator_ofꓽboolⵧweighted } from "./bool.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/random", function () {
	let engine: RNGEngine = getꓽRNGⵧMathᐧrandom()

	describe("distributions", function () {
		describe("bool", function () {
			const TOLERANCE = 0.03 // TODO better math

			describe("basic: getꓽrandom_generator_ofꓽbool()", function () {
				const generate = getꓽrandom_generator_ofꓽbool()

				it("should work -- shape", () => {
					for (let i = 0; i < ROUNDS_COUNT; ++i) {
						const random_bool = generate(engine)
						//console.log(random_bool)
						expect(random_bool).to.be.a("boolean")
					}
				})

				// how to properly test that?
				it("should work -- randomness", () => {
					const count: any = {
						ROUNDS_COUNT,
						true: 0,
						false: 0,
					}
					for (let i = 0; i < ROUNDS_COUNT; ++i) {
						const random_bool = generate(engine)
						count[String(random_bool)]++
					}

					const ratioⵧtrue = count.true / ROUNDS_COUNT
					//console.log(count, ratioⵧtrue)
					expect(ratioⵧtrue).to.be.closeTo(0.5, TOLERANCE)
				})
			})

			describe("getꓽrandom_generator_ofꓽboolⵧweighted()", function () {
				it("should work -- limits -- 0", () => {
					const generate = getꓽrandom_generator_ofꓽboolⵧweighted(0)

					for (let i = 0; i < ROUNDS_COUNT; ++i) {
						const random_bool = generate(engine)
						expect(random_bool).to.equal(false)
					}
				})

				it("should work -- limits -- 1", () => {
					const generate = getꓽrandom_generator_ofꓽboolⵧweighted(1)

					for (let i = 0; i < ROUNDS_COUNT; ++i) {
						const random_bool = generate(engine)
						expect(random_bool).to.equal(true)
					}
				})

				;[
					0.05,
					0.3, // not perfect representation on a binary
					1 / 3,
					0.5,
					3 / 4,
				].forEach((ratio: number) => {
					it(`should work -- ${ratio}`, () => {
						const generate = getꓽrandom_generator_ofꓽboolⵧweighted(ratio)

						const count: any = {
							ROUNDS_COUNT,
							true: 0,
							false: 0,
						}
						for (let i = 0; i < ROUNDS_COUNT; ++i) {
							const random_bool = generate(engine)
							expect(random_bool).to.be.a("boolean")
							count[String(random_bool)]++
						}

						const ratioⵧtrue = count.true / ROUNDS_COUNT
						//console.log(count, ratio, ratioⵧtrue)
						expect(ratioⵧtrue).to.be.closeTo(ratio, TOLERANCE)
					})
				})
			})
		})
	})
})
