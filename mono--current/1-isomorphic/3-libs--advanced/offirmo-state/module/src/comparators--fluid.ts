import type { Immutable } from "@monorepo-private/ts--types"

import {
	getꓽschema_versionⵧloose,
	getꓽrevisionⵧloose,
	getꓽlast_user_activity_timestampⵧloose,
	getꓽbaseⵧloose,
} from "./selectors.ts"
import type { AnyOffirmoState } from "./types.ts"

export function fluid_select(stateA: Immutable<AnyOffirmoState>) {
	const schema_version__A = getꓽschema_versionⵧloose(stateA)

	return {
		// separation of concerns
		// comparing schema versions is not the same as comparing "effort/investment"
		hasꓽsame_schema_version_than(stateB: Immutable<AnyOffirmoState>): boolean {
			const schema_version__B = getꓽschema_versionⵧloose(stateB)
			return schema_version__A === schema_version__B
		},
		hasꓽhigher_or_equal_schema_version_than(stateB: Immutable<AnyOffirmoState>): boolean {
			const schema_version__B = getꓽschema_versionⵧloose(stateB)
			return schema_version__A >= schema_version__B
		},
		hasꓽhigher_schema_version_than(stateB: Immutable<AnyOffirmoState>): boolean {
			const schema_version__B = getꓽschema_versionⵧloose(stateB)
			return schema_version__A > schema_version__B
		},

		// has actual difference, not just timestamp
		hasꓽvaluable_difference_with(stateB: Immutable<AnyOffirmoState>): boolean {
			//const schema_version__B = getꓽschema_versionⵧloose(stateB)
			//assert(schema_version__A === schema_version__B, `hasꓽvaluable_difference_with() expects same schema versions`)

			const revision__A = getꓽrevisionⵧloose(stateA)
			const revision__B = getꓽrevisionⵧloose(stateB)
			return revision__A !== revision__B // no order here
		},

		hasꓽhigher_investment_than(stateB: Immutable<AnyOffirmoState>): boolean {
			// schema version
			// NO!
			// if the user used an outdated+offline client for a while (high revision)
			// we may rather want an outdated-but-migrate-able format
			//assert(schema_version__A === schema_version__B, `hasꓽhigher_investment_than() expects same schema versions`)

			const revision__A = getꓽrevisionⵧloose(stateA)
			const revision__B = getꓽrevisionⵧloose(stateB)
			if (revision__A !== revision__B) return revision__A > revision__B

			// same revision, may be a fork...
			const activity_tms__A = getꓽlast_user_activity_timestampⵧloose(stateA)
			const activity_tms__B = getꓽlast_user_activity_timestampⵧloose(stateB)
			if (activity_tms__A !== activity_tms__B) return activity_tms__A > activity_tms__B

			// no change in the semantic INVESTMENT fields
			// we fall back to the other semantic fields
			const schema_version__B = getꓽschema_versionⵧloose(stateB)
			if (schema_version__A !== schema_version__B) return schema_version__A > schema_version__B

			// no change in any of the semantic fields
			// that should mean that they are equal, so we can return true or false.
			// BUT it could also be non-semantic states (no revision, schema version, etc.)
			// meaning that we can't really tell if it's higher investment.
			// safer to assume there is an investment!
			return true
		},

		getꓽdebug_infos_about_comparison_with(
			stateB: Immutable<AnyOffirmoState>,
			nickname__a: string = "A",
			nickname__b: string = "B",
		) {
			return {
				[nickname__a]: getꓽbaseⵧloose(stateA),
				[nickname__b]: getꓽbaseⵧloose(stateB),
			}
		},
	}
}
