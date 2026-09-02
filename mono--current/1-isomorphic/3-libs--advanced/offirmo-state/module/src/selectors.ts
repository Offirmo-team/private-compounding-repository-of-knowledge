import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import {
	isꓽWithSchemaVersion,
	isꓽWithRevision,
	isꓽWithTimestamp,
	isꓽWithLastUserInvestmentTimestamp,
	hasꓽversioned_schema,
	is_revisioned,
	is_time_stamped,
	isꓽRootState,
	isꓽUTBundle,
} from "./type-guards.ts"
import type {
	WithSchemaVersion,
	WithRevision,
	WithTimestamp,
	WithLastUserInvestmentTimestamp,
	BaseState,
	BaseTState,
	BaseUState,
	UTBundle,
	BaseRootState,
	StateInfos,
	AnyOffirmoState,
} from "./types.ts"

// "loose" = useful for comparisons with legacy/wrong states (wrong structure)
// will not throw and will fall back to 0 if not a corresponding state (ex. undefined or unrecognized)
// BUT we don't type them as accepting (null | undefined | any) to better catch errors

export function getꓽschema_version<
	V extends WithSchemaVersion,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<B> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {
	if (isꓽWithSchemaVersion(s)) {
		const { schema_version } = s
		assert(Number.isSafeInteger(schema_version), "getꓽschema_version() safeInteger!")
		return schema_version
	}

	if (isꓽUTBundle(s)) {
		assert(
			getꓽschema_version(s[0]) === getꓽschema_version(s[1]),
			"getꓽschema_version() U & T versions should match inside a bundle!",
		)
		return getꓽschema_version(s[0])
	}

	if (isꓽRootState(s)) {
		assert(
			getꓽschema_version(s.u_state) === getꓽschema_version(s.t_state),
			"getꓽschema_version() U & T versions should match inside a root!",
		)
		return getꓽschema_version(s.u_state)
	}

	throw new Error("getꓽschema_version() should have a recognized versioned structure!")
}

export function getꓽschema_versionⵧloose<
	V extends WithSchemaVersion,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<AnyOffirmoState>): number {
	if (hasꓽversioned_schema(s)) return getꓽschema_version(s as Immutable<V>)

	// specific fallbacks
	if (Array.isArray(s)) {
		const maybe_legacy_bundle = s as any[]
		if (hasꓽversioned_schema(maybe_legacy_bundle[0])) {
			return getꓽschema_version(maybe_legacy_bundle[0])
		}
	}

	if (s && typeof s === "object") {
		const maybe_legacy_root_state = s as any
		if (maybe_legacy_root_state.u_state) {
			return getꓽschema_version(maybe_legacy_root_state.u_state)
		}
	}

	// final fallback
	return 0
}

export function getꓽrevision<
	V extends WithRevision,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<B> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {
	if (isꓽWithRevision(s)) {
		const { revision } = s
		assert(Number.isSafeInteger(revision), "getꓽrevision() should be a safeInteger")
		return revision
	}

	if (isꓽUTBundle(s)) {
		return getꓽrevision(s[0]) + getꓽrevision(s[1])
	}

	if (isꓽRootState(s)) {
		return getꓽrevision(s.u_state) + getꓽrevision(s.t_state)
	}

	throw new Error("getꓽrevision() should have a recognized revisioned structure!")
}

export function getꓽrevisionⵧloose<
	V extends WithRevision,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<AnyOffirmoState>): number {
	if (is_revisioned(s)) return getꓽrevision(s as Immutable<V>)

	// specific fallbacks:
	if (Array.isArray(s)) {
		const maybe_legacy_bundle = s as any[]
		if (is_revisioned(maybe_legacy_bundle[0])) {
			return getꓽrevision(maybe_legacy_bundle[0]) + getꓽrevisionⵧloose(maybe_legacy_bundle[1])
		}
	}

	if (s && typeof s === "object") {
		const maybe_legacy_root_state = s as any
		if (maybe_legacy_root_state.u_state || maybe_legacy_root_state.t_state) {
			return getꓽrevision(maybe_legacy_root_state.u_state) + getꓽrevisionⵧloose(maybe_legacy_root_state.t_state)
		}
	}

	// final fallback
	return 0
}

export function getꓽtimestamp<
	T extends WithTimestamp,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<T> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {
	if (isꓽWithTimestamp(s)) {
		const { timestamp_ms } = s
		assert(Number.isSafeInteger(timestamp_ms), "getꓽtimestamp() safeInteger")
		return timestamp_ms
	}

	if (isꓽUTBundle(s)) {
		return getꓽtimestamp(s[1])
	}

	if (isꓽRootState(s)) {
		return getꓽtimestamp(s.t_state)
	}

	throw new Error("getꓽtimestamp() should have a recognized revisioned structure!")
}

export function getꓽtimestampⵧloose<
	V extends WithTimestamp,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<AnyOffirmoState>): number {
	if (is_time_stamped(s)) return getꓽtimestamp(s as any)

	// specific fallbacks:
	// loose bundles
	if (Array.isArray(s)) {
		const maybe_loose_bundle = s as any[]
		if (is_time_stamped(maybe_loose_bundle[1])) return getꓽtimestamp(maybe_loose_bundle[1])
	}

	// final fallback
	return 0
}

export function getꓽlast_user_activity_timestamp<
	T extends WithLastUserInvestmentTimestamp,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<T> | Immutable<BR>): number {
	if (isꓽWithLastUserInvestmentTimestamp(s)) {
		const { last_user_investment_tms } = s
		assert(Number.isSafeInteger(last_user_investment_tms), "getꓽlast_user_activity_timestamp() safeInteger")
		return last_user_investment_tms
	}

	throw new Error("getꓽlast_user_activity_timestamp() should have a recognized activity-stamped structure!")
}

export function getꓽlast_user_activity_timestampⵧloose<
	V extends WithLastUserInvestmentTimestamp,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<AnyOffirmoState>): number {
	if (isꓽWithLastUserInvestmentTimestamp(s)) return getꓽlast_user_activity_timestamp(s as Immutable<V>)

	// final fallback
	return 0
}

// TODO review name
export function getꓽbaseⵧloose<
	VR extends WithSchemaVersion & WithRevision & WithLastUserInvestmentTimestamp,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<VR> | Immutable<AnyOffirmoState>): Immutable<StateInfos> | null | undefined | string {
	if (s === null) return null
	if (s === undefined) return undefined
	if (typeof s !== "object") return `[not a state! ${typeof s}]`
	return {
		schema_version: getꓽschema_versionⵧloose(s as any),
		revision: getꓽrevisionⵧloose(s as any),
		last_user_investment_tms: getꓽlast_user_activity_timestampⵧloose(s as any),
		timestamp_ms: getꓽtimestampⵧloose(s as any),
	}
}
