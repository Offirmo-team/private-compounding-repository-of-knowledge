/////////////////////////////////////////////////

export function create(): Immutable<State> {
	return {
		latest_known_packageᐧjson_by_fqname: {},
		ↆpackageᐧjson_fetches: {},
		packages_blocklist: new Set(),
		monorepo_pkgs: new Set(),
		monorepo_namespaces: new Set(),
		specifier_overrides_by_fqname: {},
		catalogs: { default: {} },
	}
}

export function processꓽresolved_pending_async(state: Immutable<State>): Immutable<State> {
	const ↆpackageᐧjson_fetches = {
		...state.ↆpackageᐧjson_fetches,
	}

	let modified = false
	state = Object.entries(ↆpackageᐧjson_fetches).reduce((state, [pkg_name, ip]) => {
		switch (ip.state) {
			case "pending":
				return state

			case "rejected": {
				if (ip._auto && (ip.reason as any)?.name === "PackageNotFoundError") {
					console.log(`Preemptive pkg ${pkg_name} not found, ignoring.`)
				} else {
					const err = ip.reason
					console.error(`Error loading package.json for "${pkg_name}":`, err)
					throw err
				}
				break
			}

			case "fulfilled": {
				const packageᐧjson = ip.value
				assert(!!packageᐧjson)
				state = {
					...state,
					latest_known_packageᐧjson_by_fqname: {
						...state.latest_known_packageᐧjson_by_fqname,
						[pkg_name]: packageᐧjson,
					},
				}
				console.log(
					`${ip._auto ? "preemptive" : "    "} package.json loaded for "${pkg_name}" v${semver.clean(packageᐧjson.version)} (${`includes types? ${hasꓽembedded_typescript_types(packageᐧjson)}`})`,
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
						`types      package.json "${sub_packageᐧjson.name}" loaded for "${pkg_name}" v${semver.clean(sub_packageᐧjson.version)}`,
					)
				}
				break
			}

			default:
				throw new Error(`Unexpected!`)
		}

		modified = true
		delete ↆpackageᐧjson_fetches[pkg_name]

		return state
	}, state)

	if (!modified) return state

	return {
		...state,
		ↆpackageᐧjson_fetches,
	}
}

export function declareꓽmonorepo_pkg(state: Immutable<State>, pkg_name: PkgFQName): Immutable<State> {
	if (state.monorepo_pkgs.has(pkg_name)) return state

	return {
		...state,
		monorepo_pkgs: new Set([...state.monorepo_pkgs, pkg_name]),
	}
}
export function declareꓽmonorepo_namespace(state: Immutable<State>, ns: PkgNamespace): Immutable<State> {
	if (state.monorepo_namespaces.has(ns)) return state

	return {
		...state,
		monorepo_namespaces: new Set([...state.monorepo_namespaces, ns]),
	}
}
export function declareꓽversion_override(
	state: Immutable<State>,
	pkg_name: PkgFQName,
	version: SemVerⳇRange,
): Immutable<State> {
	const existing = state.specifier_overrides_by_fqname[pkg_name]
	if (existing) {
		assert(existing === version, `Conflicting override for "${pkg_name}"`)
		return state
	}

	return {
		...state,
		specifier_overrides_by_fqname: {
			...state.specifier_overrides_by_fqname,
			[pkg_name]: version,
		},
	}
}

// useful for LOCAL packages?
export function set(state: Immutable<State>, packageᐧjson: PackageJson, { force = false } = {}): Immutable<State> {
	const ǃ = assert_from({ set })

	ǃ.for_param({ packageᐧjson }).require(packageᐧjson.name, `Package name is required!`)

	if (state.latest_known_packageᐧjson_by_fqname[packageᐧjson.name]) {
		ǃ.for_value({ state }).ensure(force, `Package "${packageᐧjson.name}" should not be already loaded!`)
	}
	if (state.ↆpackageᐧjson_fetches[packageᐧjson.name]) {
		ǃ.for_value({ state }).ensure(force, `Package "${packageᐧjson.name}" should not be already loading!`)
	}

	return {
		...state,
		latest_known_packageᐧjson_by_fqname: {
			...state.latest_known_packageᐧjson_by_fqname,
			[packageᐧjson.name]: packageᐧjson,
		},
	}
}

//
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
	if (state.ↆpackageᐧjson_fetches[maybe_pkg_name]) return state

	const version = state.specifier_overrides_by_fqname[pkg_name]
	console.log(`PkgVersionResolver now querying "${pkg_name}"…`)

	state = {
		...state,
		ↆpackageᐧjson_fetches: {
			...state.ↆpackageᐧjson_fetches,
			[pkg_name]: ↆfetchꓽpackageᐧjson(pkg_name, version, _auto),
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

function ↆfetchꓽpackageᐧjson(
	pkg_name: PkgFQName,
	version: SemVerⳇRange | undefined,
	_auto: boolean,
): Immutable<PendingAsync<PackageJson>> {
	let raw: Promise<PackageJson> = _ↆfetchꓽpackageᐧjson(pkg_name, {
		...(version && { version }),
		fullMetadata: true,
		omitDeprecated: true,
	})

	if (!pkg_name.startsWith("@types/")) {
		// pre-emptively try to load types as well (BUT may not be needed or not exist)
		// we need to launch this sync for being in #pending_promises as well

		assert(!_auto, `unexpected loop?`)

		const potential_types_pkg_name = getꓽlikely_corresponding_types_pkg(pkg_name)
		raw = raw.then(async (packageᐧjson) => {
			const _types_package_json: PackageJson["_types_package_json"] = await (async () => {
				if (hasꓽembedded_typescript_types(packageᐧjson)) {
					// no need to search for a types package, it's already included
					console.log(
						`Preemptive "${potential_types_pkg_name}" is not needed, types are already included in "${pkg_name}"`,
					)
					return null
				}

				console.log(
					`types are NOT already included in "${pkg_name}", initiating preemptive "${potential_types_pkg_name}" preload`,
				)

				try {
					return await _ↆfetchꓽpackageᐧjson(potential_types_pkg_name)
				} catch (err) {
					if ((err as any)?.name === "PackageNotFoundError") {
						console.log(`Preemptive pkg ${potential_types_pkg_name} not found, ignoring.`)
						return undefined
					}

					console.error(`Error loading sub-package "${potential_types_pkg_name}" for "${pkg_name}":`, err)
					throw err
				}
			})()

			return {
				...packageᐧjson,
				_types_package_json,
			}
		})
	}

	return deriveꓽInspectablePromise(raw, {
		key: pkg_name,
		_auto,
	})
}

/////////////////////////////////////////////////

import _ↆfetchꓽpackageᐧjson from "package-json"
import * as semver from "semver"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, SemVerⳇRange } from "@monorepo-private/ts--types"
import { deriveꓽInspectablePromise } from "@monorepo-private/utils--async"

import { assertꓽallowed_package, isꓽmonorepo_package, ǃgetꓽversionⵧfor_catalog } from "./selectors.ts"
import type { State, PackageJson, PkgFQName, PkgNamespace, PendingAsync } from "./types.ts"
import { isꓽnpm_package, getꓽlikely_corresponding_types_pkg, hasꓽembedded_typescript_types } from "./utils--npm.ts"
