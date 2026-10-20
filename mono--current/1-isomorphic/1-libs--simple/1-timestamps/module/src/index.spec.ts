import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

import {
	getꓽUTC_timestamp‿ms,
	getꓽUTC_timestampⵧhuman_readable‿days,
	getꓽUTC_timestampⵧhuman_readable‿minutes,
	getꓽUTC_timestampⵧhuman_readable‿seconds,
	getꓽUTC_timestampⵧhuman_readable‿ms,
	getꓽISO8601ⵧextended‿ms,
	getꓽISO8601ⵧsimplified‿minutes,
	getꓽISO8601ⵧsimplified‿days,
	TEST_TIMESTAMP_MS,
} from "./index.ts"

//declare const console: any

describe("@monorepo-private/timestamps", () => {
	describe("getꓽUTC_timestamp‿ms()", () => {
		it("should return correct UTC unix timestamps in ms", () => {
			//console.log(getꓽUTC_timestamp‿ms())

			for (let i = 0; i < 10; ++i) {
				const stamp = getꓽUTC_timestamp‿ms()
				//console.log(stamp)
				expect(stamp).toBeTypeOf("number")
				expect(stamp).toBeGreaterThanOrEqual(1510177449000) // 2017
				expect(stamp).toBeLessThanOrEqual(4665851049000) // 2117
			}
		})

		describe("testability", () => {
			it("should allow passing a forced time", () => {
				const date = new Date(TEST_TIMESTAMP_MS)
				expect(Number(date)).toBe(TEST_TIMESTAMP_MS)
				const stamp = getꓽUTC_timestamp‿ms(date)
				expect(stamp).toBe(TEST_TIMESTAMP_MS)
			})

			describe("when using fake timers", () => {
				beforeEach(() => {
					vi.useFakeTimers({ now: TEST_TIMESTAMP_MS })
				})
				afterEach(() => {
					vi.useRealTimers()
				})

				it("should be affected by useFakeTimers()", () => {
					// test the fake timers themselves
					const date = new Date()
					expect(Number(date)).toBe(TEST_TIMESTAMP_MS)

					// and us
					const stamp = getꓽUTC_timestamp‿ms()
					expect(stamp).toBe(TEST_TIMESTAMP_MS)
				})
			})
		})
	})

	describe("human readable timestamps", () => {
		describe("getꓽUTC_timestampⵧhuman_readable‿days()", () => {
			it("should return correct UTC timestamps up to the day", () => {
				//console.log(getꓽUTC_timestampⵧhuman_readable‿days())

				for (let i = 0; i < 10; ++i) {
					const stamp = getꓽUTC_timestampⵧhuman_readable‿days()
					//console.log(stamp)
					expect(stamp).toBeTypeOf("string")
					expect(stamp.length).toBe(8)
				}
			})
		})

		describe("getꓽUTC_timestampⵧhuman_readable‿minutes()", () => {
			it("should return correct UTC timestamps up to the minute", () => {
				//console.log(getꓽUTC_timestampⵧhuman_readable‿minutes())

				for (let i = 0; i < 10; ++i) {
					const stamp = getꓽUTC_timestampⵧhuman_readable‿minutes()
					//console.log(stamp)
					expect(stamp).toBeTypeOf("string")
					expect(stamp.length).toBe(14)
				}
			})
		})

		describe("getꓽUTC_timestampⵧhuman_readable‿seconds()", () => {
			it("should return correct UTC timestamps up to the second", () => {
				//console.log(getꓽUTC_timestampⵧhuman_readable‿seconds())

				for (let i = 0; i < 10; ++i) {
					const stamp = getꓽUTC_timestampⵧhuman_readable‿seconds()
					//console.log(stamp)
					expect(stamp).toBeTypeOf("string")
					expect(stamp.length).toBe(17)
				}
			})
		})

		describe("getꓽUTC_timestampⵧhuman_readable‿ms()", () => {
			it("should return correct UTC timestamps up to the millisecond", () => {
				//console.log(getꓽUTC_timestampⵧhuman_readable‿ms())

				for (let i = 0; i < 10; ++i) {
					const stamp = getꓽUTC_timestampⵧhuman_readable‿ms()
					//console.log(stamp)
					expect(stamp).toBeTypeOf("string")
					expect(stamp.length).toBe(21)
				}
			})
		})
	})

	describe("ISO-8601", () => {
		describe("getꓽISO8601ⵧextended‿ms()", () => {
			it("should return correct timestamps up to the ms", () => {
				//console.log(getꓽISO8601ⵧextended‿ms())

				for (let i = 0; i < 10; ++i) {
					const stamp = getꓽISO8601ⵧextended‿ms()
					//console.log(stamp)
					expect(stamp).toBeTypeOf("string")
					expect(stamp.length).toBe(24)
				}
			})
		})

		describe("getꓽISO8601ⵧsimplified‿minutes()", () => {
			it("should return correct UTC timestamps up to the minute", () => {
				//console.log(getꓽISO8601ⵧsimplified‿minutes())

				for (let i = 0; i < 10; ++i) {
					const stamp = getꓽISO8601ⵧsimplified‿minutes()
					//console.log(stamp)
					expect(stamp).toBeTypeOf("string")
					expect(stamp.length).toBe(16)
				}
			})
		})

		describe("getꓽISO8601ⵧsimplified‿days()", () => {
			it("should return correct UTC timestamps up to the day", () => {
				//console.log(getꓽISO8601ⵧsimplified‿days())

				for (let i = 0; i < 10; ++i) {
					const stamp = getꓽISO8601ⵧsimplified‿days()
					//console.log(stamp)
					expect(stamp).toBeTypeOf("string")
					expect(stamp.length).toBe(10)
				}
			})
		})
	})
})
