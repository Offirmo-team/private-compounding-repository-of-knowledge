/////////////////////////////////////////////////

describe(`${LIB} -- plugins -- Dependency Injection`, () => {
	beforeAll(_TEST_ONLY__reset_root_SXC)
	afterEach(_TEST_ONLY__reset_root_SXC)
	beforeEach(() => {
		vi.useFakeTimers({ now: TEST_TIMESTAMP_MS })
		vi.stubEnv("NODE_ENV", undefined) // vitest sets it to "test", we want to check the defaults
	})
	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllEnvs()
	})

	describe("direct usage", () => {
		describe("default injections", () => {
			it("should feature the default injections -- root", () => {
				const injections = getRootSXC().getInjectedDependencies()

				expect(Object.keys(injections).sort()).toStrictEqual(
					["SXC", "ENV", "IS_DEV_MODE", "IS_VERBOSE", "CHANNEL", "SESSION_START_TIME_MS", "logger"].sort(),
				)
				expect(Object.keys(injections)).toHaveLength(7)

				expect(injections.SXC).toBe(getRootSXC())
				expect(injections).toHaveProperty("logger")
				expect(injections.ENV).toBe("development")
				expect(injections.IS_DEV_MODE).toBe(false)
				expect(injections.IS_VERBOSE).toBe(false)
				expect(injections.CHANNEL).toBe("dev")
				expect(injections.SESSION_START_TIME_MS).toBe(TEST_TIMESTAMP_MS)
			})

			it("should feature the core injections + allow easy access -- leaf", () => {
				getRootSXC().xTry(
					"test",
					({ SXC, logger, ENV, IS_DEV_MODE, IS_VERBOSE, CHANNEL, SESSION_START_TIME_MS }) => {
						const injections = SXC.getInjectedDependencies()
						expect(Object.keys(injections).sort()).toStrictEqual(
							["SXC", "ENV", "IS_DEV_MODE", "IS_VERBOSE", "CHANNEL", "SESSION_START_TIME_MS", "logger"].sort(),
						)
						expect(Object.keys(injections)).toHaveLength(7)

						expect(injections).toHaveProperty("SXC")
						expect(injections).toHaveProperty("logger")
						expect(injections.ENV).toBe("development")
						expect(injections.IS_DEV_MODE).toBe(false)
						expect(injections.IS_VERBOSE).toBe(false)
						expect(injections.CHANNEL).toBe("dev")
						expect(injections.SESSION_START_TIME_MS).toBe(TEST_TIMESTAMP_MS)

						expect(injections.SXC).toBe(SXC)
						expect(SXC).not.toBe(getRootSXC())
						expect(injections.logger).toBe(logger)
						expect(injections.ENV).toBe(ENV)
						expect(injections.IS_DEV_MODE).toBe(IS_DEV_MODE)
						expect(injections.IS_VERBOSE).toBe(IS_VERBOSE)
						expect(injections.CHANNEL).toBe(CHANNEL)
						expect(injections.SESSION_START_TIME_MS).toBe(SESSION_START_TIME_MS)
					},
				)
			})

			describe("overrides", () => {
				it("should allow overrides (for allowed properties)", () => {
					getRootSXC().injectDependencies({
						ENV: "envx",
						IS_DEV_MODE: true,
						IS_VERBOSE: true,
						CHANNEL: "channelx",
					})

					const injections = getRootSXC().getInjectedDependencies()
					expect(injections.ENV).toBe("envx")
					expect(injections.IS_DEV_MODE).toBe(true)
					expect(injections.IS_VERBOSE).toBe(true)
					expect(injections.CHANNEL).toBe("channelx")

					// still the same along the call chain
					getRootSXC().xTry("test", ({ SXC, IS_VERBOSE, IS_DEV_MODE, CHANNEL, ENV }) => {
						expect(IS_DEV_MODE).toBe(true)
						expect(IS_VERBOSE).toBe(true)
						expect(ENV).toBe("envx")
						expect(CHANNEL).toBe("channelx")

						const injections = SXC.getInjectedDependencies()
						expect(injections.ENV).toBe(ENV)
						expect(injections.IS_DEV_MODE).toBe(IS_DEV_MODE)
						expect(injections.IS_VERBOSE).toBe(IS_VERBOSE)
						expect(injections.CHANNEL).toBe(CHANNEL)
					})
				})

				it("should prevent overrides of internal injections", () => {
					expect(() =>
						getRootSXC().injectDependencies({
							SXC: "foo",
						} as any),
					).toThrow("internal property")
				})
			})
		})

		describe("custom injections", () => {
			interface Injections {
				name: string
			}
			type SXC = SoftExecutionContext<Injections>

			it("should work and properly override at all levels", () => {
				const SXCⵧroot = getRootSXC<Injections>()
				expect(SXCⵧroot.getInjectedDependencies().name).toBeUndefined()

				// already tested in 'usage in a lib'
			})
		})
	})

	describe("usage in a lib", () => {
		interface CustomInjections {
			name: string
		}
		type CustomSXC = SoftExecutionContext<CustomInjections>
		function getꓽSXC(parent: SoftExecutionContext<any> = getRootSXC()): CustomSXC {
			// TODO memoize ? (if !parent)
			return parent.createChild().injectDependencies({
				name: parent.getInjectedDependencies().name || "root",
			})
		}
		function hello({ SXC } = {} as { SXC?: CustomSXC }): string {
			return getꓽSXC(SXC).xTry("hello", ({ SXC, ENV, logger, name }) => {
				return `Hello, ${name}!`
			})
		}

		it("should work - 1 level(s), default", () => {
			const s = hello()
			expect(s).toBe("Hello, root!")
		})

		it("should work - 1 level(s), override", () => {
			getRootSXC<CustomInjections>().injectDependencies({
				name: "Offirmo",
			})

			const s = hello()
			expect(s).toBe("Hello, Offirmo!")
		})

		it("should work - multi level(s), default + override", () => {
			getRootSXC<CustomInjections>().xTry("level1", ({ SXC: SXC1, ENV, name }) => {
				expect(name).toBeUndefined()
				expect(hello({ SXC: SXC1 })).toBe("Hello, root!")

				SXC1.injectDependencies({
					name: "Alice",
				})
				expect(hello({ SXC: SXC1 })).toBe("Hello, Alice!")
				expect(hello()).toBe("Hello, root!")

				SXC1.xTry("level2", ({ SXC: SXC2, name }) => {
					expect(name).toBe("Alice")
					expect(hello({ SXC: SXC2 })).toBe("Hello, Alice!")

					SXC2.injectDependencies({
						name: "Bob",
					})
					expect(hello({ SXC: SXC2 })).toBe("Hello, Bob!")
					expect(hello({ SXC: SXC1 })).toBe("Hello, Alice!")
					expect(hello()).toBe("Hello, root!")
				})
			})
		})
	})
})

/////////////////////////////////////////////////

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import { TEST_TIMESTAMP_MS } from "@monorepo-private/timestamps"

import { LIB } from "../../../consts.ts"
import { type SoftExecutionContext, getRootSXC, _TEST_ONLY__reset_root_SXC } from "../../../index.ts"
