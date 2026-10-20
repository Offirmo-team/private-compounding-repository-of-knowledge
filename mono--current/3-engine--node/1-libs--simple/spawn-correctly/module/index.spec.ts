/////////////////////////////////////////////////

describe(`@monorepo-private/spawn-correctly`, () => {
	describe("error handling", () => {
		// every property a rejection is expected to be decorated with
		const DECORATIONS = [
			"stdout",
			"stderr",
			"reason",
			"code",
			"signal",
			"spawnCommand",
			"spawnArgs",
			"spawnOptions",
			"commandForLog",
		] as const satisfies readonly (keyof SpawnError)[]

		function expectᐧerrorᐧtoᐧhaveᐧextraᐧproperties(err: any, cause?: Error): asserts err is SpawnError {
			expect(Object.keys(err)).toEqual(expect.arrayContaining([...DECORATIONS]))
			expect(err.commandForLog).toBe([err.spawnCommand, ...(err.spawnArgs ?? [])].join(" "))

			if (cause) {
				expect(err.cause).toBe(cause)
			}
		}

		describe("when execution cant even start correctly (bad command)", () => {
			it("should report it properly", async () => {
				const err = await _assert_promise_rejection(
					ೱspawnCorrectlyAndResolvesWithStdout({
						spawnCommand: "./foo/bar/baz",
					}),
				)
				expectᐧerrorᐧtoᐧhaveᐧextraᐧproperties(err)

				expect(err.message).toBe("spawn ./foo/bar/baz ENOENT")
				expect(err.code).toBe(-2) // properly propagated
				expect(err.signal).toBeNull()
			})
		})

		describe("when execution cant even start correctly (bad options)", () => {
			it("should report it properly", async () => {
				const err = await _assert_promise_rejection(
					ೱspawnCorrectlyAndResolvesWithStdout({
						spawnCommand: "echo",
						spawnArgs: ["foo"],
						spawnOptions: {
							stdio: "ignore", // this will break, we require stdout
						},
					}),
				)
				expectᐧerrorᐧtoᐧhaveᐧextraᐧproperties(err)

				expect(err.message).toContain("ೱspawnCorrectly(): should have stdout")
				expect(err.code).toBeUndefined()
				expect(err.signal).toBeUndefined()
			})
		})

		describe("when execution ends with a FAILURE", () => {
			it("should report it properly", async () => {
				const err = await _assert_promise_rejection(
					ೱspawnCorrectlyAndResolvesWithStdout({
						spawnCommand: "node",
						spawnArgs: ["./foo/bar/baz"],
					}),
				)
				expectᐧerrorᐧtoᐧhaveᐧextraᐧproperties(err)

				expect(err.code).toBe(1) // properly propagated
				expect(err.signal).toBeNull() // mutually exclusive
				expect(err.message).toContain("Cannot find module")
			})
		})

		describe("when execution is interrupted", () => {
			it("should report it properly", async () => {
				function instrument(child_process: ChildProcess) {
					setTimeout(() => {
						child_process.kill("SIGINT")
					}, 100)
				}

				const err = await _assert_promise_rejection(
					ೱspawnCorrectlyAndResolvesWithStdout({
						spawnCommand: "sleep",
						spawnArgs: ["1"],
						extraOptions: { instrument },
					}),
				)
				expectᐧerrorᐧtoᐧhaveᐧextraᐧproperties(err)

				expect(err.signal).toBe("SIGINT") // properly propagated
				expect(err.code).toBeNull() // mutually exclusive
				expect(err.message).toContain("SIGINT")
			})
		})
	})

	describe("when execution ends with a SUCCESS", () => {
		it("should capture and report stdout", async () => {
			const result = await ೱspawnCorrectlyAndResolvesWithStdout({
				spawnCommand: "echo",
				spawnArgs: ["Hello, World!"],
			})

			expect(result).toBe("Hello, World!")
		})

		it("should capture and report stdout -- trimming", async () => {
			const result = await ೱspawnCorrectlyAndResolvesWithStdout({
				spawnCommand: "./node_modules/.bin/tsc",
				spawnArgs: ["--version"],
			})

			expect(result).toContain("Version")
			expect(result).not.toContain(EOL) // result is trimmed
		})

		it("should capture and report stdout -- without corrupting multi-byte characters", async () => {
			// "€" is 3 bytes in UTF-8 and stream chunks are 65536 bytes,
			// so a chunk boundary is guaranteed to land mid-character.
			const CHARᐧmultibyte = "€"
			const COUNT = 300_000

			const result = await ೱspawnCorrectlyAndResolvesWithStdout({
				spawnCommand: "node",
				spawnArgs: ["-e", `process.stdout.write("${CHARᐧmultibyte}".repeat(${COUNT}))`],
			})

			expect(result).not.toContain("�") // = replacement char = a character was decoded in halves
			expect(result).toHaveLength(COUNT)
		})
	})
})

/////////////////////////////////////////////////

// asserting on a rejection's decorations needs the error object itself,
// which .rejects cannot hand over -- but it does fail loudly when the
// promise resolves instead, which a bare .catch() would silently swallow.
async function _assert_promise_rejection(ೱ: Promise<unknown>): Promise<any> {
	await expect(ೱ).rejects.toThrow()

	return ೱ.catch((err) => err)
}

/////////////////////////////////////////////////

import { EOL } from "node:os"

import { describe, expect, it } from "vitest"

import ೱspawnCorrectlyAndResolvesWithStdout from "./index.ts"
import type { SpawnError, ChildProcess } from "./index.ts"
