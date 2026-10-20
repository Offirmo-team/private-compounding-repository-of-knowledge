import * as icepick from "icepick"
import { describe, it, expect } from "vitest"

import { COMMON_ERROR_FIELDS_EXTENDED } from "./fields.ts"
import type { XXError } from "./types.ts"
import { normalizeError } from "./util--normalize.ts"

describe(`@monorepo-private/utils--error`, () => {
	describe("normalizeError", () => {
		const _demo_error = new Error("[Test!]")

		describe("when AD-HOC re-creating the error object", () => {
			it("should work and re-create only if the object is not already an error -- base", () => {
				let err = new Error("foo!")
				err = icepick.freeze(err)

				const normalized_err = normalizeError(err)
				expect(normalized_err).toBe(err) // NO re-creation
			})

			it("should work and re-create only if the object is not already an error -- advanced", () => {
				let xerr: any = new TypeError("foo!")
				xerr.details = {
					foo: 42,
				}
				xerr = icepick.freeze(xerr)

				const normalized_err = normalizeError(xerr)
				expect(normalized_err).toBe(xerr) // NO re-creation
			})

			it("should work on anything -- undefined", () => {
				const normalized_err = normalizeError(undefined as any)
				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe('[non-error: "undefined" thrown!]')
			})

			it("should work on anything -- null", () => {
				const normalized_err = normalizeError(null as any)
				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe('[non-error: "null" thrown!]')
			})

			it("should work on anything -- number", () => {
				const normalized_err = normalizeError(-42 as any)
				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe('[non-error of type "number" thrown!]')
			})

			it("should work on anything -- string", () => {
				const normalized_err = normalizeError("foo" as any)
				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe('[non-error of type "string" thrown: "foo"!]')
			})

			it("should work on anything -- empty object", () => {
				const normalized_err = normalizeError({} as any)
				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe("[object with no error shape thrown!]")
			})

			it("should work on anything -- vague object", () => {
				const badly_shaped = { message: "foo!" } as any

				const normalized_err = normalizeError(badly_shaped)
				expect(normalized_err).not.toBe(badly_shaped)

				expect(normalized_err instanceof Error).toBe(true)
				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe("foo!")
			})
		})

		describe("when ALWAYS re-creating the error object", () => {
			it("should work and preserve the constructor", () => {
				let xerr: any = new TypeError("foo!")
				xerr.details = {
					foo: 42,
				}
				xerr = icepick.freeze<any>(xerr)

				const normalized_err = normalizeError(xerr, { alwaysRecreate: true })
				expect(normalized_err).not.toBe(xerr)
				expect(normalized_err instanceof Error).toBe(true)

				;([...COMMON_ERROR_FIELDS_EXTENDED] as Array<keyof XXError>).forEach((f) => {
					expect(normalized_err[f], `sub field "${f}"`).toStrictEqual(xerr[f])
				})
				/*console.log({
					original_proto: Object.getPrototypeOf(xerr),
					normalized_proto: Object.getPrototypeOf(normalized_err),
				})*/
				expect(Object.getPrototypeOf(normalized_err), "proto").toBe(Object.getPrototypeOf(xerr))
			})

			it("should work on anything -- undefined", () => {
				const normalized_err = normalizeError(undefined as any, { alwaysRecreate: true })
				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe('[non-error: "undefined" thrown!]')
			})

			it("should work on anything -- null", () => {
				const normalized_err = normalizeError(null as any, { alwaysRecreate: true })
				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe('[non-error: "null" thrown!]')
			})

			it("should work on anything -- number", () => {
				const normalized_err = normalizeError(-42 as any, { alwaysRecreate: true })
				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe('[non-error of type "number" thrown!]')
			})

			it("should work on anything -- string", () => {
				const normalized_err = normalizeError("foo" as any)
				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe('[non-error of type "string" thrown: "foo"!]')
			})

			it("should work on anything -- empty object", () => {
				const badly_shaped = {} as any

				const normalized_err = normalizeError(badly_shaped)
				expect(normalized_err).not.toBe(badly_shaped)

				expect(normalized_err instanceof Error).toBe(true)
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe("[object with no error shape thrown!]")
			})

			it("should work on anything -- vague object", () => {
				const badly_shaped = { message: "foo!" } as any

				const normalized_err = normalizeError(badly_shaped)
				expect(normalized_err).not.toBe(badly_shaped)

				expect(normalized_err instanceof Error).toBe(true)
				expect(Object.getPrototypeOf(normalized_err)).toBe(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).toBe("foo!")
			})
		})
	})
})
