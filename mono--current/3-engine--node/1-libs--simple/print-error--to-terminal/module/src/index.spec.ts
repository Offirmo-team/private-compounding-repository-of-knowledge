import { stripVTControlCharacters } from "node:util"

import { expect } from "chai"

import { createError } from "@monorepo-private/utils--error"

import { displayError, error_to_string } from "./index.ts"

describe(`@monorepo-private/print-error-to-terminal`, () => {
	describe("error_to_string()", () => {
		it("should work -- trivial error", () => {
			const err = new Error("foo")
			;(err as any).statusCode = 555

			const s = stripVTControlCharacters(error_to_string(err))
			//console.error(error_to_string(err), '\n' + s)
			expect(s).to.include("❗ Error ❗") // name
			expect(s).to.include('message: "foo"')
			expect(s).to.include('statusCode: "555"')
		})

		it("should work -- typed error", () => {
			const err = new TypeError("foo")
			;(err as any).statusCode = 555

			const s = stripVTControlCharacters(error_to_string(err))
			expect(s).to.include("❗ TypeError ❗") // name
			expect(s).to.include('message: "foo"')
			expect(s).to.include('statusCode: "555"')
		})

		it("should work -- advanced error -- framesToPop", () => {
			const err = createError("foo", {
				framesToPop: 3, // REM createError() will +1 that
			})

			const s = stripVTControlCharacters(error_to_string(err))
			//console.error(error_to_string(err), '\n' + s)
			expect(s).not.to.include("framesToPop: ") // should not be displayed as a prop
			expect(s).to.include("↳ ⟨frames popped: 4⟩") // displayed as part of the stack
		})

		it("should work -- advanced error -- extra field", () => {
			const err = createError("foo", {
				foo: 42,
			})

			const s = stripVTControlCharacters(error_to_string(err))
			//console.error(error_to_string(err), '\n' + s)
			expect(s).to.include("details:")
			expect(s).to.include('  foo: "42"')
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
			expect(s).to.include("┏━❗ ⟨Error⟩ CustomException ❗")
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
			expect(s).to.include("┏━❗ ⟨Error⟩ ⟨unnamed??⟩ ❗")
		})

		describe("cause chaining", function () {
			it("should work -- trivial error", () => {
				const err1 = new RangeError("bar")
				;(err1 as any).code = "ERR_CPU_USAGE"

				const err2 = new Error("foo")
				;(err2 as any).statusCode = 555
				err2.cause = err1

				const s = stripVTControlCharacters(error_to_string(err2))
				//console.error(error_to_string(err2), '\n' + s)
				expect(s).to.include("cause:")
				expect(s).to.include("┃ ┏━❗ RangeError ❗")
				expect(s).to.include('┃ ┃ message: "bar"')
				expect(s).to.include('┃ ┃ code: "ERR_CPU_USAGE"')
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
				expect(s).to.include("┃ cause:")
				expect(s).to.include("┃ ┏━❗ RangeError ❗")
				expect(s).to.include('┃ ┃ message: "RangeError: bar"')
				expect(s).to.include("┃ ┃ details:")
				expect(s).to.include('┃ ┃   foo: "42"')
				expect(s).to.include("┃ ┃ ↳ ⟨frames popped: 2⟩")
			})

			it("should work -- infinite loop -- trivial", () => {
				const err = new Error("foo")
				;(err as any).statusCode = 555
				err.cause = err

				const s = stripVTControlCharacters(error_to_string(err))
				//console.error(error_to_string(err), '\n' + s)
				expect(s).to.include("cause: ⟨CIRCULAR REFERENCE!!⟩")
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
