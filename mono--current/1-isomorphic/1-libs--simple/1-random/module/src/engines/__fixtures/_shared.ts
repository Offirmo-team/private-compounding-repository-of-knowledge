import { describe, it, beforeEach, expect } from "vitest"

import { ROUNDS_COUNT } from "../../__fixtures/_shared.ts"
import { assert } from "../../embedded-deps/assert/index.ts"
import type { Immutable } from "../../embedded-deps/types/index.ts"
import type { RNGEngine, Int32, PRNGEngine, PRNGState } from "../../types.ts"

/////////////////////////////////////////////////

const INT32_MIN = -0x8000_0000
const INT32_MAX = 0x7fff_ffff

function itᐧshouldᐧbeᐧaᐧvalidᐧengine(engine_ctor: () => RNGEngine) {
	let engine: RNGEngine | PRNGEngine = engine_ctor()
	beforeEach(() => {
		engine = engine_ctor()
	})

	function _expect_balanced_and_spread() {
		const TOLERANCE = 0.05 // TODO better math
		let min = -0
		let max = 0
		let mean = 0
		let count = 0
		let spread = new Set<number>()

		for (let i = 0; i < ROUNDS_COUNT; ++i) {
			const random_int32 = engine.get_Int32()

			spread.add(random_int32)
			min = Math.min(min, random_int32)
			max = Math.max(max, random_int32)
			mean = (mean * count + random_int32) / (count + 1)
			count++
		}

		/*console.log({
			count,
			min,
			max,
			mean,
			spread: spread.size,
		})*/

		// min should be ~close to the absolute minimum
		expect(min, "min").toBeGreaterThanOrEqual(INT32_MIN)
		expect(min, "min").toBeLessThanOrEqual(INT32_MIN * (1 - TOLERANCE))

		// similarly, max should be ~close to the absolute maximum
		expect(max, "max").toBeGreaterThanOrEqual(INT32_MAX * (1 - TOLERANCE))
		expect(max, "max").toBeLessThanOrEqual(INT32_MAX)

		// the mean should be ~close to 0
		// but the big range can skew
		expect(Math.abs(mean), "mean lower bound").toBeLessThanOrEqual(INT32_MAX * TOLERANCE)

		// the values should not repeat too much
		expect(spread.size).toBeGreaterThanOrEqual(ROUNDS_COUNT * (1 - TOLERANCE))
	}

	describe("output", () => {
		it("should have the correct shape", () => {
			for (let i = 0; i < ROUNDS_COUNT; ++i) {
				const random_int32 = engine.get_Int32()
				//console.log(random_int32)
				expect(Number.isInteger(random_int32), "output is integer").toBe(true)
				expect(random_int32).toBeGreaterThanOrEqual(INT32_MIN)
				expect(random_int32).toBeLessThanOrEqual(INT32_MAX)
			}
		})

		it("should be decently balanced and spread", () => {
			_expect_balanced_and_spread()
		})
	})

	describe("internals", () => {
		function _get_standardized_state(e: PRNGEngine): PRNGState {
			const { algorithm_id, ...rest } = e.get_state()
			return {
				...rest,
			}
		}

		it.todo("should allow several instances to be used independently")

		if (engine.is_prng()) {
			assert(engine.is_prng(), "temp")

			describe("seeding", () => {
				describe("when no seed is provided", () => {
					it("should auto-seed properly (non repeatable, enough randomness)", () => {
						let e1 = engine_ctor()
						let e2 = engine_ctor()
						let e3 = engine_ctor()
						let p1: Int32 = -0

						let unexpected_equalities = 0
						for (let i = 0; i < ROUNDS_COUNT; ++i) {
							let i1 = e1.get_Int32()
							let i2 = e2.get_Int32()
							let i3 = e3.get_Int32()

							if (i2 === i1) unexpected_equalities++
							if (i3 === i1) unexpected_equalities++
							if (p1 !== -0) {
								if (i1 === p1) unexpected_equalities++
								if (i2 === p1) unexpected_equalities++
								if (i3 === p1) unexpected_equalities++
							}
							p1 = i1
						}

						//console.log(unexpected_equalities, ROUNDS_COUNT * 0.001 * 2.5)
						expect(
							unexpected_equalities,
							"equal results between randomly seeded different engines",
						).toBeLessThanOrEqual(ROUNDS_COUNT * 0.001 * 2.5)
					})
				})

				describe("when a seed is provided", () => {
					it("should affect the output", () => {
						const seed = "Hello, world!"
						let e1 = engine_ctor() as PRNGEngine
						e1.seed([]) // no seed
						let e2 = engine_ctor() as PRNGEngine
						e2.seed(seed)
						let e3 = engine_ctor() as PRNGEngine
						e3.seed([...seed].reverse().join(""))

						let unexpected_equalities = 0
						for (let i = 0; i < ROUNDS_COUNT; ++i) {
							let i1 = e1.get_Int32()
							let i2 = e2.get_Int32()
							let i3 = e3.get_Int32()

							if (i2 === i1) unexpected_equalities++
							if (i3 === i1) unexpected_equalities++
						}

						expect(unexpected_equalities, "unexpected equal results").toBeLessThanOrEqual(ROUNDS_COUNT * 0.001)
					})

					it("should provide a stable, repeatable output", () => {
						const seed = "Hello, world!"
						let e1 = engine_ctor() as PRNGEngine
						e1.seed(seed)
						let e2 = engine_ctor() as PRNGEngine
						e2.seed(seed)
						let e3 = engine_ctor() as PRNGEngine
						e3.seed(seed)
						let p1: Int32 = -0

						let expected_equalities = 0
						let unexpected_equalities = 0
						for (let i = 0; i < ROUNDS_COUNT; ++i) {
							let i1 = e1.get_Int32()
							let i2 = e2.get_Int32()
							let i3 = e3.get_Int32()

							if (i2 === i1) expected_equalities++
							if (i3 === i1) expected_equalities++
							if (p1 !== -0) {
								if (i1 === p1) unexpected_equalities++
								if (i2 === p1) unexpected_equalities++
								if (i3 === p1) unexpected_equalities++
							}
							p1 = i1
						}

						//console.log(expected_equalities, unexpected_equalities, ROUNDS_COUNT * 0.001 * 2.5)
						expect(expected_equalities, "expected equal results between equally seeded different engines").toBe(
							ROUNDS_COUNT * 2,
						)
						expect(unexpected_equalities, "unexpected equal results").toBeLessThanOrEqual(
							ROUNDS_COUNT * 0.001 * 2.5,
						)
					})

					it.todo("should use the provided seed appropriately")

					/* This is important as the standard way to seed in many libs
					 * is to pass a random number
					 */
					describe("when the seed is weak", () => {
						it("should still output decent randomness -- 0", () => {
							;(engine as PRNGEngine).seed(0)

							_expect_balanced_and_spread()
						})

						it("should still output decent randomness -- Int32 (1)", () => {
							;(engine as PRNGEngine).seed(98765)

							_expect_balanced_and_spread()
						})

						it("should still output decent randomness -- Int32 (2)", () => {
							;(engine as PRNGEngine).seed(-54321)

							_expect_balanced_and_spread()
						})

						it("should still output decent randomness -- 1…0 (1)", () => {
							;(engine as PRNGEngine).seed(Math.random())

							_expect_balanced_and_spread()
						})

						it("should still output decent randomness -- 1…0 (2)", () => {
							;(engine as PRNGEngine).seed(Math.random())

							_expect_balanced_and_spread()
						})
					})
				})
			})

			describe("state save & restore", () => {
				const TEST_ROUNDS = 256 * 2 + 1 // ISAAC has a 256 entries buffer, we need twice that+1 to test the limits

				const TEST_STATE: Immutable<PRNGState> = {
					seed: "From a small seed a mighty trunk may grow", // https://www.brainyquote.com/quotes/aeschylus_398833
					call_count: 1234,
				}

				it("should work by producing repeatable output", () => {
					let e1 = engine_ctor()
					let e2 = engine_ctor()
					;(e2 as PRNGEngine).set_state(TEST_STATE)
					let e3 = engine_ctor()
					;(e3 as PRNGEngine).set_state(TEST_STATE)

					let expected_equalities = 0
					let unexpected_equalities = 0
					for (let i = 0; i < ROUNDS_COUNT; ++i) {
						let i1 = e1.get_Int32()
						let i2 = e2.get_Int32()
						let i3 = e3.get_Int32()

						if (i2 === i1) unexpected_equalities++
						if (i3 === i1) unexpected_equalities++
						if (i2 === i3) expected_equalities++
					}

					//console.log(expected_equalities, unexpected_equalities, ROUNDS_COUNT * 0.001 * 2.5)
					expect(expected_equalities, "expected equal results between equally seeded different engines").toBe(
						ROUNDS_COUNT,
					)
					expect(unexpected_equalities, "unexpected equal results").toBeLessThanOrEqual(ROUNDS_COUNT * 0.001 * 2)
				})

				describe("get_state", () => {
					it("should work", () => {
						const e = engine as PRNGEngine
						let { seed } = e.get_state()

						// TODO update number above to match other engines
						for (let i = 0; i < TEST_ROUNDS; ++i, e.get_Int32()) {
							const s = e.get_state()
							expect(s.call_count, String(i)).toBe(i)
							expect(s.seed).toStrictEqual(seed)
						}
					})
				})

				describe("set_state", () => {
					it("should work", () => {
						const e_ref = engine as PRNGEngine
						e_ref.set_state({ ...TEST_STATE, call_count: 0 })
						let { seed } = e_ref.get_state()

						const e_reused = engine_ctor() as PRNGEngine
						e_reused.set_state({ ...TEST_STATE, call_count: 0 })

						for (let i = 0; i < TEST_ROUNDS; ++i) {
							const s = e_ref.get_state()
							e_reused.set_state(s)
							const e_new = (engine_ctor() as PRNGEngine).set_state(s)

							expect(e_reused.get_state()).toStrictEqual(e_ref.get_state())
							expect(e_new.get_state()).toStrictEqual(e_ref.get_state())

							expect(s.call_count, String(i)).toBe(i)
							expect(s.seed).toStrictEqual(TEST_STATE.seed)

							let i_ref = e_ref.get_Int32()
							let i_reused = e_reused.get_Int32()
							let i_new = e_new.get_Int32()

							expect(i_reused).toBe(i_ref)
							expect(i_new).toBe(i_ref)
						}
					})
				})

				it("should be reflexive", () => {
					let e = engine as PRNGEngine

					// try limits
					e.set_state({ ...TEST_STATE, call_count: 0 })
					expect(_get_standardized_state(e), "0").toStrictEqual({ ...TEST_STATE, call_count: 0 })
					e.set_state({ ...TEST_STATE, call_count: 1 })
					expect(_get_standardized_state(e), "1").toStrictEqual({ ...TEST_STATE, call_count: 1 })
					e.set_state({ ...TEST_STATE, call_count: 255 })
					expect(_get_standardized_state(e), "255").toStrictEqual({ ...TEST_STATE, call_count: 255 })
					e.set_state({ ...TEST_STATE, call_count: 256 })
					expect(_get_standardized_state(e), "256").toStrictEqual({ ...TEST_STATE, call_count: 256 })
					e.set_state({ ...TEST_STATE, call_count: 257 })
					expect(_get_standardized_state(e), "257").toStrictEqual({ ...TEST_STATE, call_count: 257 })

					e.set_state(TEST_STATE)
					expect(_get_standardized_state(e), "xyz").toStrictEqual(TEST_STATE)
				})

				it("should not take too much time to restore", { timeout: 5_000 }, () => {
					const OLD_STATE: Immutable<PRNGState> = {
						seed: "From a small seed a mighty trunk may grow", // https://www.brainyquote.com/quotes/aeschylus_398833
						call_count:
							10 *
							365 * // ten years…
							8 * // …of 8h of daily play…
							60 *
							100, // …with ~ random number generations/minute
					}

					let e = engine as PRNGEngine

					e.set_state(OLD_STATE)
					expect(_get_standardized_state(e)).toStrictEqual(OLD_STATE)
				})
			})
		}
	})
}

/////////////////////////////////////////////////

export { INT32_MIN, INT32_MAX, itᐧshouldᐧbeᐧaᐧvalidᐧengine }
