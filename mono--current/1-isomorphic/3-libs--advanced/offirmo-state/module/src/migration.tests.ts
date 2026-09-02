import { expect } from "chai"

import { type SoftExecutionContext, getRootSXC } from "@monorepo-private/soft-execution-context"
import type { Immutable } from "@monorepo-private/ts--types"

import {
	type StateA_U_v0,
	DEMO_STATE_A_U_v0,
	type StateA_U_v1,
	DEMO_STATE_A_U_v1,
	type StateA_U_v2,
	DEMO_STATE_A_U_v2,
	SCHEMA_VERSION_A,
} from "./__fixtures/examples.ts"
import { LIB } from "./consts.ts"
import { type LastMigrationStep, type MigrationStep, migrate_toꓽlatestⵧgeneric } from "./migration.ts"

describe(`${LIB} - migration`, function () {
	const TEST_SXC = getRootSXC()
	const LIB = "@monorepo-private/state-utils--UNIT-TEST"
	TEST_SXC.setLogicalStack({ module: LIB })

	describe("migrate_toꓽlatestⵧgeneric()", function () {
		describe("on base state", function () {
			const SCHEMA_VERSION = SCHEMA_VERSION_A

			type State2 = StateA_U_v2
			type State = State2
			const DEMO_STATE_v0 = DEMO_STATE_A_U_v0
			const DEMO_STATE_v1 = DEMO_STATE_A_U_v1
			const DEMO_STATE_v2 = DEMO_STATE_A_U_v2
			const HINTS = {
				v2: {
					revision: 333,
				},
				// by version
				// v1: {}
				// substates
				// subA: {}
			}

			const migrate_to_2: LastMigrationStep<State> = (SXC, legacy_state, hints, previous, legacy_schema_version) => {
				if (legacy_schema_version < 1) legacy_state = previous(SXC, legacy_state, hints)

				let state: State = {
					...(legacy_state as any),
					schema_version: 2,
					revision: hints.v2.revision,
					foo: {
						bar: {
							baz: legacy_state.foo.bar,
						},
					},
				}

				return state
			}

			const migrate_to_1: MigrationStep = (SXC, legacy_state, hints, previous, legacy_schema_version) => {
				if (legacy_schema_version < 0) legacy_state = previous(SXC, legacy_state, hints)

				let state: State = {
					...(legacy_state as any),
					schema_version: 1,
					foo: {
						bar: legacy_state.foo,
					},
				}

				return state
			}

			function migrate_toꓽlatest(
				SXC: SoftExecutionContext,
				legacy_state: Immutable<any>,
				hints: Immutable<any> = {},
			): State {
				return migrate_toꓽlatestⵧgeneric({
					SXC,

					LIB,
					SCHEMA_VERSION,
					legacy_state,
					hints,
					sub_states_migrate_toꓽlatest: {},

					pipeline: [migrate_to_2, migrate_to_1],
				})
			}

			it("should work in nominal case 0 -> 2", () => {
				expect(migrate_toꓽlatest(TEST_SXC, DEMO_STATE_v0, HINTS)).to.deep.equal(DEMO_STATE_v2)
			})

			it("should work in nominal case 1 -> 2", () => {
				expect(migrate_toꓽlatest(TEST_SXC, DEMO_STATE_v1, HINTS)).to.deep.equal(DEMO_STATE_v2)
			})

			it("should work in nominal case 2 -> 2", () => {
				//expect(migrate_toꓽlatest(TEST_SXC, DEMO_STATE_v2, HINTS)).to.deep.equal(DEMO_STATE_v2)
				// identity if already good version
				expect(migrate_toꓽlatest(TEST_SXC, DEMO_STATE_v2, HINTS)).to.equal(DEMO_STATE_v2)
			})

			it("should throw on end of pipeline (too old version)", () => {
				function migrate_toꓽlatest(
					SXC: SoftExecutionContext,
					legacy_state: Immutable<any>,
					hints: Immutable<any> = {},
				): State {
					return migrate_toꓽlatestⵧgeneric({
						SXC,

						LIB,
						SCHEMA_VERSION,
						legacy_state: DEMO_STATE_v0,
						hints,
						sub_states_migrate_toꓽlatest: {},

						pipeline: [
							migrate_to_2,
							// no older migration
						],
					})
				}

				expect(() => migrate_toꓽlatest(TEST_SXC, DEMO_STATE_v0)).to.throw("migration")
			})
		})

		describe("on Bundled UState + TState", function () {})

		describe("on RootState with subStates", function () {})
	})
})
