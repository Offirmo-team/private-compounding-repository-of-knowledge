/////////////////////////////////////////////////

describe(`${LIB} -- plugins -- Logical Stack`, () => {
	beforeAll(_TEST_ONLY__reset_root_SXC)
	afterEach(_TEST_ONLY__reset_root_SXC)

	describe("usage -- direct", () => {
		it("should work -- default", () => {
			getRootSXC().xTry("level1", ({ SXC: SXC1, ENV }) => {
				SXC1.xTry("level2", ({ SXC: SXC2 }) => {
					// we don't mind having "undefined", it prompts the user to properly configure the lib
					expect(SXC2.getLogicalStack()).toBe("›level1›level2")
					expect(SXC2.getShortLogicalStack()).toBe("undefined…level2")
					expect(SXC1.getLogicalStack()).toBe("›level1")
					expect(SXC1.getShortLogicalStack()).toBe("undefined…level1")
					expect(getRootSXC().getLogicalStack()).toBe("")
					expect(getRootSXC().getShortLogicalStack()).toBe("undefined…undefined")
				})
			})
		})

		it("should work -- config", () => {
			getRootSXC().setLogicalStack({
				module: "app",
			})
			getRootSXC().xTry("level1", ({ SXC: SXC1, ENV }) => {
				SXC1.xTry("level2", ({ SXC: SXC2 }) => {
					expect(SXC2.getLogicalStack()).toBe("app›level1›level2")
					expect(SXC2.getShortLogicalStack()).toBe("app…level2")
					expect(SXC1.getLogicalStack()).toBe("app›level1")
					expect(SXC1.getShortLogicalStack()).toBe("app…level1")
					expect(getRootSXC().getLogicalStack()).toBe("app")
					expect(getRootSXC().getShortLogicalStack()).toBe("app…undefined")
				})
			})
		})
	})

	describe("usage -- in a lib", () => {
		const LIB = "FOO"
		function getꓽSXC(parent?: SoftExecutionContext): SoftExecutionContext {
			// TODO memoize ? (if !parent)
			return (parent || getRootSXC()).createChild().setLogicalStack({ module: LIB }) // <-- THIS
		}
		function hello(target: string, { SXC } = {} as { SXC?: SoftExecutionContext }): string {
			return getꓽSXC(SXC).xTry("hello", ({ SXC, ENV, logger }) => {
				expect(SXC.getShortLogicalStack()).toBe("FOO…hello") // always
				expect(SXC.getLogicalStack().startsWith("FOO›")).toBe(true)
				expect(SXC.getLogicalStack().endsWith("›hello")).toBe(true)
				const err = (SXC as any)._decorateErrorWithLogicalStack(new Error("TEST"))
				expect(err.message.startsWith("FOO…hello: ")).toBe(true) // always

				//logger.info('[This is a log entry]', {SXC, ENV})
				return `Hello, ${target}! (from ${SXC.getLogicalStack()})`
			})
		}
		function polite_hello(target: string, { SXC } = {} as { SXC?: SoftExecutionContext }): string {
			return getꓽSXC(SXC).xTry("add_honorifics", ({ SXC, ENV, logger }) => {
				return hello(`Mx. ${target}`, { SXC })
			})
		}
		function great_politely(target: string, { SXC } = {} as { SXC?: SoftExecutionContext }) {
			getꓽSXC(SXC).xTry("great", ({ SXC, ENV, logger }) => {
				const s = polite_hello(target, { SXC })
				expect(s).toBe("Hello, Mx. Offirmo! (from FOO›great›add_honorifics›hello)")
			})
		}

		it("should work -- 1 level(s)", () => {
			const s = hello("Offirmo")
			expect(s).toBe("Hello, Offirmo! (from FOO›hello)")
		})

		it("should work -- 2 level(s)", () => {
			const s = polite_hello("Offirmo")
			expect(s).toBe("Hello, Mx. Offirmo! (from FOO›add_honorifics›hello)")
		})

		it("should work", () => {
			great_politely("Offirmo")
		})
	})

	describe("_decorateErrorWithLogicalStack()", () => {
		describe("on a new error", () => {
			it("should work", () => {
				getRootSXC().setLogicalStack({ module: "foo" })

				getRootSXC().xTry("bar", ({ SXC }) => {
					const raw_error = new TypeError("TEST!")
					const err = (SXC as any)._decorateErrorWithLogicalStack(raw_error)
					//displayError(err)
					//console.error(err.stack)
					expect(err).toBe(raw_error) // yes, this internal

					expect(err.message).toBe("foo…bar: TEST!")
				})
			})

			it("should change both the message and the stacktrace to avoid confusion", () => {
				getRootSXC().setLogicalStack({ module: "foo" })

				getRootSXC().xTry("bar", ({ SXC }) => {
					const raw_error = new TypeError("TEST!")
					const err = (SXC as any)._decorateErrorWithLogicalStack(raw_error)
					expect(err.message).toBe("foo…bar: TEST!")
					expect(err.stack.startsWith("TypeError: foo…bar: TEST!")).toBe(true)
				})
			})
		})

		describe("on an already decorated error", () => {
			it("should not redecorate the error", () => {
				let raw_error: any = null
				let err_from_l2: any = null
				let err_from_l1: any = null
				getRootSXC().setLogicalStack({ module: "test" })
				try {
					getRootSXC().xTry("level1", ({ SXC: SXC1, ENV }) => {
						try {
							SXC1.xTry("level2", ({ SXC: SXC2 }) => {
								raw_error = new TypeError("Test!")
								throw raw_error
							})
						} catch (err) {
							err_from_l2 = err
							throw err
						}
					})
				} catch (err) {
					err_from_l1 = err

					//displayError(err_from_l2)
					//console.error(err.stack)
					expect(raw_error.message).toBe("Test!")
					expect(raw_error.stack.startsWith("TypeError: Test!")).toBe(true)
					expect(err_from_l2.message).toBe("test…level2: Test!")
					expect(err_from_l2.stack.startsWith("TypeError: test…level2: Test!")).toBe(true)
					expect(err_from_l1.message).toBe("test…level2: Test!")
					expect(err_from_l1.stack.startsWith("TypeError: test…level2: Test!")).toBe(true)
				}
			})

			describe("when the stack has branched", () => {
				it.todo("should work")
			})
		})
	})
})

/////////////////////////////////////////////////

import { afterEach, beforeAll, describe, expect, it } from "vitest"

import { error_to_string, displayError } from "@monorepo-private/print-error-to-terminal"

import { LIB } from "../../../consts.ts"
import { type SoftExecutionContext, getRootSXC, _TEST_ONLY__reset_root_SXC } from "../../../index.ts"
