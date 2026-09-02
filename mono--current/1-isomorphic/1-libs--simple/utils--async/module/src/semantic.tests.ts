import { expect } from "chai"

import {
	asap_but_not_synchronous,
	asap_but_out_of_immediate_execution,
	asap_but_out_of_current_event_loop,
	schedule_when_idle_but_within_human_perception,
	schedule_when_idle_but_not_too_far,
} from "./semantic.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/utils--async", function () {
	describe("semantic functions", function () {
		//this.retries(3)

		it("should work in correct order", (done) => {
			const executions: string[] = []

			function callback(id: string): string {
				executions.push(id)
				return id
			}

			// in reverse order to prove it works
			const sintf = schedule_when_idle_but_not_too_far(() => callback("sintf"))
			const siwhp = schedule_when_idle_but_within_human_perception(() => callback("siwhp"))
			const aooel = asap_but_out_of_current_event_loop(() => callback("aooel"))
			const aooie = asap_but_out_of_immediate_execution(() => callback("aooie"))
			const ans = asap_but_not_synchronous(() => callback("ans"))
			callback("sync")

			const EXPECTED_ORDERED_FULL_EXECUTION = ["sync", "ans", "aooel", "aooie", "sintf", "siwhp"]

			setTimeout(() => {
				//console.log(executions)
				expect(executions, "0ms").to.deep.equal(["sync", "ans"])
			}, 0)

			setTimeout(() => {
				//console.log(executions)
				expect(executions, "5ms").to.deep.equal(["sync", "ans", "aooel", "aooie"])
			}, 5)

			let promise_resolved = false

			setTimeout(() => {
				//console.log(executions)
				expect(executions, "50ms").to.deep.equal(EXPECTED_ORDERED_FULL_EXECUTION)

				expect(promise_resolved, "promise_resolved").to.be.true
				done()
			}, 100)

			Promise.all([sintf, siwhp, aooel, aooie, ans])
				.then((arr) => {
					expect(executions, "Promise.all").to.deep.equal(EXPECTED_ORDERED_FULL_EXECUTION)
					expect([...arr].sort(), "return values").to.deep.equal(
						[...EXPECTED_ORDERED_FULL_EXECUTION.filter((s) => s !== "sync")].sort(),
					)
					promise_resolved = true
				})
				.catch((err) => done(err))
		})
	})
})
