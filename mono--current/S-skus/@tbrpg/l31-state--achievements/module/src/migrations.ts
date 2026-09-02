import {
	enforceꓽimmutable,
	type LastMigrationStep,
	type MigrationStep,
	migrate_toꓽlatestⵧgeneric,
} from "@monorepo-private/state-utils"

import { LIB, SCHEMA_VERSION } from "./consts.ts"
import { type TBRSoftExecutionContext } from "./sxc.ts"
import { type State } from "./types.ts"

// some hints may be needed to migrate to demo state
// need to export them for composing tests
export const MIGRATION_HINTS_FOR_TESTS: any = enforceꓽimmutable({})

/////////////////////

type StateForMigration = State
export function migrate_toꓽlatest(
	SXC: TBRSoftExecutionContext,
	legacy_state: Readonly<any>,
	hints: Readonly<any> = {},
): StateForMigration {
	return migrate_toꓽlatestⵧgeneric({
		SXC: SXC as any,
		LIB,
		SCHEMA_VERSION,
		legacy_state,
		hints,
		sub_states_migrate_toꓽlatest: {},
		pipeline: [migrate_to_3x, migrate_to_2],
	})
}

/////////////////////

const migrate_to_3x: LastMigrationStep<StateForMigration, any> = (
	SXC,
	legacy_state,
	hints,
	previous,
	legacy_schema_version,
) => {
	//console.log('hello from migrate_to_3x', legacy_state, hints, previous, legacy_schema_version)
	if (legacy_schema_version < 2) legacy_state = previous(SXC, legacy_state, hints)
	let state = legacy_state
	const { last_visited_timestamp, ...other_stats } = legacy_state.statistics
	state = {
		...state,
		schema_version: 3,

		statistics: {
			...other_stats,
			creation_date_hrtday: legacy_state.statistics.creation_date_hrtday ?? last_visited_timestamp, // possible that a parent state pre-migrated us. If not, fallback on the best we have...
			last_visited_timestamp_hrtday: last_visited_timestamp,
		},
	} as State

	return state
}

const migrate_to_2: MigrationStep<StateForMigration, any> = (SXC, legacy_state, hints, next, legacy_schema_version) => {
	return {
		...legacy_state,
		schema_version: 2,
		achievements: legacy_state.achievements || {},
	}
}
