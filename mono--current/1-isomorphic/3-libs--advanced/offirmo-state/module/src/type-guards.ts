import type { Immutable } from "@monorepo-private/ts--types"

import type {
	WithSchemaVersion,
	WithRevision,
	WithTimestamp,
	BaseState,
	BaseTState,
	BaseUState,
	BaseRootState,
	UTBundle,
	WithLastUserInvestmentTimestamp,
} from "./types.ts"

/////////////////////////////////////////////////

function isꓽWithSchemaVersion(s: Immutable<any>): s is WithSchemaVersion {
	return Number.isInteger((s as WithSchemaVersion)?.schema_version)
}
function isꓽWithRevision(s: Immutable<any>): s is WithRevision {
	return Number.isInteger((s as WithRevision)?.revision)
}
function isꓽWithTimestamp(s: Immutable<any>): s is WithTimestamp {
	return Number.isInteger((s as WithTimestamp)?.timestamp_ms)
}
function isꓽWithLastUserInvestmentTimestamp(s: Immutable<any>): s is WithLastUserInvestmentTimestamp {
	return Number.isInteger((s as WithLastUserInvestmentTimestamp)?.last_user_investment_tms)
}

/////////////////////////////////////////////////

function hasꓽversioned_schema(s: Immutable<any>): boolean {
	return isꓽWithSchemaVersion(s) || isꓽUTBundle(s) || isꓽRootState(s)
}

function is_revisioned(s: Immutable<any>): boolean {
	return isꓽWithRevision(s) || isꓽUTBundle(s) || isꓽRootState(s)
}

function is_time_stamped(s: Immutable<any>): boolean {
	return isꓽWithTimestamp(s) || isꓽUTBundle(s) || isꓽRootState(s)
}

/////////////////////////////////////////////////

function isꓽBaseState(s: Immutable<any>): s is BaseState {
	return isꓽWithSchemaVersion(s) && isꓽWithRevision(s)
}

function isꓽUState(s: Immutable<any>): s is BaseUState {
	return isꓽBaseState(s) && !isꓽWithTimestamp(s)
}
function isꓽTState(s: Immutable<any>): s is BaseTState {
	return isꓽBaseState(s) && isꓽWithTimestamp(s)
}

function isꓽUTBundle(s: Immutable<any>): s is UTBundle {
	return Array.isArray(s) && s.length === 2 && isꓽUState(s[0]) && isꓽTState(s[1])
}
function isꓽRootState(s: Immutable<any>): s is BaseRootState {
	return isꓽUState(s?.u_state) && isꓽTState(s?.t_state) && isꓽWithLastUserInvestmentTimestamp(s)
}

/////////////////////////////////////////////////

// useful to check bugs, for ex. persistence errors
function isꓽvalid_offirmo_state_object(s: Immutable<any>): boolean {
	return isꓽRootState(s) || isꓽBaseState(s) || hasꓽversioned_schema(s)
}

/////////////////////////////////////////////////

export {
	isꓽWithSchemaVersion,
	isꓽWithRevision,
	isꓽWithTimestamp,
	isꓽWithLastUserInvestmentTimestamp,
	hasꓽversioned_schema,
	is_revisioned,
	is_time_stamped,
	isꓽBaseState,
	isꓽUState,
	isꓽTState,
	isꓽUTBundle,
	isꓽRootState,
	isꓽvalid_offirmo_state_object,
}
