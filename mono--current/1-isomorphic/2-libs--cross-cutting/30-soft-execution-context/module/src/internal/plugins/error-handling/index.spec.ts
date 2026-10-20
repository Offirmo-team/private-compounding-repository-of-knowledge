/////////////////////////////////////////////////

describe(`${LIB} -- plugins -- Error Handling`, () => {
	beforeAll(_TEST_ONLY__reset_root_SXC)
	afterEach(_TEST_ONLY__reset_root_SXC)

	describe("details storage and retrieval", () => {
		it("should provide default details", () => {
			getRootSXC().setLogicalStack({ module: "test" })
			try {
				getRootSXC().xTry("test", () => {
					const raw_error = new Error("Test error!")
					throw raw_error
				})
			} catch (err: any) {
				//console.log(err)
				//displayError(err)
				// IMPORTANT
				// The error should be partially decorated
				// BUT since the error can still bubble up,
				// it should not be fully decorated
				expect(err.message).toBe("test…test: Test error!") // short stack was added
				expect(Object.keys(err.details).sort()).toStrictEqual(
					["ENV", "TIME", "SESSION_DURATION_MS", "CHANNEL", "logicalStack"].sort(),
				)
				expect(err).toHaveProperty("_temp")
			}
		})

		describe("setErrorDetails()", () => {
			it("should work", () => {
				const err = getRootSXC()
					.setLogicalStack({ module: "test" })
					.setErrorDetails({
						foo: "bar",
					})
					.createError("foo", { gloups: "gnokman" })

				expect(err.details).toHaveProperty("foo", "bar")
				expect(err.details).toHaveProperty("gloups", "gnokman")
			})
		})

		describe("setAnalyticsAndErrorDetails()", () => {
			it("should work", () => {
				const err = getRootSXC()
					.setLogicalStack({ module: "test" })
					.setAnalyticsAndErrorDetails({
						foo: "bar",
					})
					.createError("foo", { gloups: "gnokman" })

				expect(err.details).toHaveProperty("foo", "bar")
				expect(err.details).toHaveProperty("gloups", "gnokman")
			})
		})
	})

	describe("xTry()", () => {
		it.todo("should work")
	})

	describe("xTryCatch()", () => {
		it.todo("should work")
	})

	describe("xPromiseTry()", () => {
		it.todo("should work")
	})

	describe("xNewPromise()", () => {
		it.todo("should work")
	})

	describe("final error event", () => {
		it.todo("should be emitted")

		it.todo("should have all the properties")
	})
})

/////////////////////////////////////////////////

import { afterEach, beforeAll, describe, expect, it } from "vitest"

import { displayError } from "@monorepo-private/print-error-to-terminal"

import { LIB } from "../../../consts.ts"
import { getRootSXC, _TEST_ONLY__reset_root_SXC } from "../../../index.ts"
