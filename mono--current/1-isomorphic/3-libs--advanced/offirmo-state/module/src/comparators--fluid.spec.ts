import { describe, it, expect } from "vitest"

import {
	DEMO_USTATE,
	DEMO_BASE_STATE,
	DEMO_BASE_STATE_WITH_SUBS,
	DEMO_TSTATE,
	DEMO_ROOT_STATE,
} from "./__fixtures/examples.ts"
import { fluid_select } from "./comparators--fluid.ts"
import { LIB } from "./consts.ts"

describe(`${LIB} - FLUID selectors`, () => {
	describe("hasꓽhigher_investment_than()", () => {
		describe("on semantic equality", () => {
			it("should select the selected", () => {
				const existing = DEMO_ROOT_STATE
				const candidate = {
					...DEMO_ROOT_STATE,
				}
				expect(fluid_select(candidate).hasꓽhigher_investment_than(existing)).toBe(true)
				expect(fluid_select(existing).hasꓽhigher_investment_than(candidate)).toBe(true)
			})
		})

		describe("on nominal case of increasing revisions", () => {
			it("should select the highest revision", () => {
				const existing = DEMO_ROOT_STATE
				const candidate = {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						revision: DEMO_ROOT_STATE.u_state.revision + 1,
					},
				}
				expect(fluid_select(candidate).hasꓽhigher_investment_than(existing)).toBe(true)
				expect(fluid_select(existing).hasꓽhigher_investment_than(candidate)).toBe(false)
			})
		})

		describe("on fork case", () => {
			it("should select the version with most recent involvement", () => {
				const existing = DEMO_ROOT_STATE
				const candidate = {
					...DEMO_ROOT_STATE,
					last_user_investment_tms: DEMO_ROOT_STATE.last_user_investment_tms + 10,
				}
				expect(fluid_select(candidate).hasꓽhigher_investment_than(existing)).toBe(true)
				expect(fluid_select(existing).hasꓽhigher_investment_than(candidate)).toBe(false)
			})
		})

		describe("on tricky case of reverse version vs. revision", () => {
			it("should select the lower schema version with higher involvement", () => {
				const existing = DEMO_ROOT_STATE
				const candidate = {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: DEMO_ROOT_STATE.u_state.schema_version - 1,
						revision: DEMO_ROOT_STATE.u_state.revision + 1,
					},
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: DEMO_ROOT_STATE.t_state.schema_version - 1,
						//revision: DEMO_ROOT_STATE.t_state.revision + 1,
					},
				}
				expect(fluid_select(candidate).hasꓽhigher_investment_than(existing)).toBe(true)
				expect(fluid_select(existing).hasꓽhigher_investment_than(candidate)).toBe(false)
			})
		})
	})

	describe.todo("hasꓽvaluable_difference_with")
})
