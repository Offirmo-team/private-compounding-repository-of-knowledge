import { assert_from, assert } from "@monorepo-private/assert"
import type { SoftExecutionContext } from "@monorepo-private/soft-execution-context"
import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽschema_versionⵧloose, getꓽbaseⵧloose } from "./selectors.ts"
import { isꓽRootState, hasꓽversioned_schema, isꓽBaseState, isꓽUTBundle } from "./type-guards.ts"
import type { AnyBaseState, AnyBaseUState, AnyBaseTState, AnyRootState } from "./types--internal.ts"
import type { BaseState, UTBundle, BaseRootState, AnyOffirmoState } from "./types.ts"

////////////////////////////////////////////////////////////////////////////////////

// the overall goal
export type FullMigrateToLatestFn<State> = (
	SXC: SoftExecutionContext,
	legacy_state: Immutable<any>,
	hints?: Immutable<any>,
) => Immutable<State> // output must be immutable as well since we may return the input unchanged

// TODO review: useful?
export interface Libs {}
const LIBS: Libs = {}

// Basic interface of a migration fn
// for ex. able to migrate 1 version, v(n-1) -> v(n)
export type GenericMigrationFn<State = any, OlderState = any> = (
	SXC: SoftExecutionContext<any, any, any>,
	legacy_state: Immutable<OlderState>,
	hints: Immutable<any>,
) => Immutable<State> // must be immutable as well since we may return the input unchanged

// Slightly more complex fn able to call a previous migration if the legacy state is not at a desired input level
// should be able to handle v(0) -> v(n)
export type MigrationStep<State = any, OlderState = any> = (
	SXC: SoftExecutionContext<any, any, any>,
	legacy_state: Immutable<OlderState>,
	hints: Immutable<any>,
	previous: GenericMigrationFn<OlderState>,
	// for convenience:
	legacy_schema_version: number,
	libs: Immutable<Libs>,
) => Immutable<State> // must be immutable as well since we may return the input unchanged

export type LastMigrationStep<State, OlderState = any> = MigrationStep<State, OlderState>

export type CleanupStep<State> = (
	SXC: SoftExecutionContext<any, any, any>,
	state: Immutable<State>,
	hints: Immutable<any>,
) => Immutable<State>

export type SubStatesMigrationFns = { [key: string]: GenericMigrationFn }

////////////////////////////////////////////////////////////////////////////////////

const _get_state_summary = getꓽbaseⵧloose

export function migrate_toꓽlatestⵧgeneric<State extends AnyOffirmoState>({
	SXC,

	LIB,
	SCHEMA_VERSION,
	legacy_state,
	hints,
	sub_states_migrate_toꓽlatest, // no default to force thinking
	cleanup = (SXC, state, hints) => state,
	pipeline,
}: {
	SXC: SoftExecutionContext
	LIB: string
	SCHEMA_VERSION: number
	legacy_state: Immutable<any>
	hints: Immutable<any>
	sub_states_migrate_toꓽlatest: SubStatesMigrationFns
	cleanup?: CleanupStep<State>
	pipeline: Immutable<[LastMigrationStep<State>, ...MigrationStep[]]>
}): Immutable<State> {
	return SXC.xTry("migrate_toꓽlatest", ({ SXC, logger }) => {
		const existing_version = getꓽschema_versionⵧloose(legacy_state as any)
		console.groupCollapsed(`migration of schema ${LIB} from v${existing_version} to v${SCHEMA_VERSION}`)

		const RSXC = SXC
		RSXC.setLogicalStack({ module: LIB })
		RSXC.setAnalyticsAndErrorDetails({
			version_from: existing_version,
			version_to: SCHEMA_VERSION,
		})

		if (existing_version > SCHEMA_VERSION)
			throw new Error("Your data is from a more recent version of this lib. Please update!")

		let state = legacy_state as Immutable<State> // optimistic initial typecast, may actually be true

		if (existing_version < SCHEMA_VERSION) {
			logger.info(`attempting to migrate schema of ${LIB} from v${existing_version} to v${SCHEMA_VERSION}…`)
			RSXC.fireAnalyticsEvent("schema_migration.began")

			/* recursive wrapper around the migration steps adding traces and try/catch
			 */
			function _recursively_migrate_down_the_pipeline(
				index: number,
				SXC: SoftExecutionContext,
				legacy_state: Immutable<any>,
				hints: Immutable<any>,
			): Immutable<any> {
				const migrate_step = pipeline[index]
				const current_step_name = index >= pipeline.length ? "not-found" : migrate_step?.name || "unknown"

				return RSXC.xTry("migration step:" + current_step_name, ({ SXC }) => {
					if (index >= pipeline.length) {
						throw new Error(`No known migration for updating a v${getꓽschema_versionⵧloose(legacy_state)}!`)
					}
					assert(typeof migrate_step === "function", "migrate step should be a function!")

					const legacy_schema_version = getꓽschema_versionⵧloose(legacy_state as any)
					logger.trace(
						`[${LIB}] ⭆ invoking migration pipeline step ${pipeline.length - index}/${pipeline.length} "${current_step_name}"…`,
						_get_state_summary(legacy_state),
					)
					const state = migrate_step(
						SXC,
						legacy_state,
						hints,
						_recursively_migrate_down_the_pipeline.bind(null, index + 1),
						legacy_schema_version,
						LIBS,
					)
					assert(!!state, "migration step should return something")
					logger.trace(
						`[${LIB}] ⭅ returned from migration pipeline step ${pipeline.length - index}/${pipeline.length} "${current_step_name}".`,
						_get_state_summary(state),
					)
					return state
				})
			}

			// launch the migration chain
			try {
				state = _recursively_migrate_down_the_pipeline(0, RSXC, state, hints) as Immutable<State>
			} catch (err) {
				logger.error(`failed to migrate schema of ${LIB} from v${existing_version} to v${SCHEMA_VERSION}!`)
				RSXC.fireAnalyticsEvent("schema_migration.failed")
				throw err
			}

			logger.info(`${LIB}: schema migration successful.`, _get_state_summary(state))
			RSXC.fireAnalyticsEvent("schema_migration.ended")
		}

		// migrate sub-reducers if any...
		if (isꓽUTBundle(state)) {
			state = _migrate_sub_states__bundle(
				SXC,
				state,
				sub_states_migrate_toꓽlatest,
				hints,
			) as unknown as Immutable<State>
		} else if (isꓽRootState(state)) {
			state = _migrate_sub_states__root<BaseRootState>(
				SXC,
				state,
				sub_states_migrate_toꓽlatest,
				hints,
			) as unknown as Immutable<State>
		} else if (isꓽBaseState(state)) {
			state = _migrate_sub_states__base<BaseState>(
				SXC,
				state as any,
				sub_states_migrate_toꓽlatest,
				hints,
			) as unknown as Immutable<State>
		} else {
			assert(false, "should be a recognized AnyOffirmoState!")
		}

		state = cleanup(SXC, state, hints)

		console.groupEnd()

		return state
	})
}

function _migrate_sub_states__bundle(
	SXC: SoftExecutionContext,
	state: Immutable<UTBundle<AnyBaseUState, AnyBaseTState>>,
	sub_states_migrate_toꓽlatest: SubStatesMigrationFns,
	hints: Immutable<any>,
): Immutable<UTBundle<AnyBaseUState, AnyBaseTState>> {
	let has_change = false
	let [u_state, t_state] = state

	const unmigrated_sub_states = new Set<string>([...Object.keys(sub_states_migrate_toꓽlatest)])
	const sub_states_found = new Set<string>()
	const sub_u_states_found = new Set<string>()
	const sub_t_states_found = new Set<string>()

	// using base state in case of a legacy state
	for (let key in u_state) {
		if (hasꓽversioned_schema(u_state[key])) {
			sub_states_found.add(key)
			sub_u_states_found.add(key)
		}
	}
	for (let key in t_state) {
		if (hasꓽversioned_schema(t_state[key])) {
			sub_states_found.add(key)
			sub_t_states_found.add(key)
		}
	}

	/*
	console.log({
		sub_states_found,
		sub_u_states_found,
		sub_t_states_found,
	})
	*/

	const sub_states_migrated = new Set<string>()
	sub_states_found.forEach((key) => {
		const migrate_sub_to_latest = sub_states_migrate_toꓽlatest[key]
		if (!migrate_sub_to_latest) throw new Error(`Found sub-state "${key}" but no migration fn was provided!`)

		const sub_hints = hints[key]
		const previous_sub_ustate = u_state[key]
		const previous_sub_tstate = t_state[key]
		let new_sub_ustate = previous_sub_ustate
		let new_sub_tstate = previous_sub_tstate

		SXC.xTry(`migration of sub-state "${key}"`, ({ SXC, logger }) => {
			if (sub_u_states_found.has(key) && sub_t_states_found.has(key)) {
				// combo
				const legacy_sub_state = [previous_sub_ustate, previous_sub_tstate]
				logger.trace(
					`⭆ invoking migration fn of bundled sub-state "${key}"…`,
					_get_state_summary(legacy_sub_state as any),
				)
				;[new_sub_ustate, new_sub_tstate] = migrate_sub_to_latest(SXC, legacy_sub_state, sub_hints)
			} else if (sub_u_states_found.has(key)) {
				logger.trace(`⭆ invoking migration fn of sub-UState "${key}"…`, _get_state_summary(previous_sub_ustate))
				new_sub_ustate = migrate_sub_to_latest(SXC, previous_sub_ustate, sub_hints)
			} else if (sub_t_states_found.has(key)) {
				logger.trace(`⭆ invoking migration fn of sub-TState "${key}"…`, _get_state_summary(previous_sub_tstate))
				new_sub_tstate = migrate_sub_to_latest(SXC, previous_sub_tstate, sub_hints)
			} else {
				throw new Error(`Expected sub-state "${key}" was not found!`)
			}
			logger.trace(`⭅ returned from migration fn of sub-*state "${key}".`)
		})

		if (previous_sub_ustate && new_sub_ustate !== previous_sub_ustate) {
			has_change = true
			u_state = {
				...u_state,
				[key]: new_sub_ustate,
			}
		}
		if (previous_sub_tstate && new_sub_tstate !== previous_sub_tstate) {
			has_change = true
			t_state = {
				...t_state,
				[key]: new_sub_tstate,
			}
		}

		sub_states_migrated.add(key)
		unmigrated_sub_states.delete(key)
	})

	if (unmigrated_sub_states.size)
		throw new Error(`Specified sub-states not found! ${Array.from(unmigrated_sub_states).join(",")}`)

	if (!has_change) return state

	return [u_state, t_state]
}

function _migrate_sub_states__root<State extends BaseRootState = AnyRootState>(
	SXC: SoftExecutionContext,
	state: Immutable<State>,
	sub_states_migrate_toꓽlatest: SubStatesMigrationFns,
	hints: Immutable<any>,
): Immutable<State> {
	const { u_state: previous_u_state, t_state: previous_t_state } = state as AnyRootState

	const previous_state_as_bundle: UTBundle<AnyBaseUState, AnyBaseTState> = [previous_u_state, previous_t_state]
	const migrated_bundle = _migrate_sub_states__bundle(
		SXC,
		previous_state_as_bundle,
		sub_states_migrate_toꓽlatest,
		hints,
	)

	if (migrated_bundle === previous_state_as_bundle) return state

	return {
		...state,
		u_state: migrated_bundle[0],
		t_state: migrated_bundle[1],
	}
}

function _migrate_sub_states__base<State extends BaseState>(
	SXC: SoftExecutionContext,
	state: Immutable<State>,
	sub_states_migrate_toꓽlatest: SubStatesMigrationFns,
	hints: Immutable<any>,
): Immutable<State> {
	//let has_change = false
	const legacy_state = state as AnyBaseState

	for (let key in sub_states_migrate_toꓽlatest) {
		if (hasꓽversioned_schema(legacy_state[key])) {
			throw new Error("_migrate_sub_states__base() NIMP!")
		}
	}

	return state
}
