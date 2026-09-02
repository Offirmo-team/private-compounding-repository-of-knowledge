import { expect } from "chai"

import {
	DEMO_USTATE,
	DEMO_BASE_STATE,
	DEMO_BASE_STATE_WITH_SUBS,
	DEMO_TSTATE,
	DEMO_ROOT_STATE,
} from "./__fixtures/examples.ts"
import { LIB } from "./consts.ts"
import {
	getꓽschema_version,
	getꓽschema_versionⵧloose,
	getꓽrevision,
	getꓽrevisionⵧloose,
	getꓽtimestamp,
	getꓽtimestampⵧloose,
	getꓽbaseⵧloose,
} from "./selectors.ts"

describe(`${LIB} - selectors`, function () {
	describe("getꓽschema_version()", function () {
		describe("on a NON WithSchemaVersion", function () {
			it("should typecheck and throw", () => {
				expect(
					// @ts-expect-error
					() => getꓽschema_version({ foo: 42 }),
				).to.throw()
			})
		})

		describe("on WithSchemaVersion", function () {
			it("should work on correct data", () => {
				expect(getꓽschema_version({ schema_version: 33 })).to.equal(33)
			})
		})

		describe("on a BaseState", function () {
			it("should work on correct data", () => {
				expect(getꓽschema_version(DEMO_BASE_STATE)).to.equal(DEMO_BASE_STATE.schema_version)
				expect(getꓽschema_version(DEMO_ROOT_STATE.u_state)).to.equal(DEMO_ROOT_STATE.u_state.schema_version)
				expect(getꓽschema_version(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.schema_version)
			})
		})

		describe("on an bundled U+T state", function () {
			it("should work on special aggregated data", () => {
				expect(getꓽschema_version([DEMO_USTATE, DEMO_TSTATE])).to.equal(DEMO_USTATE.schema_version)
				expect(getꓽschema_version([DEMO_USTATE, DEMO_TSTATE])).to.equal(DEMO_TSTATE.schema_version)
			})

			it("should typecheck and throw on non-matching", () => {
				expect(
					// @ts-expect-error
					() => getꓽschema_version([]),
				).to.throw()

				expect(
					// @ts-expect-error
					() => getꓽschema_version([DEMO_TSTATE, DEMO_USTATE]),
				).to.throw()

				expect(
					// @ts-expect-error
					() => getꓽschema_version([DEMO_USTATE, DEMO_TSTATE, DEMO_USTATE]),
				).to.throw()
			})

			it("should throw on misaligned", () => {
				expect(() =>
					getꓽschema_version([
						DEMO_USTATE,
						{
							...DEMO_TSTATE,
							schema_version: 99,
						},
					]),
				).to.throw()
			})
		})

		describe("on a root state", function () {
			it("should work on correct data", () => {
				expect(getꓽschema_version(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.u_state.schema_version)
			})

			it("should typecheck and throw on non-matching", () => {
				expect(
					// @ts-expect-error
					() => getꓽschema_version({}),
				).to.throw()

				expect(
					// @ts-expect-error
					() => getꓽschema_version({ u_state: DEMO_TSTATE, t_state: DEMO_USTATE }),
				).to.throw()

				expect(
					// @ts-expect-error
					() => getꓽschema_version({ u_state: DEMO_USTATE }),
				).to.throw()
			})

			it("should throw when any U/T schemas is mismatching", () => {
				expect(() =>
					getꓽschema_version({
						...DEMO_ROOT_STATE,
						u_state: {
							...DEMO_ROOT_STATE.u_state,
							schema_version: 99,
						},
					}),
				).to.throw()

				expect(() =>
					getꓽschema_version({
						...DEMO_ROOT_STATE,
						t_state: {
							...DEMO_ROOT_STATE.t_state,
							schema_version: 99,
						},
					}),
				).to.throw()
			})
		})
	})

	describe("getꓽschema_versionⵧloose()", function () {
		it("should work on non matching", () => {
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose(undefined)).to.equal(0)
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose(null)).to.equal(0)
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose(0)).to.equal(0)
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose(new Error("Test!"))).to.equal(0)
		})

		it("should work on nominal correct data", () => {
			expect(getꓽschema_versionⵧloose({ schema_version: 33 })).to.equal(33)
			expect(getꓽschema_versionⵧloose(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.u_state.schema_version)
			expect(getꓽschema_versionⵧloose(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.schema_version)
			expect(getꓽschema_versionⵧloose(DEMO_USTATE)).to.equal(DEMO_USTATE.schema_version)
			expect(getꓽschema_versionⵧloose(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(
				DEMO_BASE_STATE_WITH_SUBS.subA.schema_version,
			)
		})

		it("should work on special aggregated data, even when old", () => {
			expect(getꓽschema_versionⵧloose([DEMO_USTATE, DEMO_TSTATE] as any)).to.equal(DEMO_USTATE.schema_version)
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose([{ schema_version: 33 }, null])).to.equal(33)
		})
	})

	describe("getꓽrevision()", function () {
		it("should work on correct data", () => {
			expect(getꓽrevision({ revision: 33 })).to.equal(33)
			expect(getꓽrevision(DEMO_ROOT_STATE)).to.equal(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision,
			)
			expect(getꓽrevision([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).to.equal(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision,
			)
			expect(getꓽrevision(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.revision)
			expect(getꓽrevision(DEMO_USTATE)).to.equal(DEMO_USTATE.revision)
			expect(getꓽrevision(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(DEMO_BASE_STATE_WITH_SUBS.subA.revision)
		})

		it("should throw on non-matching", () => {
			expect(
				// @ts-expect-error
				() => getꓽrevision({ foo: 42 }),
			).to.throw()
		})
	})

	describe("getꓽrevisionⵧloose()", function () {
		it("should work on correct data", () => {
			expect(getꓽrevisionⵧloose({ revision: 33 })).to.equal(33)
			expect(getꓽrevisionⵧloose(DEMO_ROOT_STATE)).to.equal(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision,
			)
			expect(getꓽrevisionⵧloose([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).to.equal(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision,
			)
			expect(getꓽrevisionⵧloose(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.revision)
			expect(getꓽrevisionⵧloose(DEMO_USTATE)).to.equal(DEMO_USTATE.revision)
			expect(getꓽrevisionⵧloose(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(DEMO_BASE_STATE_WITH_SUBS.subA.revision)
		})

		it("should return 0 on non-matching", () => {
			// @ts-expect-error
			expect(getꓽrevisionⵧloose({ foo: 42 })).to.equal(0)
		})
	})

	describe("getꓽtimestamp()", function () {
		describe("on a NON WithTimestamp", function () {
			it("should throw", () => {
				expect(
					// @ts-expect-error
					() => getꓽtimestamp({ foo: 42 }),
				).to.throw()
			})
		})

		describe("on WithTimestamp", function () {
			it("should work on correct data", () => {
				expect(getꓽtimestamp({ timestamp_ms: 33 })).to.equal(33)
			})
		})

		describe("on a BaseState", function () {
			it("should throw", () => {
				expect(
					// @ts-expect-error
					() => getꓽtimestamp(DEMO_BASE_STATE),
				).to.throw()
			})
		})

		describe("on an bundled U+T state", function () {
			it("should work on special aggregated data", () => {
				expect(getꓽtimestamp([DEMO_USTATE, DEMO_TSTATE])).to.equal(DEMO_TSTATE.timestamp_ms)
			})

			it("should throw on non-matching", () => {
				expect(
					// @ts-expect-error
					() => getꓽtimestamp([]),
				).to.throw()

				expect(
					// @ts-expect-error
					() => getꓽtimestamp([DEMO_TSTATE, DEMO_USTATE]),
				).to.throw()

				expect(
					// @ts-expect-error
					() => getꓽtimestamp([DEMO_USTATE, DEMO_TSTATE, DEMO_USTATE]),
				).to.throw()
			})
		})

		describe("on a root state", function () {
			it("should work on correct data", () => {
				expect(getꓽtimestamp(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.t_state.timestamp_ms)
			})
		})
	})

	describe("getꓽtimestampⵧloose()", function () {
		it("should work on correct data", () => {
			expect(getꓽtimestampⵧloose({ timestamp_ms: 33 })).to.equal(33)
			expect(getꓽtimestampⵧloose(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.t_state.timestamp_ms)
			expect(getꓽtimestampⵧloose([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).to.equal(
				DEMO_ROOT_STATE.t_state.timestamp_ms,
			)
			expect(getꓽtimestampⵧloose(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.timestamp_ms)
		})

		it("should return 0 on non-matching", () => {
			// @ts-expect-error
			expect(getꓽtimestampⵧloose({ foo: 42 })).to.equal(0)
			expect(getꓽtimestampⵧloose(DEMO_USTATE)).to.equal(0)
			expect(getꓽtimestampⵧloose(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(0)
		})
	})

	describe("getꓽbaseⵧloose()", function () {
		it("should work", () => {
			// @ts-expect-error
			expect(getꓽbaseⵧloose(undefined), "undefined").to.deep.equal(undefined)

			// @ts-expect-error
			expect(getꓽbaseⵧloose(null), "null").to.deep.equal(null)

			// @ts-expect-error
			expect(getꓽbaseⵧloose("foo"), "string").to.deep.equal("[not a state! string]")

			// @ts-expect-error
			expect(getꓽbaseⵧloose({ revision: 33 })).to.deep.equal({
				schema_version: 0,
				revision: 33,
				last_user_investment_tms: 0,
				timestamp_ms: 0,
			})

			// @ts-expect-error
			expect(getꓽbaseⵧloose({ schema_version: 33 })).to.deep.equal({
				schema_version: 33,
				revision: 0,
				last_user_investment_tms: 0,
				timestamp_ms: 0,
			})

			expect(getꓽbaseⵧloose(DEMO_USTATE), "DEMO_USTATE").to.deep.equal({
				schema_version: 5,
				revision: 24,
				last_user_investment_tms: 0,
				timestamp_ms: 0,
			})

			expect(getꓽbaseⵧloose(DEMO_TSTATE), "DEMO_TSTATE").to.deep.equal({
				schema_version: 5,
				revision: 12,
				last_user_investment_tms: 0,
				timestamp_ms: 1234567890,
			})

			expect(getꓽbaseⵧloose(DEMO_ROOT_STATE), "DEMO_ROOT_STATE").to.deep.equal({
				schema_version: 8,
				revision: 136,
				last_user_investment_tms: 1234567890,
				timestamp_ms: 1234567890,
			})
		})
	})
})
