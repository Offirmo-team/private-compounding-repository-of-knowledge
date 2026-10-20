import { describe, it, expect } from "vitest"

import { NotFoundError } from "../klasses/index.ts"

import { getꓽattribute, getꓽmessage, getꓽname, isꓽError, isꓽErrorⵧrsrc_not_found } from "./index.ts"

/////////////////////////////////////////////////

describe(`@monorepo-private/utils--error`, () => {
	describe("v2 selectors", () => {
		describe("getꓽname()", () => {
			it("should return the name of an error", () => {
				expect(getꓽname(new TypeError("foo"))).toBe("TypeError")
				expect(getꓽname({ name: "Custom", message: "foo" })).toBe("Custom")
			})

			it("should fallback to a generic name", () => {
				expect(getꓽname(undefined)).toBe("Error")
				expect(getꓽname(null)).toBe("Error")
				expect(getꓽname("foo")).toBe("Error")
				expect(getꓽname({ name: 42 })).toBe("Error")
			})
		})

		describe("getꓽmessage()", () => {
			it("should return the message of an error", () => {
				expect(getꓽmessage(new Error("foo"))).toBe("foo")
			})

			it("should return a thrown string as is", () => {
				expect(getꓽmessage("foo")).toBe("foo")
			})

			it("should fallback to a generic message", () => {
				expect(getꓽmessage(undefined)).toBe("Something happened!")
				expect(getꓽmessage(42)).toBe("Something happened!")
				expect(getꓽmessage({ message: 42 })).toBe("Something happened!")
			})

			it("should normalize the unicode", () => {
				expect(getꓽmessage(new Error("Cafe\u0301")), "NFC").toBe("Caf\u00E9")
				expect(getꓽmessage("lone \uD800"), "well-formed").toBe("lone \uFFFD")
			})
		})

		describe("getꓽattribute()", () => {
			const err = Object.assign(new Error("foo"), { statusCode: 0, code: "Cafe\u0301" })

			it("should return the attribute, even if falsy", () => {
				expect(getꓽattribute(err, "statusCode", 500)).toBe(0)
			})

			it("should normalize string attributes", () => {
				expect(getꓽattribute(err, "code")).toBe("Caf\u00E9")
			})

			it("should return the fallback if missing or null", () => {
				expect(getꓽattribute(err, "missing", 500)).toBe(500)
				expect(getꓽattribute({ x: null }, "x", 500)).toBe(500)
				expect(getꓽattribute(undefined, "x", 500)).toBe(500)
				expect(getꓽattribute(err, "missing")).toBeUndefined()
			})
		})

		describe("isꓽError()", () => {
			it("should detect errors and error-like objects", () => {
				expect(isꓽError(new Error("foo"))).toBe(true)
				expect(isꓽError(new NotFoundError("foo"))).toBe(true)
				expect(isꓽError({ name: "Error", message: "foo" })).toBe(true)
			})

			it("should reject anything else", () => {
				expect(isꓽError(undefined)).toBe(false)
				expect(isꓽError(null)).toBe(false)
				expect(isꓽError("foo")).toBe(false)
				expect(isꓽError({ message: "foo" })).toBe(false)
			})
		})

		describe("isꓽErrorⵧrsrc_not_found()", () => {
			it("should detect not found errors", () => {
				expect(isꓽErrorⵧrsrc_not_found(new NotFoundError("foo")), "class").toBe(true)
				expect(isꓽErrorⵧrsrc_not_found({ statusCode: 404 }), "HTTP").toBe(true)
				expect(isꓽErrorⵧrsrc_not_found(Object.assign(new Error("foo"), { code: "ENOENT" })), "node").toBe(true)
				expect(isꓽErrorⵧrsrc_not_found(new Error("ENOENT: No such file or directory")), "node msg").toBe(true)
				expect(isꓽErrorⵧrsrc_not_found(new Error("User Not Found")), "msg").toBe(true)
				expect(isꓽErrorⵧrsrc_not_found("not found"), "string").toBe(true)
			})

			it("should reject other errors", () => {
				expect(isꓽErrorⵧrsrc_not_found(new Error("foo"))).toBe(false)
				expect(isꓽErrorⵧrsrc_not_found({ statusCode: 500 })).toBe(false)
				expect(isꓽErrorⵧrsrc_not_found(undefined)).toBe(false)
			})
		})
	})
})
