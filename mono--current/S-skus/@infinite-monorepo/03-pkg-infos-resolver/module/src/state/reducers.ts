/////////////////////////////////////////////////
const LIB = "PkgVersionResolver/State"

export function create(): Immutable<State> {
	console.log(`[${LIB}] creating…`)

	return {
		ↆcritical_config: createꓽInspectablePromiseⵧwithResolvers<Required<State["configⵧcritical"]>>(),
		configⵧcritical: {
			minimum_release_age‿minutes: undefined,
			specifier_overrides_by_fqname: {},
		},

		packages_blocklist: new Set(),
		monorepo_namespaces: new Set(),
		monorepo_pkgs: new Set(),
		catalogs: { default: {} },

		latest_known_packageᐧjson_by_fqname: {},

		ↆpackageᐧjson_fetches_by_fqname: {},
	}
}

// BEGIN beware of race conditions
export function declareꓽversion_override(
	state: Immutable<State>,
	pkg_name: PkgFQName,
	version: SemVerⳇRange,
): Immutable<State> {
	const ǃ = assert_from({ declareꓽversion_override })

	const existing = state.configⵧcritical.specifier_overrides_by_fqname[pkg_name]
	if (existing) {
		ǃ.forⵧparam({ version }).require(existing === version, `Conflicting override for "${pkg_name}"`)
		return state
	}

	ǃ.ensure(state.ↆcritical_config.state === "pending", "race condition: critical config set too late")

	return {
		...state,
		configⵧcritical: {
			...state.configⵧcritical,
			specifier_overrides_by_fqname: {
				...state.configⵧcritical.specifier_overrides_by_fqname,
				[pkg_name]: version,
			},
		},
	}
}
export function declareꓽminimum_release_age(
	state: Immutable<State>,
	minimum_release_age‿minutes: number,
): Immutable<State> {
	const ǃ = assert_from({ declareꓽminimum_release_age })

	const existing = state.configⵧcritical.minimum_release_age‿minutes
	if (existing) {
		ǃ.forⵧparam({ minimum_release_age‿minutes }).require(
			existing === minimum_release_age‿minutes,
			`Conflicting override for minimum_release_age‿minutes`,
		)
		return state
	}

	ǃ.ensure(state.ↆcritical_config.state === "pending", "race condition: critical config set too late")

	return {
		...state,
		configⵧcritical: {
			...state.configⵧcritical,
			minimum_release_age‿minutes,
		},
	}
}

export function finalizeꓽcritical_config(state: Immutable<State>): Immutable<State> {
	const ǃ = assert_from({ finalizeꓽcritical_config })

	ǃ.ensure(state.ↆcritical_config.state === "pending", "race condition: critical config re-finalized")

	if (!state.configⵧcritical.minimum_release_age‿minutes) {
		state = declareꓽminimum_release_age(state, 1_000)
	}

	state.ↆcritical_config.resolve(state.configⵧcritical)

	console.log(`[${LIB}] critical config finalized.`)

	return state
}
// END beware of race conditions

export function processꓽresolved_pending_async(state: Immutable<State>): Immutable<State> {
	const ↆpackageᐧjson_fetches_by_fqname = {
		...state.ↆpackageᐧjson_fetches_by_fqname,
	}

	let modified = false
	state = Object.entries(ↆpackageᐧjson_fetches_by_fqname).reduce((state, [pkg_name, ↆinspectable]) => {
		switch (ↆinspectable.state) {
			case "pending":
				return state

			case "rejected": {
				if (ↆinspectable._auto && (ↆinspectable.reason as any)?.name === "PackageNotFoundError") {
					console.log(`[${LIB}] Preemptive pkg ${pkg_name} not found, ignoring.`)
				} else {
					const err = ↆinspectable.reason
					console.error(`[${LIB}] Error loading package.json for "${pkg_name}":`, err)
					throw err
				}
				break
			}

			case "fulfilled": {
				const packageᐧjson = ↆinspectable.value
				assert(!!packageᐧjson)
				state = {
					...state,
					latest_known_packageᐧjson_by_fqname: {
						...state.latest_known_packageᐧjson_by_fqname,
						[pkg_name]: packageᐧjson,
					},
				}
				console.log(
					`[${LIB}] ${ↆinspectable._auto ? "preemptive" : "    "} package.json loaded for "${pkg_name}" v${semver.clean(packageᐧjson.version ?? "")} (${`includes types? ${hasꓽembedded_typescript_types(packageᐧjson)}`})`,
				)

				if (packageᐧjson._types_package_json) {
					const sub_packageᐧjson = packageᐧjson._types_package_json
					state = {
						...state,
						latest_known_packageᐧjson_by_fqname: {
							...state.latest_known_packageᐧjson_by_fqname,
							[sub_packageᐧjson.name]: sub_packageᐧjson,
						},
					}
					console.log(
						`[${LIB}] types      package.json "${sub_packageᐧjson.name}" loaded for "${pkg_name}" v${semver.clean(sub_packageᐧjson.version ?? "")}`,
					)
				}
				break
			}

			default:
				assertⵧnever_reached()
		}

		modified = true
		delete ↆpackageᐧjson_fetches_by_fqname[pkg_name]

		return state
	}, state)

	if (!modified) return state

	return {
		...state,
		ↆpackageᐧjson_fetches_by_fqname: ↆpackageᐧjson_fetches_by_fqname,
	}
}

export function declareꓽmonorepo_pkg(state: Immutable<State>, name: PkgFQName): Immutable<State> {
	if (state.monorepo_pkgs.has(name)) return state

	// TODO 1D if namespace already covered, skip?

	return {
		...state,
		monorepo_pkgs: new Set([...state.monorepo_pkgs, name]),
	}
}
export function declareꓽmonorepo_namespace(state: Immutable<State>, ns: PkgNamespace): Immutable<State> {
	if (state.monorepo_namespaces.has(ns)) return state

	return {
		...state,
		monorepo_namespaces: new Set([...state.monorepo_namespaces, ns]),
	}
}

/* useful for LOCAL packages?
export function set(state: Immutable<State>, packageᐧjson: PackageJson, { force = false } = {}): Immutable<State> {
	const ǃ = assert_from({ set })

	ǃ.forⵧparam({ packageᐧjson }).require(packageᐧjson.name, `Package name is required!`)

	if (state.latest_known_packageᐧjson_by_fqname[packageᐧjson.name]) {
		ǃ.forⵧvalue({ state }).ensure(force, `Package "${packageᐧjson.name}" should not be already loaded!`)
	}
	if (state.ↆpackageᐧjson_fetches_by_fqname[packageᐧjson.name]) {
		ǃ.forⵧvalue({ state }).ensure(force, `Package "${packageᐧjson.name}" should not be already loading!`)
	}

	return {
		...state,
		latest_known_packageᐧjson_by_fqname: {
			...state.latest_known_packageᐧjson_by_fqname,
			[packageᐧjson.name]: packageᐧjson,
		},
	}
}
 */

export function preload_if_npm(
	state: Immutable<State>,
	maybe_pkg_name: string,
	_auto: boolean = false,
): Immutable<State> {
	if (state.latest_known_packageᐧjson_by_fqname[maybe_pkg_name]) return state
	if (!isꓽnpm_package(maybe_pkg_name)) {
		// for now
		return state
	}

	const pkg_name: PkgFQName = maybe_pkg_name as any
	assertꓽallowed_package(state, pkg_name)
	if (isꓽmonorepo_package(state, pkg_name)) {
		// for now
		return state
	}
	if (state.ↆpackageᐧjson_fetches_by_fqname[maybe_pkg_name]) return state

	console.log(`[${LIB}] scheduling resolution for "${pkg_name}"…`)

	state = {
		...state,
		ↆpackageᐧjson_fetches_by_fqname: {
			...state.ↆpackageᐧjson_fetches_by_fqname,
			[pkg_name]: deriveꓽInspectablePromise(
				state.ↆcritical_config.then(({ minimum_release_age‿minutes, specifier_overrides_by_fqname }) => {
					/*if (pkg_name === "@types/node") {
						debugger
					}*/
					const version_specifier = specifier_overrides_by_fqname[pkg_name]
					return ↆretrieveꓽpackageᐧjsonⵧextended(pkg_name, {
						version_specifier,
						_auto,
						minimum_release_age‿minutes,
					})
				}),
				{
					key: pkg_name,
					_auto,
				},
			),
		},
	}

	return state
}

// TODO review semantic
// TODO auto add types? peer?
export function add_catalog_entry(
	state: Immutable<State>,
	pkg_name: PkgFQName,
	catalog_name?: string,
): Immutable<State> {
	catalog_name ??= "default" // TODO 1D auto sub-catalogs

	if (state.catalogs[catalog_name]?.[pkg_name]) return state

	if (isꓽmonorepo_package(state, pkg_name)) {
		// no need
		return state
	}

	const v = ǃgetꓽversionⵧfor_catalog(state, pkg_name)

	return {
		...state,
		catalogs: {
			...state.catalogs,
			[catalog_name]: {
				...state.catalogs[catalog_name],
				[pkg_name]: v,
			},
		},
	}
}

/////////////////////////////////////////////////

import * as semver from "semver"

import { assert_from, assert, assertⵧnever_reached } from "@monorepo-private/assert"
import type { Immutable, SemVerⳇRange } from "@monorepo-private/ts--types"
import { createꓽInspectablePromiseⵧwithResolvers } from "@monorepo-private/utils--async"
import { deriveꓽInspectablePromise } from "@monorepo-private/utils--async"

import { ↆretrieveꓽpackageᐧjsonⵧextended } from "../utils/retrieve-package_json.ts"
import { isꓽnpm_package, hasꓽembedded_typescript_types } from "../utils/utils--npm.ts"

import { assertꓽallowed_package, isꓽmonorepo_package, ǃgetꓽversionⵧfor_catalog } from "./selectors.ts"
import type { State, PackageJson, PkgFQName, PkgNamespace } from "./types.ts"
