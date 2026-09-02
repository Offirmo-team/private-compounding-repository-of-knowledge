import { expect } from "chai"
import * as sinon from "sinon"

import { TEST_TIMESTAMP_MS } from "@monorepo-private/timestamps"

import { LIB } from "../../../consts.ts"
import { type SoftExecutionContext, getRootSXC, _TEST_ONLY__reset_root_SXC } from "../../../index.ts"

describe(`${LIB} -- plugins -- Dependency Injection`, function () {
	function _mocha_bug_clean_global() {
		// https://github.com/mochajs/mocha/issues/4954
		_TEST_ONLY__reset_root_SXC()
	}
	before(_TEST_ONLY__reset_root_SXC)
	afterEach(_TEST_ONLY__reset_root_SXC)
	beforeEach(function () {
		;(this as any).clock = sinon.useFakeTimers(TEST_TIMESTAMP_MS)
	})
	afterEach(function () {
		;(this as any).clock.restore()
	})

	context("direct usage", function () {
		describe("default injections", function () {
			it("should feature the default injections -- root", () => {
				const injections = getRootSXC().getInjectedDependencies()

				expect(injections).to.have.all.keys(
					"SXC",
					"ENV",
					"IS_DEV_MODE",
					"IS_VERBOSE",
					"CHANNEL",
					"SESSION_START_TIME_MS",
					"logger",
				)
				expect(Object.keys(injections)).to.have.lengthOf(7)

				expect(injections).to.have.ownProperty("SXC", getRootSXC())
				expect(injections).to.have.ownProperty("logger")
				expect(injections).to.have.ownProperty("ENV", "development")
				expect(injections).to.have.ownProperty("IS_DEV_MODE", false)
				expect(injections).to.have.ownProperty("IS_VERBOSE", false)
				expect(injections).to.have.ownProperty("CHANNEL", "dev")
				expect(injections).to.have.ownProperty("SESSION_START_TIME_MS", TEST_TIMESTAMP_MS)

				_mocha_bug_clean_global()
			})

			it("should feature the core injections + allow easy access -- leaf", () => {
				getRootSXC().xTry(
					"test",
					({ SXC, logger, ENV, IS_DEV_MODE, IS_VERBOSE, CHANNEL, SESSION_START_TIME_MS }) => {
						const injections = SXC.getInjectedDependencies()
						expect(injections).to.have.all.keys(
							"SXC",
							"ENV",
							"IS_DEV_MODE",
							"IS_VERBOSE",
							"CHANNEL",
							"SESSION_START_TIME_MS",
							"logger",
						)
						expect(Object.keys(injections)).to.have.lengthOf(7)

						expect(injections).to.have.ownProperty("SXC")
						expect(injections).to.have.ownProperty("logger")
						expect(injections).to.have.ownProperty("ENV", "development")
						expect(injections).to.have.ownProperty("IS_DEV_MODE", false)
						expect(injections).to.have.ownProperty("IS_VERBOSE", false)
						expect(injections).to.have.ownProperty("CHANNEL", "dev")
						expect(injections).to.have.ownProperty("SESSION_START_TIME_MS", TEST_TIMESTAMP_MS)

						expect(injections).to.have.ownProperty("SXC", SXC)
						expect(SXC).not.to.equal(getRootSXC())
						expect(injections).to.have.ownProperty("logger", logger)
						expect(injections).to.have.ownProperty("ENV", ENV)
						expect(injections).to.have.ownProperty("IS_DEV_MODE", IS_DEV_MODE)
						expect(injections).to.have.ownProperty("IS_VERBOSE", IS_VERBOSE)
						expect(injections).to.have.ownProperty("CHANNEL", CHANNEL)
						expect(injections).to.have.ownProperty("SESSION_START_TIME_MS", SESSION_START_TIME_MS)
					},
				)

				_mocha_bug_clean_global()
			})

			describe("overrides", function () {
				it("should allow overrides (for allowed properties)", () => {
					getRootSXC().injectDependencies({
						ENV: "envx",
						IS_DEV_MODE: true,
						IS_VERBOSE: true,
						CHANNEL: "channelx",
					})

					const injections = getRootSXC().getInjectedDependencies()
					expect(injections).to.have.ownProperty("ENV", "envx")
					expect(injections).to.have.ownProperty("IS_DEV_MODE", true)
					expect(injections).to.have.ownProperty("IS_VERBOSE", true)
					expect(injections).to.have.ownProperty("CHANNEL", "channelx")

					// still the same along the call chain
					getRootSXC().xTry("test", ({ SXC, IS_VERBOSE, IS_DEV_MODE, CHANNEL, ENV }) => {
						expect(IS_DEV_MODE).to.be.true
						expect(IS_VERBOSE).to.be.true
						expect(ENV).to.equal("envx")
						expect(CHANNEL).to.equal("channelx")

						const injections = SXC.getInjectedDependencies()
						expect(injections).to.have.ownProperty("ENV", ENV)
						expect(injections).to.have.ownProperty("IS_DEV_MODE", IS_DEV_MODE)
						expect(injections).to.have.ownProperty("IS_VERBOSE", IS_VERBOSE)
						expect(injections).to.have.ownProperty("CHANNEL", CHANNEL)
					})

					_mocha_bug_clean_global()
				})

				it("should prevent overrides of internal injections", () => {
					expect(() =>
						getRootSXC().injectDependencies({
							SXC: "foo",
						} as any),
					).to.throw("internal property")
				})
			})
		})

		describe("custom injections", function () {
			interface Injections {
				name: string
			}
			type SXC = SoftExecutionContext<Injections>

			it("should work and properly override at all levels", () => {
				const SXCⵧroot = getRootSXC<Injections>()
				expect(SXCⵧroot.getInjectedDependencies().name).to.be.undefined

				// already tested in 'usage in a lib'

				_mocha_bug_clean_global()
			})
		})
	})

	context("usage in a lib", function () {
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
			expect(s).to.equal("Hello, root!")

			_mocha_bug_clean_global()
		})

		it("should work - 1 level(s), override", () => {
			getRootSXC<CustomInjections>().injectDependencies({
				name: "Offirmo",
			})

			const s = hello()
			expect(s).to.equal("Hello, Offirmo!")

			_mocha_bug_clean_global()
		})

		it("should work - multi level(s), default + override", () => {
			getRootSXC<CustomInjections>().xTry("level1", ({ SXC: SXC1, ENV, name }) => {
				expect(name).to.be.undefined
				expect(hello({ SXC: SXC1 })).to.equal("Hello, root!")

				SXC1.injectDependencies({
					name: "Alice",
				})
				expect(hello({ SXC: SXC1 })).to.equal("Hello, Alice!")
				expect(hello()).to.equal("Hello, root!")

				SXC1.xTry("level2", ({ SXC: SXC2, name }) => {
					expect(name).to.equal("Alice")
					expect(hello({ SXC: SXC2 })).to.equal("Hello, Alice!")

					SXC2.injectDependencies({
						name: "Bob",
					})
					expect(hello({ SXC: SXC2 })).to.equal("Hello, Bob!")
					expect(hello({ SXC: SXC1 })).to.equal("Hello, Alice!")
					expect(hello()).to.equal("Hello, root!")
				})
			})

			_mocha_bug_clean_global()
		})
	})
})
