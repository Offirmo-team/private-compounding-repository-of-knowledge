import { describe, it, expect } from "vitest"

import { DEMO_BASE_STATE_WITH_SUBS, DEMO_BUNDLE_STATE, DEMO_ROOT_STATE } from "./__fixtures/examples.ts"
import { LIB } from "./consts.ts"
import {
	complete_or_cancel_eager_mutation_propagating_possible_child_mutation,
	are_ustate_revision_requirements_met,
	enforceꓽimmutable,
	getꓽmutable_copy,
	createꓽActionⳇReconcile,
} from "./utils.ts"

/////////////////////////////////////////////////

describe(`${LIB} - utils`, () => {
	describe("enforceꓽimmutable", () => {
		it("should work", () => {
			expect(() => {
				// @ts-expect-error
				enforceꓽimmutable(DEMO_BASE_STATE_WITH_SUBS).subA.foo = 33
			}).toThrow("read only")
		})
	})

	describe("getꓽmutable_copy()", () => {
		interface Sub {
			foo: number
		}

		it("should deep copy a frozen object", () => {
			const original = enforceꓽimmutable<{ sub: Sub }>({ sub: { foo: 42 } })

			const copy = getꓽmutable_copy(original)
			copy.sub.foo = 33

			expect(copy).toEqual({ sub: { foo: 33 } })
			expect(original).toEqual({ sub: { foo: 42 } })
		})

		it("should deep copy a non-frozen object", () => {
			const original = { sub: { foo: 42 } }

			const copy = getꓽmutable_copy(original)
			copy.sub.foo = 33

			expect(copy).not.toBe(original)
			expect(original).toEqual({ sub: { foo: 42 } })
		})

		it("should deep copy a non-frozen object having frozen children", () => {
			// typical of a reducer: { ...state, x: … }
			const original = { sub: enforceꓽimmutable<Sub>({ foo: 42 }) }

			const copy = getꓽmutable_copy(original)
			copy.sub.foo = 33

			expect(copy).toEqual({ sub: { foo: 33 } })
			expect(original).toEqual({ sub: { foo: 42 } })
		})
	})

	describe("complete_or_cancel_eager_mutation_propagating_possible_child_mutation()", () => {
		describe("on a base state with sub states", () => {
			const previous = DEMO_BASE_STATE_WITH_SUBS

			it("should cancel the mutation -- if the sub-states had no changes at all", () => {
				const current_base = enforceꓽimmutable<typeof previous>({
					...previous,
					subC: {
						// the mutation was eager, in truth there was no change
						...previous.subC,
					},
				})
				const new_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
					previous,
					current_base,
				)
				expect(new_state).toBe(previous)
			})

			it.todo("should cancel the mutation -- if the sub-states had changes but no semantic")

			it("should throw -- if the state has an immediate increment", () => {
				const current_base = enforceꓽimmutable<typeof previous>({
					...previous,
					own_u: "bad!",
				})
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, current_base),
				).toThrow("not needed")
			})

			it("should throw -- if the state was already incremented", () => {
				const current_base = enforceꓽimmutable<typeof previous>({
					...previous,
					revision: 104, // bad
					subC: {
						...previous.subC,
						revision: 46,
						fizz: "hello",
					},
				})
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, current_base),
				).toThrow("already incremented")
			})

			it("should throw -- if the state has no change at all", () => {
				// warning against wrong use.
				// normal use should have at least a de+re-structuring
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, previous),
				).toThrow("didn't perform any mutation")
			})

			it("should complete the mutation if the sub-states had sub-increments", () => {
				const current_base = enforceꓽimmutable<typeof previous>({
					...previous,
					subC: {
						...previous.subC,
						revision: 46,
						fizz: "hello",
					},
				})
				const expected = enforceꓽimmutable<typeof previous>({
					...current_base,
					revision: 104,
				})
				const new_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
					previous,
					current_base,
				)
				expect(new_state).not.toBe(previous)
				expect(new_state).not.toBe(current_base)
				expect(new_state).toStrictEqual(expected)
			})
		})

		describe("on a bundled state", () => {
			const previous = DEMO_BUNDLE_STATE

			it("should throw -- if the state has no change at all", () => {
				// warning against wrong use.
				// normal use should have at least a de+re-structuring
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, previous),
				).toThrow("didn't perform any mutation")
			})

			it("should cancel the mutation -- if the sub-states had no changes at all", () => {
				const current_base = enforceꓽimmutable<typeof previous>([
					{
						...previous[0],
						subC: {
							// fake mutation, in truth there was no change
							...previous[0].subC,
						},
					},
					previous[1],
				])
				const new_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
					previous,
					current_base,
				)
				expect(new_state).toBe(previous)
			})

			it.todo("should cancel the mutation -- if the sub-states had changes but no semantic")
		})

		describe("on a root state", () => {
			const previous = DEMO_ROOT_STATE

			it("should throw -- if the state has no change at all", () => {
				// warning against wrong use.
				// normal use should have at least a de+re-structuring
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, previous),
				).toThrow("didn't perform any mutation")
			})

			it("should cancel the mutation -- if the sub-states had no changes at all", () => {
				const current_root = enforceꓽimmutable<typeof previous>({
					...previous,
					u_state: {
						...previous.u_state,
						subC: {
							...previous.u_state.subC,
						},
					},
				})
				const new_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
					previous,
					current_root,
				)
				expect(new_state).toBe(previous)
			})

			it("should NOT throw if the state has an immediate increment", () => {
				// this is outside the semantic world (should not be abused)
				const current_root = enforceꓽimmutable<typeof previous>({
					...previous,
					own_r: 888,
				})
				complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, current_root)
			})

			it("should increment if sub-increments", () => {
				const current_root = enforceꓽimmutable<typeof previous>({
					...previous,
					u_state: {
						...previous.u_state,
						subC: {
							...previous.u_state.subC,
							revision: 46,
							fizz: "hello",
						},
					},
				})
				const expected = enforceꓽimmutable<typeof previous>({
					...current_root,
					u_state: {
						...current_root.u_state,
						revision: 104,
					},
				})
				const new_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(
					previous,
					current_root,
				)
				expect(new_state).not.toBe(current_root)
				expect(new_state).not.toBe(previous)
				expect(new_state).toStrictEqual(expected)
			})

			it("should throw if already incremented", () => {
				const current_root = enforceꓽimmutable<typeof previous>({
					...previous,
					u_state: {
						...previous.u_state,
						revision: 104, // bad
						subC: {
							...previous.u_state.subC,
							revision: 46,
							fizz: "hello",
						},
					},
				})
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, current_root),
				).toThrow("already incremented")
			})
		})
	})

	describe("are_ustate_revision_requirements_met()", () => {
		it("should return true if no requirements", () => {
			const result = are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {})
			expect(result).toBe(true)
		})

		it("should return true if all requirements met", () => {
			const result = are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {
				subA: 333,
				subC: 24,
			})
			expect(result).toBe(true)
		})

		it("should return false if some requirements not met", () => {
			expect(
				are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {
					subA: 999999,
					subC: 24,
				}),
			).toBe(false)
			expect(
				are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {
					subA: 333,
					subC: 999999,
				}),
			).toBe(false)
		})

		it("should throw if non-matched requirement", () => {
			expect(() => are_ustate_revision_requirements_met(DEMO_ROOT_STATE, { subB: 42 })).toThrow(
				"sub state not found",
			)
		})
	})

	describe("action creators", () => {
		describe("createꓽActionⳇReconcile()", () => {
			it("should work", () => {
				const action = createꓽActionⳇReconcile(DEMO_ROOT_STATE)
				expect(action).toStrictEqual({
					type: "stdꓽreconcile",
					time: action.time,
					expected_revisions: {},
					state: DEMO_ROOT_STATE,
				})
			})
		})
	})
})
