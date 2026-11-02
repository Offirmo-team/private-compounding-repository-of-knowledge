import { describe, it, expect } from "vitest"

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

describe(`${LIB} - selectors`, () => {
	describe("getꓽschema_version()", () => {
		describe("on a NON WithSchemaVersion", () => {
			it("should typecheck and throw", () => {
				expect(
					// @ts-expect-error
					() => getꓽschema_version({ foo: 42 }),
				).toThrow()
			})
		})

		describe("on WithSchemaVersion", () => {
			it("should work on correct data", () => {
				expect(getꓽschema_version({ schema_version: 33 })).toBe(33)
			})
		})

		describe("on a BaseState", () => {
			it("should work on correct data", () => {
				expect(getꓽschema_version(DEMO_BASE_STATE)).toBe(DEMO_BASE_STATE.schema_version)
				expect(getꓽschema_version(DEMO_ROOT_STATE.u_state)).toBe(DEMO_ROOT_STATE.u_state.schema_version)
				expect(getꓽschema_version(DEMO_ROOT_STATE.t_state)).toBe(DEMO_ROOT_STATE.t_state.schema_version)
			})
		})

		describe("on an bundled U+T state", () => {
			it("should work on special aggregated data", () => {
				expect(getꓽschema_version([DEMO_USTATE, DEMO_TSTATE])).toBe(DEMO_USTATE.schema_version)
				expect(getꓽschema_version([DEMO_USTATE, DEMO_TSTATE])).toBe(DEMO_TSTATE.schema_version)
			})

			it("should typecheck and throw on non-matching", () => {
				expect(
					// @ts-expect-error
					() => getꓽschema_version([]),
				).toThrow()

				expect(
					// @ts-expect-error
					() => getꓽschema_version([DEMO_TSTATE, DEMO_USTATE]),
				).toThrow()

				expect(
					// @ts-expect-error
					() => getꓽschema_version([DEMO_USTATE, DEMO_TSTATE, DEMO_USTATE]),
				).toThrow()
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
				).toThrow()
			})
		})

		describe("on a root state", () => {
			it("should work on correct data", () => {
				expect(getꓽschema_version(DEMO_ROOT_STATE)).toBe(DEMO_ROOT_STATE.u_state.schema_version)
			})

			it("should typecheck and throw on non-matching", () => {
				expect(
					// @ts-expect-error
					() => getꓽschema_version({}),
				).toThrow()

				expect(
					// @ts-expect-error
					() => getꓽschema_version({ u_state: DEMO_TSTATE, t_state: DEMO_USTATE }),
				).toThrow()

				expect(
					// @ts-expect-error
					() => getꓽschema_version({ u_state: DEMO_USTATE }),
				).toThrow()
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
				).toThrow()

				expect(() =>
					getꓽschema_version({
						...DEMO_ROOT_STATE,
						t_state: {
							...DEMO_ROOT_STATE.t_state,
							schema_version: 99,
						},
					}),
				).toThrow()
			})
		})
	})

	describe("getꓽschema_versionⵧloose()", () => {
		it("should work on non matching", () => {
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose(undefined)).toBe(0)
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose(null)).toBe(0)
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose(0)).toBe(0)
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose(new Error("Test!"))).toBe(0)
		})

		it("should work on nominal correct data", () => {
			expect(getꓽschema_versionⵧloose({ schema_version: 33 })).toBe(33)
			expect(getꓽschema_versionⵧloose(DEMO_ROOT_STATE)).toBe(DEMO_ROOT_STATE.u_state.schema_version)
			expect(getꓽschema_versionⵧloose(DEMO_ROOT_STATE.t_state)).toBe(DEMO_ROOT_STATE.t_state.schema_version)
			expect(getꓽschema_versionⵧloose(DEMO_USTATE)).toBe(DEMO_USTATE.schema_version)
			expect(getꓽschema_versionⵧloose(DEMO_BASE_STATE_WITH_SUBS.subA)).toBe(
				DEMO_BASE_STATE_WITH_SUBS.subA.schema_version,
			)
		})

		it("should work on special aggregated data, even when old", () => {
			expect(getꓽschema_versionⵧloose([DEMO_USTATE, DEMO_TSTATE] as any)).toBe(DEMO_USTATE.schema_version)
			// @ts-expect-error
			expect(getꓽschema_versionⵧloose([{ schema_version: 33 }, null])).toBe(33)
		})
	})

	describe("getꓽrevision()", () => {
		it("should work on correct data", () => {
			expect(getꓽrevision({ revision: 33 })).toBe(33)
			expect(getꓽrevision(DEMO_ROOT_STATE)).toBe(DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision)
			expect(getꓽrevision([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).toBe(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision,
			)
			expect(getꓽrevision(DEMO_ROOT_STATE.t_state)).toBe(DEMO_ROOT_STATE.t_state.revision)
			expect(getꓽrevision(DEMO_USTATE)).toBe(DEMO_USTATE.revision)
			expect(getꓽrevision(DEMO_BASE_STATE_WITH_SUBS.subA)).toBe(DEMO_BASE_STATE_WITH_SUBS.subA.revision)
		})

		it("should throw on non-matching", () => {
			expect(
				// @ts-expect-error
				() => getꓽrevision({ foo: 42 }),
			).toThrow()
		})
	})

	describe("getꓽrevisionⵧloose()", () => {
		it("should work on correct data", () => {
			expect(getꓽrevisionⵧloose({ revision: 33 })).toBe(33)
			expect(getꓽrevisionⵧloose(DEMO_ROOT_STATE)).toBe(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision,
			)
			expect(getꓽrevisionⵧloose([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).toBe(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision,
			)
			expect(getꓽrevisionⵧloose(DEMO_ROOT_STATE.t_state)).toBe(DEMO_ROOT_STATE.t_state.revision)
			expect(getꓽrevisionⵧloose(DEMO_USTATE)).toBe(DEMO_USTATE.revision)
			expect(getꓽrevisionⵧloose(DEMO_BASE_STATE_WITH_SUBS.subA)).toBe(DEMO_BASE_STATE_WITH_SUBS.subA.revision)
		})

		it("should return 0 on non-matching", () => {
			// @ts-expect-error
			expect(getꓽrevisionⵧloose({ foo: 42 })).toBe(0)
		})
	})

	describe("getꓽtimestamp()", () => {
		describe("on a NON WithTimestamp", () => {
			it("should throw", () => {
				expect(
					// @ts-expect-error
					() => getꓽtimestamp({ foo: 42 }),
				).toThrow()
			})
		})

		describe("on WithTimestamp", () => {
			it("should work on correct data", () => {
				expect(getꓽtimestamp({ timestamp_ms: 33 })).toBe(33)
			})
		})

		describe("on a BaseState", () => {
			it("should throw", () => {
				expect(
					// @ts-expect-error
					() => getꓽtimestamp(DEMO_BASE_STATE),
				).toThrow()
			})
		})

		describe("on an bundled U+T state", () => {
			it("should work on special aggregated data", () => {
				expect(getꓽtimestamp([DEMO_USTATE, DEMO_TSTATE])).toBe(DEMO_TSTATE.timestamp_ms)
			})

			it("should throw on non-matching", () => {
				expect(
					// @ts-expect-error
					() => getꓽtimestamp([]),
				).toThrow()

				expect(
					// @ts-expect-error
					() => getꓽtimestamp([DEMO_TSTATE, DEMO_USTATE]),
				).toThrow()

				expect(
					// @ts-expect-error
					() => getꓽtimestamp([DEMO_USTATE, DEMO_TSTATE, DEMO_USTATE]),
				).toThrow()
			})
		})

		describe("on a root state", () => {
			it("should work on correct data", () => {
				expect(getꓽtimestamp(DEMO_ROOT_STATE)).toBe(DEMO_ROOT_STATE.t_state.timestamp_ms)
			})
		})
	})

	describe("getꓽtimestampⵧloose()", () => {
		it("should work on correct data", () => {
			expect(getꓽtimestampⵧloose({ timestamp_ms: 33 })).toBe(33)
			expect(getꓽtimestampⵧloose(DEMO_ROOT_STATE)).toBe(DEMO_ROOT_STATE.t_state.timestamp_ms)
			expect(getꓽtimestampⵧloose([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).toBe(
				DEMO_ROOT_STATE.t_state.timestamp_ms,
			)
			expect(getꓽtimestampⵧloose(DEMO_ROOT_STATE.t_state)).toBe(DEMO_ROOT_STATE.t_state.timestamp_ms)
		})

		it("should return 0 on non-matching", () => {
			// @ts-expect-error
			expect(getꓽtimestampⵧloose({ foo: 42 })).toBe(0)
			expect(getꓽtimestampⵧloose(DEMO_USTATE)).toBe(0)
			expect(getꓽtimestampⵧloose(DEMO_BASE_STATE_WITH_SUBS.subA)).toBe(0)
		})
	})

	describe("getꓽbaseⵧloose()", () => {
		it("should work", () => {
			// @ts-expect-error
			expect(getꓽbaseⵧloose(undefined), "undefined").toBeUndefined()

			// @ts-expect-error
			expect(getꓽbaseⵧloose(null), "null").toBeNull()

			// @ts-expect-error
			expect(getꓽbaseⵧloose("foo"), "string").toBe("[not a state! string]")

			// @ts-expect-error
			expect(getꓽbaseⵧloose({ revision: 33 })).toStrictEqual({
				schema_version: 0,
				revision: 33,
				last_user_investment_tms: 0,
				timestamp_ms: 0,
			})

			// @ts-expect-error
			expect(getꓽbaseⵧloose({ schema_version: 33 })).toStrictEqual({
				schema_version: 33,
				revision: 0,
				last_user_investment_tms: 0,
				timestamp_ms: 0,
			})

			expect(getꓽbaseⵧloose(DEMO_USTATE), "DEMO_USTATE").toStrictEqual({
				schema_version: 5,
				revision: 24,
				last_user_investment_tms: 0,
				timestamp_ms: 0,
			})

			expect(getꓽbaseⵧloose(DEMO_TSTATE), "DEMO_TSTATE").toStrictEqual({
				schema_version: 5,
				revision: 12,
				last_user_investment_tms: 0,
				timestamp_ms: 1234567890,
			})

			expect(getꓽbaseⵧloose(DEMO_ROOT_STATE), "DEMO_ROOT_STATE").toStrictEqual({
				schema_version: 8,
				revision: 136,
				last_user_investment_tms: 1234567890,
				timestamp_ms: 1234567890,
			})
		})
	})
})
