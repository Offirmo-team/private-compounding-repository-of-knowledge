import { describe, it, expect } from "vitest"

/////////////////////////////////////////////////
// This is a sort of "contract spec"
// to ensure our understanding of the underlying functions is correct

describe("@monorepo-private/utils--async", () => {
	describe("underlying functions", { retry: 3 }, () => {
		it("should work in correct order", async () => {
			const executions: string[] = []

			function callback(id: string) {
				executions.push(id)
			}

			// vitest runs the test body inside a microtask, where promise jobs would jump ahead of process.nextTick()
			// → schedule from a fresh macrotask (as mocha did) to observe the regular event loop order
			await new Promise<void>((resolve) =>
				setImmediate(() => {
					// in reverse order to prove it works
					//requestIdleCallback(() => executions.push('idle'))
					setTimeout(() => callback("timeout--5"), 5)
					setTimeout(() => callback("timeout--4"), 4)
					setTimeout(() => callback("timeout--3"), 3)
					setTimeout(() => callback("timeout--2"), 2)

					// due to chrome cap, those 3x <=1ms are equivalent
					setTimeout(() => callback("timeout--1"), 1)
					setTimeout(() => callback("timeout--0"), 0)
					setTimeout(() => callback("timeout--undef"))

					setImmediate(() => callback("immediate"))
					Promise.resolve().then(() => callback("then"))
					queueMicrotask(() => callback("micro"))
					process.nextTick(() => callback("tick"))
					callback("sync")
					resolve()
				}),
			)

			await new Promise((resolve) => setTimeout(resolve, 20))

			//console.log(executions)
			expect(executions).toStrictEqual([
				"sync",
				"tick",
				"then",
				"micro", // the same
				"immediate",
				"timeout--1",
				"timeout--0",
				"timeout--undef", // Chrome: timeout <=1ms are the same
				"timeout--2",
				"timeout--3",
				"timeout--4",
				"timeout--5",
			])
		})

		it("should work in correct order -- setTimeout", async () => {
			const executions: string[] = []

			function callback(id: string) {
				executions.push(id)
			}

			setTimeout(() => callback("timeout--1"), 1)
			setTimeout(() => callback("timeout--undef"), undefined as any)
			setTimeout(() => callback("timeout--0"), 0)
			setTimeout(() => callback("timeout--2"), 2)

			await new Promise((resolve) => setTimeout(resolve, 20))

			//console.log(executions)
			expect(executions).toStrictEqual([
				"timeout--1",
				"timeout--undef",
				"timeout--0", // not reordered
				"timeout--2",
			])
		})
	})
})
