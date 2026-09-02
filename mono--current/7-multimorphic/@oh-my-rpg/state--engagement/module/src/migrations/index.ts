//////////////////////////////////////////////////////////////////////

import {
	type Immutable,
	enforceꓽimmutable,
	type LastMigrationStep,
	type MigrationStep,
	migrate_toꓽlatestⵧgeneric,
} from "@monorepo-private/state-utils"

import { LIB, SCHEMA_VERSION } from "../consts.ts"
import { type State } from "../types.ts"
import { type SoftExecutionContext } from "../utils/sec.ts"

//////////////////////////////////////////////////////////////////////

// some hints may be needed to migrate to demo state
// need to export them for composing tests
const MIGRATION_HINTS_FOR_TESTS = enforceꓽimmutable<any>({
	v2: {
		demo: {
			params: {
				username: "Offirmo",
			},
			template: {
				auto_dismiss_delay_ms: 5000,
				content: "Hello, {{username}}!",
				is_in_user_flow: true,
				level: "log",
			},
			uid: 42,
		},
	},
})

/////////////////////

type StateForMigration = State<any>

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
		pipeline: [_migrate_to_2x],
	})
}

/////////////////////

const _migrate_to_2x: LastMigrationStep<StateForMigration, any> = (
	SXC,
	legacy_state,
	hints,
	previous,
	legacy_schema_version,
) => {
	console.log(`[${LIB}] applying migration step to v2...`, { legacy_state, hints, legacy_schema_version })
	if (legacy_schema_version < 1) legacy_state = previous(SXC, legacy_state, hints)

	let state: any = {
		...legacy_state,
		schema_version: 2,
		queue: [], // we wipe the queue! all known v1 usages are for transient notifications
	}

	if (hints?.v2?.demo) {
		state.queue.push(hints.v2.demo)
	}

	return state
}

/////////////////////

export { migrate_toꓽlatest, MIGRATION_HINTS_FOR_TESTS }

//////////////////////////////////////////////////////////////////////
