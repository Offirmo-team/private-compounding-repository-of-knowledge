import assert from '@monorepo-private/assert/v1'
import { Enum } from 'typescript-string-enums'
import memoize_one from 'memoize-one'
import * as jsondiffpatch from 'jsondiffpatch'

import { Immutable, JSONObject } from '@monorepo-private/ts--types'

import {
	isꓽRootState,
} from './type-guards.js'
import {
	getꓽschema_versionⵧloose,
	getꓽrevisionⵧloose,
	getꓽlast_user_activity_timestampⵧloose,
	getꓽtimestampⵧloose,
} from './selectors.js'

////////////////////////////////////

// tslint:disable-next-line: variable-name
export const SemanticDifference = Enum(
	'none', // fully equal
	'time', // t-state difference but semantically equal
	'minor', // different revisions and/or last meaningful activity (could also be a fork)
	'major', // different schema version (could also be a fork, so we may still want to keep and migrate the older schema version)
)
export type SemanticDifference = Enum<typeof SemanticDifference> // eslint-disable-line no-redeclare


export function s_max(a: SemanticDifference, b: SemanticDifference): SemanticDifference {
	if (a === SemanticDifference.major || b === SemanticDifference.major)
		return SemanticDifference.major

	if (a === SemanticDifference.minor || b === SemanticDifference.minor)
		return SemanticDifference.minor

	if (a === SemanticDifference.time || b === SemanticDifference.time)
		return SemanticDifference.time

	return SemanticDifference.none
}



// TODO improve unclear semantics
// different schema version: we may want to compare investment instead of pure schema version
// same schema + revision: could still be a fork, take the most recent?
export function UNCLEAR_get_difference__full(a: any, b?: any): { type: SemanticDifference, direction: number } {
	//console.log('compare()', { a, b })

	// quick
	if (a === b)
		return {
			type: SemanticDifference.none,
			direction: 0,
		}

	const exists__a = !!a
	const exists__b = !!b
	if (exists__a !== exists__b)
		return {
			type: SemanticDifference.minor, // by convention, exists vs. non-exists (= state creation) is minor
			direction: (exists__a ? 1 : 0) - (exists__b ? 1 : 0)
		}

	const schema_version__a = getꓽschema_versionⵧloose(a)
	const schema_version__b = getꓽschema_versionⵧloose(b)
	if (schema_version__a !== schema_version__b)
		return {
			type: SemanticDifference.major,
			direction: schema_version__a - schema_version__b
		}

	// special case: the schema evolved to have a "root state" shape = major
	// the one having a root state is considered more evolved
	const is_root__a = isꓽRootState(a)
	const is_root__b = isꓽRootState(b)
	if (is_root__a !== is_root__b)
		return {
			type: SemanticDifference.major,
			direction: (is_root__a ? 1 : 0) - (is_root__b ? 1 : 0)
		}

	// we now know that both or neither are root states ✔

	// safety check
	if (is_root__a && a.ⵙapp_id && b.ⵙapp_id) {
		assert(a.ⵙapp_id === b.ⵙapp_id, `UNCLEAR_get_difference() states should be in the same universe!`)
	}

	const revision__a = getꓽrevisionⵧloose(a)
	const revision__b = getꓽrevisionⵧloose(b)
	if (revision__a !== revision__b)
		return {
			type: SemanticDifference.minor,
			direction: revision__a - revision__b,
		}

	const activity_tms__a = getꓽlast_user_activity_timestampⵧloose(a)
	const activity_tms__b = getꓽlast_user_activity_timestampⵧloose(b)
	if (activity_tms__a !== activity_tms__b)
		return {
			type: SemanticDifference.minor, // must be a fork since same revision
			direction: activity_tms__a - activity_tms__b,
		}

	// last resort if state is/has a T_state
	const t_tms__a = getꓽtimestampⵧloose(a)
	const t_tms__b = getꓽtimestampⵧloose(b)
	if (t_tms__a !== t_tms__b)
		return {
			type: SemanticDifference.time,
			direction: t_tms__a - t_tms__b,
		}

	if ([
		schema_version__a,
		revision__a,
		activity_tms__a,
		t_tms__a
	].join(',') === '0,0,0,0') {
		// everything being equal and 0
		// means neither compared stuff are semantic states
		return {
			type: SemanticDifference.minor, // by convention = minor change on an implied "schema version = 0"
			direction: t_tms__a - t_tms__b,
		}
	}

	return {
		type: SemanticDifference.none,
		direction: 0,
	}
}

// UNCLEAR see comments above
export function UNCLEAR_get_difference(a: any, b?: any): SemanticDifference {
	return UNCLEAR_get_difference__full(a, b).type
}
export function UNCLEAR_compare(a: any, b: any): number {
	return UNCLEAR_get_difference__full(a, b).direction
}
