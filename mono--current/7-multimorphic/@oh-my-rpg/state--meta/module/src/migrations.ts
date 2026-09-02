//////////////////////////////////////////////////////////////////////

import {
	type Immutable,
	enforceꓽimmutable,
	type LastMigrationStep,
	type MigrationStep,
	migrate_toꓽlatestⵧgeneric,
} from "@monorepo-private/state-utils"

import { LIB, SCHEMA_VERSION } from "./consts.ts"
import { type SoftExecutionContext } from "./sec.ts"
import { type State } from "./types.ts"

//////////////////////////////////////////////////////////////////////

// some hints may be needed to migrate to demo state
// need to export them for composing tests
const MIGRATION_HINTS_FOR_TESTS = enforceꓽimmutable<any>({})

/////////////////////

type StateForMigration = State

function migrate_toꓽlatest(
	SXC: SoftExecutionContext,
	legacy_state: Immutable<any>,
	hints: Immutable<any> = {},
): Immutable<StateForMigration> {
	return migrate_toꓽlatestⵧgeneric<StateForMigration>({
		SXC: SXC as any,
		LIB,
		SCHEMA_VERSION,
		legacy_state,
		hints,
		sub_states_migrate_toꓽlatest: {},
		pipeline: [_migrate_to_3x, _migrate_to_2],
	})
}

/////////////////////

const _migrate_to_3x: LastMigrationStep<StateForMigration, any> = (
	SXC,
	legacy_state,
	hints,
	previous,
	legacy_schema_version,
) => {
	//console.log('hello from _migrate_to_3', legacy_state, hints, legacy_schema_version)
	if (legacy_schema_version < 2) legacy_state = previous(SXC, legacy_state, hints)

	let state: any = {
		...legacy_state,
		schema_version: 3,
		slot_id: 0,
	}
	delete state.persistence_id

	return state
}

const _migrate_to_2: MigrationStep = () => {
	throw new Error("Schema is too old, can’t migrate!")
}

/////////////////////

export { migrate_toꓽlatest, MIGRATION_HINTS_FOR_TESTS }

//////////////////////////////////////////////////////////////////////
