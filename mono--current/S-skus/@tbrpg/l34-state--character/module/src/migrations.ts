//////////////////////////////////////////////////////////////////////

import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { LIB, SCHEMA_VERSION } from "./consts.ts"
import { type TBRSoftExecutionContext, getꓽSXC } from "./sxc.ts"
import { type State } from "./types.ts"

//////////////////////////////////////////////////////////////////////

// some hints may be needed to migrate to demo state
// need to export them for composing tests
const MIGRATION_HINTS_FOR_TESTS = enforceꓽimmutable<any>({})

/////////////////////

function migrate_toꓽlatest(
	SXC: TBRSoftExecutionContext,
	legacy_state: Immutable<any>,
	hints: Immutable<any> = {},
): State {
	return getꓽSXC(SXC).xTry("migrate_toꓽlatest", ({ SXC, logger }) => {
		const existing_version = legacy_state?.schema_version || 0
		SXC.setAnalyticsAndErrorDetails({
			version_from: existing_version,
			version_to: SCHEMA_VERSION,
		})

		if (existing_version > SCHEMA_VERSION)
			throw new Error("Your data is from a more recent version of this lib. Please update!")

		let state: State = legacy_state as State // for starter, may actually be true

		if (existing_version < SCHEMA_VERSION) {
			logger.warn(`${LIB}: attempting to migrate schema from v${existing_version} to v${SCHEMA_VERSION}…`)
			SXC.fireAnalyticsEvent("schema_migration.began")

			try {
				state = migrate_to_2(SXC, legacy_state, hints)
			} catch (err) {
				SXC.fireAnalyticsEvent("schema_migration.failed")
				throw err
			}

			logger.info(`${LIB}: schema migration successful.`)
			SXC.fireAnalyticsEvent("schema_migration.ended")
		}

		// migrate sub-reducers if any...

		return state
	})
}

/////////////////////

function migrate_to_2(SXC: TBRSoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any>): State {
	throw new Error("Schema is too old (pre-beta), can’t migrate!")
}

//////////////////////////////////////////////////////////////////////

export { migrate_toꓽlatest, MIGRATION_HINTS_FOR_TESTS }

//////////////////////////////////////////////////////////////////////
