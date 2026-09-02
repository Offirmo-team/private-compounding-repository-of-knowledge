import { EOL } from "node:os"

import { expect } from "chai"

import spawnCorrectlyAndResolvesWithStdout from "./index.ts"
import type { SpawnError, ChildProcess } from "./index.ts"

/////////////////////////////////////////////////

describe(`@monorepo-private/spawn-correctly`, function () {
	describe("error handling", function () {
		function errorᐧshouldᐧhaveᐧexpectedᐧextraᐧproperties(err: any, cause?: Error): asserts err is SpawnError {
			//console.log(err)

			expect(err).to.have.ownProperty("stdout")
			expect(err).to.have.ownProperty("stderr")
			expect(err).to.have.ownProperty("reason")
			expect(err).to.have.ownProperty("code")
			expect(err).to.have.ownProperty("signal")

			expect(err).to.have.ownProperty("spawnCommand")
			expect(err).to.have.ownProperty("spawnArgs")
			expect(err).to.have.ownProperty("spawnOptions")
			expect(err).to.have.ownProperty("commandForLog", [err.spawnCommand, ...(err.spawnArgs ?? [])].join(" "))

			if (cause) {
				expect(err.cause).to.equal(cause)
			}
		}

		describe("when execution cant even start correctly (bad command)", function () {
			it("should report it properly", async () => {
				try {
					await spawnCorrectlyAndResolvesWithStdout({
						spawnCommand: "./foo/bar/baz",
					})
					throw new Error("should have failed!")
				} catch (err) {
					errorᐧshouldᐧhaveᐧexpectedᐧextraᐧproperties(err)

					expect(err.message).to.equal("spawn ./foo/bar/baz ENOENT")
					expect(err.code).to.equal(-2) // properly propagated
					expect(err.signal).to.be.null
				}
			})
		})

		describe("when execution cant even start correctly (bad options)", function () {
			it("should report it properly", async () => {
				try {
					await spawnCorrectlyAndResolvesWithStdout({
						spawnCommand: "echo",
						spawnArgs: ["foo"],
						spawnOptions: {
							stdio: "ignore", // this will break, we expect stdout!!
						},
					})
					throw new Error("should have failed!")
				} catch (err) {
					errorᐧshouldᐧhaveᐧexpectedᐧextraᐧproperties(err)

					//console.log(err)
					expect(err.message).to.equal("spawnCorrectly(): should have stdout!")
					expect(err.code).to.be.undefined
					expect(err.signal).to.be.undefined
				}
			})
		})

		describe("when execution ends with a FAILURE", function () {
			it("should report it properly", async () => {
				try {
					await spawnCorrectlyAndResolvesWithStdout({
						spawnCommand: "node",
						spawnArgs: ["./foo/bar/baz"],
					})
					throw new Error("should have failed!")
				} catch (err) {
					errorᐧshouldᐧhaveᐧexpectedᐧextraᐧproperties(err)

					expect(err.code).to.equal(1) // properly propagated
					expect(err.signal).to.be.null // mutually exclusive
					expect(err.message).to.include("Cannot find module")
				}
			})
		})

		describe("when execution is interrupted", function () {
			it("should report it properly", async () => {
				try {
					function instrument(child_process: ChildProcess) {
						setTimeout(() => {
							child_process.kill("SIGINT")
						}, 100)
					}
					const ೱresult = spawnCorrectlyAndResolvesWithStdout({
						spawnCommand: "sleep",
						spawnArgs: ["1"],
						extraOptions: { instrument },
					})

					await ೱresult

					throw new Error("should have failed!")
				} catch (err) {
					errorᐧshouldᐧhaveᐧexpectedᐧextraᐧproperties(err)

					//console.log(err)
					expect(err.signal).to.equal("SIGINT") // properly propagated
					expect(err.code).to.be.null // mutually exclusive
					expect(err.message).to.include("SIGINT")
				}
			})
		})
	})

	describe("when execution ends with a SUCCESS", function () {
		it("should capture and report stdout", async () => {
			const result = await spawnCorrectlyAndResolvesWithStdout({
				spawnCommand: "echo",
				spawnArgs: ["Hello, World!"],
			})

			expect(result).to.equal("Hello, World!")
		})

		it("should capture and report stdout -- trimming", async () => {
			const result = await spawnCorrectlyAndResolvesWithStdout({
				spawnCommand: "./node_modules/.bin/tsc",
				spawnArgs: ["--version"],
			})

			expect(result).to.include("Version")
			expect(result).not.to.include(EOL) // result should be trimmed
		})
	})
})
