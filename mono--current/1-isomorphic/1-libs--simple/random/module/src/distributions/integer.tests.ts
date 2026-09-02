import { expect } from "chai"

import { ROUNDS_COUNT } from "../__fixtures/_shared.ts"
import { getꓽRNGⵧMathᐧrandom } from "../engines/MathRandom/index.ts"
import type { RNGEngine } from "../types.ts"

import { getꓽrandom_generator_ofꓽintegerⵧbetween } from "./integer.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/random", function () {
	const getꓽRNG = getꓽRNGⵧMathᐧrandom
	let engine: RNGEngine = getꓽRNG()

	describe("distributions", function () {
		describe("integer", function () {
			function itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(engine_ctor: () => RNGEngine, possible_output_count: number) {
				const TOLERANCE = 0.05 // TODO better math

				it(`should work -- range = 1 - ${possible_output_count} (0 - 0x${Number(possible_output_count - 1).toString(16)})`, () => {
					let engine: RNGEngine = engine_ctor()
					const generate = getꓽrandom_generator_ofꓽintegerⵧbetween(1, possible_output_count)

					let min = Number.MAX_SAFE_INTEGER
					let max = Number.MIN_SAFE_INTEGER
					let mean = 0
					let count = 0
					let spread = new Set<number>()
					for (let i = 0; i < ROUNDS_COUNT; ++i) {
						const val = generate(engine)
						//console.log(val)

						// shape
						expect(Number.isInteger(val)).to.be.true
						expect(val).to.be.at.least(1)
						expect(val).to.be.at.most(possible_output_count)

						// balance and spread
						min = Math.min(min, val)
						max = Math.max(max, val)
						mean = (mean * count + val) / (count + 1)
						spread.add(val) // TODO bucketing
						count++

						// pattern
					}

					/*console.log({
						count,
						min,
						mean_lb: (1 + possible_output_count) * 0.49,
						mean,
						mean_ub: (1 + possible_output_count) * 0.51,
						max,
						spread: spread.size,
					})*/
					// min should be ~close to the absolute minimum
					expect(min, "min").to.be.within(1, 1 + possible_output_count * TOLERANCE)

					// similarly, max should be ~close to the absolute maximum
					expect(max, "max").to.be.within(possible_output_count * (1 - TOLERANCE), possible_output_count)

					// the mean should be ~close to the middle
					expect(mean, "mean").to.be.closeTo((1 + possible_output_count) / 2, possible_output_count * TOLERANCE)

					// the buckets should be balanced
					// TODO refine the margin
					if (possible_output_count < ROUNDS_COUNT) {
						expect(spread.size, "spread (small range)").to.equal(possible_output_count)
					} else {
						expect(spread.size, "spread (big range)").to.equal(ROUNDS_COUNT)
					}
				})
			}

			describe("getꓽrandom_generator_ofꓽintegerⵧbetween()", function () {
				it("should work -- range size = 1 = constant", () => {
					const generate = getꓽrandom_generator_ofꓽintegerⵧbetween(-5, -5)

					expect(generate(engine)).to.equal(-5)
					expect(generate(engine)).to.equal(-5)
					expect(generate(engine)).to.equal(-5)
				})

				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 2)
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 3)
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 4)
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 5)
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 7)
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 255) // -1
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 256) // power of 2
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 257) // +1
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 0x8000_0000)
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 0xffff_ffff)
				itᐧshouldᐧbeᐧaᐧvalidᐧintegerᐧgenerator(getꓽRNG, 0xffff_ffff + 1) // power of 2

				it("should reject ranges > 32 bits", () => {
					expect(() => getꓽrandom_generator_ofꓽintegerⵧbetween(0, 0xffff_ffff + 1)).to.throw("Range error")
				})
			})
		})
	})
})
