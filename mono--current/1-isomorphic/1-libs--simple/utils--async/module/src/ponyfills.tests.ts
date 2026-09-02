import { expect } from "chai"

import { nextTick as nextTick_p, setImmediate as setImmediate_p, requestIdleCallback } from "./ponyfills.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/utils--async", function () {
	describe("ponyfills", function () {
		this.retries(5)

		it("should work in correct order", (done) => {
			const executions: string[] = []

			function callback(id: string) {
				executions.push(id)
			}

			// actual expected order
			const EXPECTED_SYNC = ["sync"]
			const EXPECTED_MICROTASKS = ["tickP", "tick", "then"]
			const EXPECTED_CURRENT_EVENT_LOOP = ["immediateP", "immediate"]
			const EXPECTED_NEXT_EVENT_LOOP = [
				"timeout--1",
				"timeout--0",
				"timeout--undef", // interesting, timeout 0 and 1 are not reordered
			]
			const EXPECTED_CLOSE = ["timeout--20", "timeout--30"]
			const EXPECTED_IDLE = ["idleP"]
			const EXPECTED_LATER = ["timeout--40", "timeout--50"]

			// invocation in reverse order to prove it works
			setTimeout(() => callback("timeout--50"), 50)
			setTimeout(() => callback("timeout--40"), 40)
			requestIdleCallback(() => executions.push("idleP"))
			setTimeout(() => callback("timeout--30"), 30)
			setTimeout(() => callback("timeout--20"), 20)
			setTimeout(() => callback("timeout--1"), 1)
			setTimeout(() => callback("timeout--0"), 0)
			setTimeout(() => callback("timeout--undef"), undefined as any)
			setImmediate_p(() => callback("immediateP"))
			setImmediate(() => callback("immediate"))
			Promise.resolve().then(() => callback("then"))
			nextTick_p(() => callback("tickP"))
			process.nextTick(() => callback("tick"))
			callback("sync")

			expect(executions, "sync").to.deep.equal([...EXPECTED_SYNC])

			setTimeout(() => {
				//console.log(executions)
				expect(executions, "a while").to.deep.equal([
					...EXPECTED_SYNC,
					...EXPECTED_MICROTASKS,
					...EXPECTED_CURRENT_EVENT_LOOP,
					...EXPECTED_NEXT_EVENT_LOOP,
					...EXPECTED_CLOSE,
					...EXPECTED_IDLE,
					...EXPECTED_LATER,
				])
				done()
			}, 50)
		})
	})
})
