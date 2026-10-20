import { describe, it, expect } from "vitest"

import { ROUNDS_COUNT } from "../__fixtures/_shared.ts"
import { getꓽRNGⵧMathᐧrandom } from "../engines/MathRandom/index.ts"
import type { RNGEngine } from "../types.ts"

import { getꓽrandom_generator_ofꓽbool, getꓽrandom_generator_ofꓽboolⵧweighted } from "./bool.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/random", () => {
	let engine: RNGEngine = getꓽRNGⵧMathᐧrandom()

	describe("distributions", () => {
		describe("bool", () => {
			const TOLERANCE = 0.03 // TODO better math

			describe("basic: getꓽrandom_generator_ofꓽbool()", () => {
				const generate = getꓽrandom_generator_ofꓽbool()

				it("should work -- shape", () => {
					for (let i = 0; i < ROUNDS_COUNT; ++i) {
						const random_bool = generate(engine)
						//console.log(random_bool)
						expect(random_bool).toBeTypeOf("boolean")
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
					expect(Math.abs(ratioⵧtrue - 0.5)).toBeLessThanOrEqual(TOLERANCE)
				})
			})

			describe("getꓽrandom_generator_ofꓽboolⵧweighted()", () => {
				it("should work -- limits -- 0", () => {
					const generate = getꓽrandom_generator_ofꓽboolⵧweighted(0)

					for (let i = 0; i < ROUNDS_COUNT; ++i) {
						const random_bool = generate(engine)
						expect(random_bool).toBe(false)
					}
				})

				it("should work -- limits -- 1", () => {
					const generate = getꓽrandom_generator_ofꓽboolⵧweighted(1)

					for (let i = 0; i < ROUNDS_COUNT; ++i) {
						const random_bool = generate(engine)
						expect(random_bool).toBe(true)
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
							expect(random_bool).toBeTypeOf("boolean")
							count[String(random_bool)]++
						}

						const ratioⵧtrue = count.true / ROUNDS_COUNT
						//console.log(count, ratio, ratioⵧtrue)
						expect(Math.abs(ratioⵧtrue - ratio)).toBeLessThanOrEqual(TOLERANCE)
					})
				})
			})
		})
	})
})
