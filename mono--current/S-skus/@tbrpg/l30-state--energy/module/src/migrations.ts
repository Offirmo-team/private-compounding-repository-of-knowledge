import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"
import { type LastMigrationStep, type MigrationStep, migrate_toꓽlatestⵧgeneric } from "@monorepo-private/state-utils"

import { LIB, SCHEMA_VERSION } from "./consts.ts"
import { type TBRSoftExecutionContext } from "./sxc.ts"
import type { UState, TState } from "./types.ts"

// some hints may be needed to migrate to demo state
// need to export them for composing tests
const MIGRATION_HINTS_FOR_TESTS: any = enforceꓽimmutable<any>({})

/////////////////////

type StateForMigration = [UState, TState]

function migrate_toꓽlatest(
	SXC: TBRSoftExecutionContext,
	legacy_state: Readonly<any>,
	hints: Readonly<any> = {},
): Immutable<StateForMigration> {
	return migrate_toꓽlatestⵧgeneric<StateForMigration>({
		SXC: SXC as any,

		LIB,
		SCHEMA_VERSION,
		legacy_state,
		hints,
		sub_states_migrate_toꓽlatest: {},

		pipeline: [migrate_to_4x, migrate_to_3],
	})
}

/////////////////////

const migrate_to_4x: LastMigrationStep<StateForMigration, [any, any]> = (
	SXC,
	legacy_state,
	hints,
	previous,
	legacy_schema_version,
) => {
	//console.log('hello from migrate_to_4x', legacy_state, hints, previous, legacy_schema_version)
	if (legacy_schema_version < 3) legacy_state = previous(SXC, legacy_state, hints)

	let [u_state, t_state] = legacy_state
	u_state = {
		...u_state,
		schema_version: 4,
	}
	t_state = {
		...t_state,
		schema_version: 4,

		// this field was added
		revision: u_state.revision,
	}

	return [u_state, t_state]
}

const migrate_to_3: MigrationStep<[any, any], [any, any]> = () => {
	throw new Error("Schema is too old (pre-beta), can’t migrate!")
}

/////////////////////

export { migrate_toꓽlatest, MIGRATION_HINTS_FOR_TESTS }
