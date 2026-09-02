import { expect } from "chai"

import { DEMO_BASE_STATE_WITH_SUBS, DEMO_BUNDLE_STATE, DEMO_ROOT_STATE } from "./__fixtures/examples.ts"
import { LIB } from "./consts.ts"
import {
	complete_or_cancel_eager_mutation_propagating_possible_child_mutation,
	are_ustate_revision_requirements_met,
	enforceꓽimmutable,
	createꓽActionⳇReconcile,
} from "./utils.ts"

/////////////////////////////////////////////////

describe(`${LIB} - utils`, function () {
	describe("enforceꓽimmutable", function () {
		it("should work", () => {
			expect(() => {
				// @ts-expect-error
				enforceꓽimmutable(DEMO_BASE_STATE_WITH_SUBS).subA.foo = 33
			}).to.throw("read only")
		})
	})

	describe("complete_or_cancel_eager_mutation_propagating_possible_child_mutation()", function () {
		context("on a base state with sub states", function () {
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
				expect(new_state).to.equal(previous)
			})

			it("should cancel the mutation -- if the sub-states had changes but no semantic")

			it("should throw -- if the state has an immediate increment", () => {
				const current_base = enforceꓽimmutable<typeof previous>({
					...previous,
					own_u: "bad!",
				})
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, current_base),
				).to.throw("not needed")
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
				).to.throw("already incremented")
			})

			it("should throw -- if the state has no change at all", () => {
				// warning against wrong use.
				// normal use should have at least a de+re-structuring
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, previous),
				).to.throw("didn't perform any mutation")
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
				expect(new_state).not.to.equal(previous)
				expect(new_state).not.to.equal(current_base)
				expect(new_state).to.deep.equal(expected)
			})
		})

		context("on a bundled state", function () {
			const previous = DEMO_BUNDLE_STATE

			it("should throw -- if the state has no change at all", () => {
				// warning against wrong use.
				// normal use should have at least a de+re-structuring
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, previous),
				).to.throw("didn't perform any mutation")
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
				expect(new_state).to.equal(previous)
			})

			it("should cancel the mutation -- if the sub-states had changes but no semantic")
		})

		context("on a root state", function () {
			const previous = DEMO_ROOT_STATE

			it("should throw -- if the state has no change at all", () => {
				// warning against wrong use.
				// normal use should have at least a de+re-structuring
				expect(() =>
					complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, previous),
				).to.throw("didn't perform any mutation")
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
				expect(new_state).to.equal(previous)
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
				expect(new_state).not.to.equal(current_root)
				expect(new_state).not.to.equal(previous)
				expect(new_state).to.deep.equal(expected)
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
				).to.throw("already incremented")
			})
		})
	})

	describe("are_ustate_revision_requirements_met()", function () {
		it("should return true if no requirements", () => {
			const result = are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {})
			expect(result).to.be.true
		})

		it("should return true if all requirements met", () => {
			const result = are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {
				subA: 333,
				subC: 24,
			})
			expect(result).to.be.true
		})

		it("should return false if some requirements not met", () => {
			expect(
				are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {
					subA: 999999,
					subC: 24,
				}),
			).to.be.false
			expect(
				are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {
					subA: 333,
					subC: 999999,
				}),
			).to.be.false
		})

		it("should throw if non-matched requirement", () => {
			expect(() => are_ustate_revision_requirements_met(DEMO_ROOT_STATE, { subB: 42 })).to.throw(
				"sub state not found",
			)
		})
	})

	describe("action creators", function () {
		describe("createꓽActionⳇReconcile()", function () {
			it("should work", () => {
				const action = createꓽActionⳇReconcile(DEMO_ROOT_STATE)
				expect(action).to.deep.equal({
					type: "stdꓽreconcile",
					time: action.time,
					expected_revisions: {},
					state: DEMO_ROOT_STATE,
				})
			})
		})
	})
})
