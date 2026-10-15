/////////////////////////////////////////////////

// manual switch, useful to do faster re-exec during dev
// retrieve from the current pnpm-lock.yaml + pnpm virtual store, only reach npm for what's missing
// NOTE: some packages are deep deps and not featured in pnpm-lock.yaml + pnpm virtual store, hence this doesn't prevent 100% of fetches
const PREFER_LOCAL_PNPM = false

/////////////////////////////////////////////////

export function create(config: Immutable<Partial<ResolverConfig>> = {}): Immutable<State> {
	return {
		config: {
			minimum_release_age‿minutes: config.minimum_release_age‿minutes, // = declared at init, if provided
		},

		latest_known_packageᐧjson_by_fqname: {},
		ↆpackageᐧjson_fetches_by_fqname: {},
		requested_fqnames: new Set(),
		consumed_fqnames: new Set(),
		packages_blocklist: new Set(),
		monorepo_pkgs: new Set(),
		monorepo_namespaces: new Set(),
		specifier_overrides_by_fqname: {},
		catalogs: { default: {} },
	}
}

export function processꓽresolved_pending_async(state: Immutable<State>): Immutable<State> {
	const ↆpackageᐧjson_fetches_by_fqname = {
		...state.ↆpackageᐧjson_fetches_by_fqname,
	}

	let modified = false
	state = Object.entries(ↆpackageᐧjson_fetches_by_fqname).reduce((state, [pkg_name, ip]) => {
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
					`${ip._auto ? "preemptive" : "    "} package.json loaded for "${pkg_name}" v${semver.clean(packageᐧjson.version ?? "")} (${`includes types? ${hasꓽembedded_typescript_types(packageᐧjson)}`})`,
				)

				if (
					packageᐧjson._types_package_json &&
					!state.consumed_fqnames.has(packageᐧjson._types_package_json.name)
				) {
					const sub_packageᐧjson = packageᐧjson._types_package_json
					state = {
						...state,
						latest_known_packageᐧjson_by_fqname: {
							...state.latest_known_packageᐧjson_by_fqname,
							[sub_packageᐧjson.name]: sub_packageᐧjson,
						},
					}
					console.log(
						`types      package.json "${sub_packageᐧjson.name}" loaded for "${pkg_name}" v${semver.clean(sub_packageᐧjson.version ?? "")}`,
					)
				}
				break
			}

			default:
				throw new Error(`Unexpected!`)
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

	state = {
		...state,
		specifier_overrides_by_fqname: {
			...state.specifier_overrides_by_fqname,
			[pkg_name]: version,
		},
	}

	const versionⵧknown = state.latest_known_packageᐧjson_by_fqname[pkg_name]?.version
	const isꓽknown_still_valid = !!versionⵧknown && semver.satisfies(versionⵧknown, version)
	if (state.consumed_fqnames.has(pkg_name)) {
		assert(
			isꓽknown_still_valid,
			`Version override "${version}" for "${pkg_name}" declared too late: v${versionⵧknown} was already used! Declare it earlier.`,
		)
		return state
	}
	if (isꓽknown_still_valid) return state

	const isꓽretrieved_or_retrieving =
		state.requested_fqnames.has(pkg_name) || !!state.latest_known_packageᐧjson_by_fqname[pkg_name]
	if (!isꓽretrieved_or_retrieving) return state // the override will be used when requested

	console.log(`"${pkg_name}": version override "${version}" declared after retrieval, re-retrieving…`)
	return _launchꓽretrieval(state, pkg_name)
}

export function declareꓽminimum_release_age(
	state: Immutable<State>,
	minimum_release_age‿minutes: number,
): Immutable<State> {
	const ǃ = assert_from({ declareꓽminimum_release_age })

	// we can't tell whether a consumed version is old enough (no publish date)
	assert(
		state.consumed_fqnames.size === 0,
		`Minimum release age declared too late, some packages were already used: ${[...state.consumed_fqnames].join(", ")}! Declare it earlier.`,
	)

	state = {
		...state,
		config: { ...state.config, minimum_release_age‿minutes },
	}

	console.log(
		`minimum release age = ${minimum_release_age‿minutes}min declared after retrievals, re-retrieving ${state.requested_fqnames.size} package(s)…`,
	)
	return [...state.requested_fqnames].reduce((state, pkg_name) => _launchꓽretrieval(state, pkg_name), state)
}

export function markꓽconsumed(state: Immutable<State>, pkg_name: PkgFQName): Immutable<State> {
	if (state.consumed_fqnames.has(pkg_name)) return state

	return {
		...state,
		consumed_fqnames: new Set([...state.consumed_fqnames, pkg_name]),
	}
}

// useful for LOCAL packages?
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

	return _launchꓽretrieval(state, pkg_name, _auto)
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
		...markꓽconsumed(state, pkg_name),
		catalogs: {
			...state.catalogs,
			[catalog_name]: {
				...state.catalogs[catalog_name],
				[pkg_name]: v,
			},
		},
	}
}

// (re-)launch with the current constraints, superseding any previous retrieval
function _launchꓽretrieval(state: Immutable<State>, pkg_name: PkgFQName, _auto: boolean = false): Immutable<State> {
	const version = state.specifier_overrides_by_fqname[pkg_name]
	console.log(`PkgVersionResolver now querying "${pkg_name}"…`)

	// superseded = nobody will await it anymore, a rejection would crash the process as "unhandled"
	state.ↆpackageᐧjson_fetches_by_fqname[pkg_name]?.catch(() => {})

	const { [pkg_name]: _superseded, ...latest_known_packageᐧjson_by_fqname } = state.latest_known_packageᐧjson_by_fqname

	return {
		...state,
		latest_known_packageᐧjson_by_fqname,
		requested_fqnames: new Set([...state.requested_fqnames, pkg_name]),
		ↆpackageᐧjson_fetches_by_fqname: {
			...state.ↆpackageᐧjson_fetches_by_fqname,
			[pkg_name]: ↆretrieveꓽpackageᐧjson(pkg_name, version, _auto, state.config),
		},
	}
}

function ↆretrieveꓽpackageᐧjson(
	pkg_name: PkgFQName,
	version: SemVerⳇRange | undefined,
	_auto: boolean,
	config: Immutable<ResolverConfig>,
): Immutable<PendingAsync<PackageJson>> {
	let raw: Promise<PackageJson> = _ↆretrieveꓽpackageᐧjson(pkg_name, version, () =>
		ↆfetchꓽpackageᐧjsonⵧfrom_network(pkg_name, { ...config, version_specifier: version }),
	)

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
					return await _ↆretrieveꓽpackageᐧjson(potential_types_pkg_name, undefined, () =>
						ↆfetchꓽpackageᐧjsonⵧfrom_network(potential_types_pkg_name, {
							...config,
							version_specifier: undefined,
						}),
					)
				} catch (err) {
					if ((err as any)?.name === "PackageNotFoundError") {
						console.log(`Preemptive pkg ${potential_types_pkg_name} not found, ignoring.`)
						return undefined
					}
					if ((err as any)?.name === "VersionNotFoundError") {
						console.log(`Preemptive pkg ${potential_types_pkg_name} has no version old enough, ignoring.`)
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

async function _ↆretrieveꓽpackageᐧjson(
	pkg_name: PkgFQName,
	version_specifier: SemVerⳇRange | undefined,
	ↆfetchⵧfallback: () => Promise<PackageJson>,
): Promise<PackageJson> {
	if (!PREFER_LOCAL_PNPM) return ↆfetchⵧfallback()

	const packageᐧjsonⵧlocal = await ↆgetꓽpackageᐧjsonⵧfrom_local_pnpm(pkg_name, version_specifier)
	if (packageᐧjsonⵧlocal) return packageᐧjsonⵧlocal

	console.log(`"${pkg_name}" not available in the local pnpm store, falling back…`)
	return ↆfetchⵧfallback()
}

/////////////////////////////////////////////////

import * as semver from "semver"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, SemVerⳇRange } from "@monorepo-private/ts--types"
import { deriveꓽInspectablePromise } from "@monorepo-private/utils--async"

import { assertꓽallowed_package, isꓽmonorepo_package, ǃgetꓽversionⵧfor_catalog } from "./selectors.ts"
import type { State, PackageJson, PkgFQName, PkgNamespace, PendingAsync, ResolverConfig } from "./types.ts"
import { ↆfetchꓽpackageᐧjsonⵧfrom_network } from "./utils--network.ts"
import { isꓽnpm_package, getꓽlikely_corresponding_types_pkg, hasꓽembedded_typescript_types } from "./utils--npm.ts"
import { ↆgetꓽpackageᐧjsonⵧfrom_local_pnpm } from "./utils--pnpm.ts"
