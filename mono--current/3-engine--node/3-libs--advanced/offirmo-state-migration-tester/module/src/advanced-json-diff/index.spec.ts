/////////////////////////////////////////////////

describe(`${LIB} - json diff`, () => {
	describe("get_advanced_diff()", () => {
		describe("when no difference - by value", () => {
			it("should work", () => {
				expect(get_advanced_diff({ foo: 33 }, { foo: 33 })).toBeUndefined()

				expect(get_advanced_diff([{ foo: 33 }], [{ foo: 33 }])).toBeUndefined()
			})
		})

		describe("when actual difference", () => {
			it("should work", () => {
				const diff = get_advanced_diff({ foo: 33 }, { foo: 42 })
				expect(diff).toHaveProperty("foo", [33, 42])
			})
		})

		describe("when non-semantic difference: @monorepo-private/state-migration-tester", () => {
			it("should work", () => {
				const test_obj_a = { uuid: "uu1ABCDEFGHIJKLMNOPQRSTU" }
				const test_obj_b = { uuid: "uu1FGHIJKLMNOPQRSTUVWXYZ" }

				expect(get_advanced_diff(test_obj_a, test_obj_b), "advanced diff").toBeUndefined()

				// but the raw diff would have
				expect(get_raw_diff(test_obj_a, test_obj_b), "raw diff").toHaveProperty("uuid")
			})
		})
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import { LIB } from "../consts.ts"

import { get_raw_diff, get_advanced_diff } from "./index.ts"
