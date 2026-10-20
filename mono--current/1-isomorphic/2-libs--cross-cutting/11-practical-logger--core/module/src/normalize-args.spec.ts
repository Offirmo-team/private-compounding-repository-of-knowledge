/////////////////////////////////////////////////

describe(`${LIB} - normalize args`, () => {
	function getNormalizedMessage(...args: any[]): string {
		return normalizeArguments(arguments)[0]
	}
	function getNormalizedDetails(...args: any[]): LogDetails {
		return normalizeArguments(arguments)[1]
	}
	const err: XXError = new Error("err_msg!") as any
	err.statusCode = 1234
	err.details = {
		hello: 42,
	}

	describe("normalization of arg[0] = message", () => {
		describe("on nominal calls", () => {
			it("should work", () => {
				expect(getNormalizedMessage("foo"), "n1").toBe("foo")
				expect(getNormalizedMessage("foo", { bar: 42 }), "n2").toBe("foo")

				expect(getNormalizedMessage("problem", { err }), "e1").toBe("problem")
				expect(getNormalizedMessage(undefined, { err }), "e2").toBe("err_msg!")
				expect(getNormalizedMessage("problem", { err, bar: 42 }), "e3").toBe("problem")
			})
		})

		describe("on tolerated calls", () => {
			it("should work", () => {
				expect(getNormalizedMessage(err), "only direct error").toBe("err_msg!")
				expect(getNormalizedMessage("problem", err), "direct error as details").toBe("problem")
				expect(getNormalizedMessage({ bar: 42 }), "direct details").toBe("(no message)")
				expect(getNormalizedMessage({ bar: 42, message: "hello" }), "direct details + integrated message").toBe(
					"hello",
				)
			})
		})

		describe("on bad calls", () => {
			it("should work", () => {
				expect(getNormalizedMessage(), "<- none").toBe("(no message)")
				expect(getNormalizedMessage("hello", "world!"), "<- 2 str args").toBe("hello world!")
				expect(getNormalizedMessage("hello", "world!", { err, bar: 42 }, 42), "<- many args").toBe(
					"hello world! 42",
				)
				expect(getNormalizedMessage({ bar: 42 }, { baz: 33 }), "<- double details").toStrictEqual("(no message)")
				expect(getNormalizedMessage({ bar: 42 }, { baz: 33 }, err), "<- error anywhere - 1").toStrictEqual(
					"err_msg!",
				)
				expect(getNormalizedMessage({ bar: 42 }, { baz: 33 }, { err }), "<- error anywhere - 2").toStrictEqual(
					"err_msg!",
				)
			})
		})
	})

	describe("normalization of arg[1] = details", () => {
		describe("on nominal calls", () => {
			it("should work", () => {
				expect(getNormalizedDetails("foo"), "n1").toStrictEqual({})
				expect(getNormalizedDetails("foo", { bar: 42 }), "n2").toStrictEqual({ bar: 42 })

				expect(getNormalizedDetails("problem", { err }), "e1").toStrictEqual({ err })
				expect(getNormalizedDetails(undefined, { err }), "e2").toStrictEqual({ err })
				expect(getNormalizedDetails("problem", { err, bar: 42 }), "e3").toStrictEqual({ err, bar: 42 })
			})
		})

		describe("on tolerated calls", () => {
			it("should work", () => {
				expect(getNormalizedDetails(err), "only direct error").toStrictEqual({ err })
				expect(getNormalizedDetails("problem", err), "direct error as details").toStrictEqual({ err })
				expect(getNormalizedDetails({ bar: 42 }), "direct details").toStrictEqual({ bar: 42 })
				expect(
					getNormalizedDetails({ bar: 42, message: "hello" }),
					"direct details + integrated message",
				).toStrictEqual({ bar: 42 })
			})
		})

		describe("on bad calls", () => {
			it("should work", () => {
				expect(getNormalizedDetails(), "<- none").toStrictEqual({})
				expect(getNormalizedDetails("hello", "world!"), "<- 2 str args").toStrictEqual({})
				expect(getNormalizedDetails("hello", "world!", 42, { err, bar: 42 }), "<- many args").toStrictEqual({
					bar: 42,
					err,
				})
				expect(getNormalizedDetails({ bar: 42 }, { baz: 33 }), "<- double details").toStrictEqual({
					bar: 42,
					baz: 33,
				})
				expect(getNormalizedDetails({ bar: 42 }, { baz: 33 }, err), "<- error anywhere - 1").toStrictEqual({
					bar: 42,
					baz: 33,
					err,
				})
				expect(getNormalizedDetails({ bar: 42 }, { baz: 33 }, { err }), "<- error anywhere - 2").toStrictEqual({
					bar: 42,
					baz: 33,
					err,
				})
			})
		})
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import type { LogDetails } from "@monorepo-private/practical-logger--types"
import { type XXError } from "@monorepo-private/utils--error"

import { LIB } from "./consts.ts"
import { normalizeArguments } from "./normalize-args.ts"
