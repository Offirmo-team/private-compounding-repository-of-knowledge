/////////////////////////////////////////////////

describe(`@monorepo-private/print-error-to-terminal`, () => {
	describe("error_to_string()", () => {
		it("should work -- trivial error", () => {
			const err = new Error("foo")
			;(err as any).statusCode = 555

			const s = stripVTControlCharacters(error_to_string(err))
			//console.error(error_to_string(err), '\n' + s)
			expect(s).toContain("❗ Error ❗") // name
			expect(s).toContain('message: "foo"')
			expect(s).toContain('statusCode: "555"')
		})

		it("should work -- typed error", () => {
			const err = new TypeError("foo")
			;(err as any).statusCode = 555

			const s = stripVTControlCharacters(error_to_string(err))
			expect(s).toContain("❗ TypeError ❗") // name
			expect(s).toContain('message: "foo"')
			expect(s).toContain('statusCode: "555"')
		})

		it("should work -- advanced error -- framesToPop", () => {
			const err = createError("foo", {
				framesToPop: 3, // REM createError() will +1 that
			})

			const s = stripVTControlCharacters(error_to_string(err))
			//console.error(error_to_string(err), '\n' + s)
			expect(s).not.toContain("framesToPop: ") // should not be displayed as a prop
			expect(s).toContain("↳ ⟨frames popped: 4⟩") // displayed as part of the stack
		})

		it("should work -- advanced error -- extra field", () => {
			const err = createError("foo", {
				foo: 42,
			})

			const s = stripVTControlCharacters(error_to_string(err))
			//console.error(error_to_string(err), '\n' + s)
			expect(s).toContain("details:")
			expect(s).toContain('  foo: "42"')
		})

		it("should ensure the title mentions an error -- custom name", () => {
			// custom error
			function CustomException(this: Error & { stack: any }, message: string) {
				this.name = "CustomException"
				this.message = message || "XYZ will not run."
				this.stack = new Error().stack
			}
			CustomException.prototype = Object.create(Error.prototype)
			CustomException.prototype.constructor = CustomException

			// @ts-expect-error
			const err = new CustomException("foo")

			const s = stripVTControlCharacters(error_to_string(err))
			//console.error(error_to_string(err), '\n' + s)
			expect(s).toContain("┏━❗ ⟨Error⟩ CustomException ❗")
		})

		it("should ensure the title mentions an error -- no name", () => {
			// custom error
			function CustomException(this: Error & { stack: any }, message: string) {
				// @ts-expect-error
				this.name = undefined // the horror!
				this.message = message || "XYZ will not run."
				this.stack = new Error().stack
			}
			CustomException.prototype = Object.create(Error.prototype)
			CustomException.prototype.constructor = CustomException

			// @ts-expect-error
			const err = new CustomException("foo")

			const s = stripVTControlCharacters(error_to_string(err))
			//console.error(error_to_string(err), '\n' + s)
			expect(s).toContain("┏━❗ ⟨Error⟩ ⟨unnamed??⟩ ❗")
		})

		describe("cause chaining", () => {
			it("should work -- trivial error", () => {
				const err1 = new RangeError("bar")
				;(err1 as any).code = "ERR_CPU_USAGE"

				const err2 = new Error("foo")
				;(err2 as any).statusCode = 555
				err2.cause = err1

				const s = stripVTControlCharacters(error_to_string(err2))
				//console.error(error_to_string(err2), '\n' + s)
				expect(s).toContain("cause:")
				expect(s).toContain("┃ ┏━❗ RangeError ❗")
				expect(s).toContain('┃ ┃ message: "bar"')
				expect(s).toContain('┃ ┃ code: "ERR_CPU_USAGE"')
			})

			it("should work -- advanced error", () => {
				const err1 = createError(
					"bar",
					{
						statusCode: 555,
						foo: 42,
						framesToPop: 1,
					},
					RangeError,
				)

				const err2 = createError("foo", {
					statusCode: 555,
					foo: 42,
					framesToPop: 3,
					cause: err1,
				})

				const s = stripVTControlCharacters(error_to_string(err2))
				//console.error(error_to_string(err2), '\n' + s)
				expect(s).toContain("┃ cause:")
				expect(s).toContain("┃ ┏━❗ RangeError ❗")
				expect(s).toContain('┃ ┃ message: "RangeError: bar"')
				expect(s).toContain("┃ ┃ details:")
				expect(s).toContain('┃ ┃   foo: "42"')
				expect(s).toContain("┃ ┃ ↳ ⟨frames popped: 2⟩")
			})

			it("should work -- infinite loop -- trivial", () => {
				const err = new Error("foo")
				;(err as any).statusCode = 555
				err.cause = err

				const s = stripVTControlCharacters(error_to_string(err))
				//console.error(error_to_string(err), '\n' + s)
				expect(s).toContain("cause: ⟨CIRCULAR REFERENCE!!⟩")
			})
		})
	})

	describe("displayError()", () => {
		it("should work", () => {
			const err = new Error("foo")
			;(err as any).statusCode = 555

			displayError(err)
		})
	})
})

/////////////////////////////////////////////////

import { stripVTControlCharacters } from "node:util"

import { describe, expect, it } from "vitest"

import { createError } from "@monorepo-private/utils--error"

import { displayError, error_to_string } from "./index.ts"
