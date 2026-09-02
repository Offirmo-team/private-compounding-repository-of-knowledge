import { expect } from "chai"

import { displayError } from "@monorepo-private/print-error-to-terminal"

import { LIB } from "../../../consts.ts"
import { getRootSXC, _TEST_ONLY__reset_root_SXC } from "../../../index.ts"

describe(`${LIB} -- plugins -- Error Handling`, function () {
	function _mocha_bug_clean_global() {
		// https://github.com/mochajs/mocha/issues/4954
		_TEST_ONLY__reset_root_SXC()
	}
	before(_TEST_ONLY__reset_root_SXC)
	afterEach(_TEST_ONLY__reset_root_SXC)

	describe("details storage and retrieval", function () {
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
				expect(err.message).to.equal("test…test: Test error!") // short stack was added
				expect(err.details).to.have.all.keys("ENV", "TIME", "SESSION_DURATION_MS", "CHANNEL", "logicalStack")
				expect(err).to.have.property("_temp")
			}

			_mocha_bug_clean_global()
		})

		describe("setErrorDetails()", function () {
			it("should work", () => {
				const err = getRootSXC()
					.setLogicalStack({ module: "test" })
					.setErrorDetails({
						foo: "bar",
					})
					.createError("foo", { gloups: "gnokman" })

				expect(err.details).to.have.property("foo", "bar")
				expect(err.details).to.have.property("gloups", "gnokman")

				_mocha_bug_clean_global()
			})
		})

		describe("setAnalyticsAndErrorDetails()", function () {
			it("should work", () => {
				const err = getRootSXC()
					.setLogicalStack({ module: "test" })
					.setAnalyticsAndErrorDetails({
						foo: "bar",
					})
					.createError("foo", { gloups: "gnokman" })

				expect(err.details).to.have.property("foo", "bar")
				expect(err.details).to.have.property("gloups", "gnokman")

				_mocha_bug_clean_global()
			})
		})
	})

	describe("xTry()", function () {
		it("should work")
	})

	describe("xTryCatch()", function () {
		it("should work")
	})

	describe("xPromiseTry()", function () {
		it("should work")
	})

	describe("xNewPromise()", function () {
		it("should work")
	})

	describe("final error event", function () {
		it("should be emitted")

		it("should have all the properties")
	})
})
