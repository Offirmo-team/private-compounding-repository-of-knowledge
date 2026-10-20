import { describe, it, expect } from "vitest"

import {
	asap_but_not_synchronous,
	asap_but_out_of_immediate_execution,
	asap_but_out_of_current_event_loop,
	schedule_when_idle_but_within_human_perception,
	schedule_when_idle_but_not_too_far,
} from "./semantic.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/utils--async", () => {
	//describe("semantic functions", { retry: 3 }, () => {
	describe("semantic functions", () => {
		it("should work in correct order", () =>
			new Promise<void>((resolve, reject) => {
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
					try {
						//console.log(executions)
						expect(executions, "0ms").toStrictEqual(["sync", "ans"])
					} catch (err) {
						reject(err)
					}
				}, 0)

				setTimeout(() => {
					try {
						//console.log(executions)
						expect(executions, "5ms").toStrictEqual(["sync", "ans", "aooel", "aooie"])
					} catch (err) {
						reject(err)
					}
				}, 5)

				let promise_resolved = false

				setTimeout(() => {
					try {
						//console.log(executions)
						expect(executions, "50ms").toStrictEqual(EXPECTED_ORDERED_FULL_EXECUTION)

						expect(promise_resolved, "promise_resolved").toBe(true)
						resolve()
					} catch (err) {
						reject(err)
					}
				}, 100)

				Promise.all([sintf, siwhp, aooel, aooie, ans])
					.then((arr) => {
						expect(executions, "Promise.all").toStrictEqual(EXPECTED_ORDERED_FULL_EXECUTION)
						expect([...arr].sort(), "return values").toStrictEqual(
							[...EXPECTED_ORDERED_FULL_EXECUTION.filter((s) => s !== "sync")].sort(),
						)
						promise_resolved = true
					})
					.catch(reject)
			}))
	})
})
