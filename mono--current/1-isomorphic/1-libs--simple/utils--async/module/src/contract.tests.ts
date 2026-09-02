import { expect } from "chai"

/////////////////////////////////////////////////
// This is a sort of "contract spec"
// to ensure our understanding of the underlying functions is correct

describe("@monorepo-private/utils--async", function () {
	describe("underlying functions", function () {
		this.retries(3)

		it("should work in correct order", (done) => {
			const executions: string[] = []

			function callback(id: string) {
				executions.push(id)
			}

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

			setTimeout(() => {
				//console.log(executions)
				expect(executions).to.deep.equal([
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
				done()
			}, 20)
		})

		it("should work in correct order -- setTimeout", (done) => {
			const executions: string[] = []

			function callback(id: string) {
				executions.push(id)
			}

			setTimeout(() => callback("timeout--1"), 1)
			setTimeout(() => callback("timeout--undef"), undefined as any)
			setTimeout(() => callback("timeout--0"), 0)
			setTimeout(() => callback("timeout--2"), 2)

			setTimeout(() => {
				//console.log(executions)
				expect(executions).to.deep.equal([
					"timeout--1",
					"timeout--undef",
					"timeout--0", // not reordered
					"timeout--2",
				])
				done()
			}, 20)
		})
	})
})
