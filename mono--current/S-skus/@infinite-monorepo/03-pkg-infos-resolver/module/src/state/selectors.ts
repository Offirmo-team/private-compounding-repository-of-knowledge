/////////////////////////////////////////////////

export function getꓽall_pending_async(state: Immutable<State>) {
	return Object.values(state.ↆpackageᐧjson_fetches)
}

export function isꓽallowed_package(state: Immutable<State>, pkg_name: PkgFQName): boolean {
	return !state.packages_blocklist.has(pkg_name)
}

export function isꓽmonorepo_package(state: Immutable<State>, pkg_name: PkgFQName): boolean {
	if (state.monorepo_pkgs.has(pkg_name)) return true

	const ns = getꓽnamespace(pkg_name)
	if (ns && state.monorepo_namespaces.has(ns)) return true

	return false
}

export function assertꓽallowed_package(state: Immutable<State>, pkg_name: PkgFQName): void {
	const ǃ = assert_from({ assertꓽallowed_package })
	ǃ.assert(isꓽallowed_package(state, pkg_name), `⛔️ forbidden package "${pkg_name}" encountered!`)
}

export function getꓽcatalog(state: Immutable<State>, catalog_name: string = "default"): Immutable<Catalog> {
	const ǃ = assert_from({ getꓽcatalog })

	let candidate = state.catalogs[catalog_name]
	ǃ.assert(!!candidate, `unknown catalog "${catalog_name}"!`)

	return candidate!
}

export function ǃgetꓽlatest_known_packageᐧjson(state: Immutable<State>, pkg_name: PkgFQName): Immutable<PackageJson> {
	assertꓽallowed_package(state, pkg_name)

	if (state.latest_known_packageᐧjson_by_fqname[pkg_name]) return state.latest_known_packageᐧjson_by_fqname[pkg_name]

	if (state.ↆpackageᐧjson_fetches[pkg_name]) {
		throw new Error(`Package "${pkg_name}" is still loading, please await!`)
	}

	if (!isꓽnpm_package(pkg_name)) {
		throw new Error(`Package "${pkg_name}" is not a npm package!`)
	}

	throw new Error(`No package.json for "${pkg_name}" found! Did you forget to preload?`)
}

export function ǃgetꓽversionⵧlatest_known(state: Immutable<State>, pkg_name: PkgFQName) {
	assertꓽallowed_package(state, pkg_name)

	const packageᐧjson = ǃgetꓽlatest_known_packageᐧjson(state, pkg_name)

	assert(packageᐧjson.version)
	const result = semver.clean(packageᐧjson.version)
	assert(result)
	return result
}

// TODO rename
// TODO this is a decision not from here
export function ǃgetꓽversionⵧfor_catalog(state: Immutable<State>, pkg_name: PkgFQName) {
	assertꓽallowed_package(state, pkg_name)

	if (isꓽmonorepo_package(state, pkg_name)) {
		throw new Error("Unexpected monorepo pkg version check!")
	}

	const latest_pkg_version = ǃgetꓽversionⵧlatest_known(state, pkg_name)

	const major = semver.major(latest_pkg_version)
	//console.log(`latest_pkg_version for ${pkg_name}`, { latest_pkg_version, major })
	if (major !== 0) return `^${major}`
	const minor = semver.minor(latest_pkg_version)
	if (minor !== 0) return `^0.${minor}`

	return `^0.0.${semver.patch(latest_pkg_version)}`
}

export function ǃgetꓽversionⵧfor_dependencies_field(state: Immutable<State>, pkg_name: PkgFQName) {
	assert(isꓽnpm_package(pkg_name))
	assertꓽallowed_package(state, pkg_name)

	// pnpm

	if (isꓽmonorepo_package(state, pkg_name)) {
		return "workspace:*"
	}

	return "catalog:" // TODO named catalogs
}

/////////////////////////////////////////////////
// TODO move to utils?

/////////////////////////////////////////////////

import * as semver from "semver"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { Catalog, State } from "./types.ts"
import type { PkgFQName, PackageJson, State } from "./types.ts"
import {
	isꓽnpm_package,
	getꓽlikely_corresponding_types_pkg,
	hasꓽembedded_typescript_types,
	getꓽnamespace,
} from "./utils--npm.ts"
