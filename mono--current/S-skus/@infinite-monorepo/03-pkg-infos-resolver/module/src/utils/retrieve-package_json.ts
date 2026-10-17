/////////////////////////////////////////////////
const LIB = "PkgVersionResolver/RetrievePkg"

// manual switch, useful to do faster re-exec during dev
// retrieve from the current pnpm-lock.yaml + pnpm virtual store, only reach npm for what's missing
// NOTE: some packages are deep deps and not featured in pnpm-lock.yaml + pnpm virtual store, hence this doesn't prevent 100% of fetches
const PREFER_LOCAL_PNPM = false

// extended = we'll embed the candidate types pkg in the parent pkg.json
export function ↆretrieveꓽpackageᐧjsonⵧextended(
	pkg_name: PkgFQName,
	{
		version_specifier,
		minimum_release_age‿minutes,
		_auto,
	}: {
		minimum_release_age‿minutes: number
		version_specifier: SemVerⳇRange | undefined
		_auto: boolean // true if preemptive call. preemptive calls should not chain to avoid loops
	},
): Immutable<Promise<PackageJson>> {
	const ǃ = assert_from({ ↆretrieveꓽpackageᐧjsonⵧextended })

	let raw: Promise<PackageJson> = _ↆretrieveꓽpackageᐧjson(pkg_name, version_specifier, minimum_release_age‿minutes)

	if (!pkg_name.startsWith("@types/")) {
		// pre-emptively try to load types as well (BUT may not be needed or not exist)
		// we need to launch this sync for being in #pending_promises as well

		ǃ.require(!_auto, `unexpected loop?`)

		const potential_types_pkg_name = getꓽlikely_corresponding_types_pkg(pkg_name)
		raw = raw.then(async (packageᐧjson) => {
			const _types_package_json: PackageJson["_types_package_json"] = await (async () => {
				if (hasꓽembedded_typescript_types(packageᐧjson)) {
					// no need to search for a types package, it's already included
					console.log(
						`[${LIB}] Preemptive "${potential_types_pkg_name}" is not needed, types are already included in "${pkg_name}"`,
					)
					return null
				}

				console.log(
					`[${LIB}] types are NOT already included in "${pkg_name}", initiating preemptive "${potential_types_pkg_name}" preload`,
				)

				try {
					// TODO should we reuse version_specifier ?
					return await _ↆretrieveꓽpackageᐧjson(potential_types_pkg_name, undefined, minimum_release_age‿minutes)
				} catch (err) {
					if ((err as any)?.name === "PackageNotFoundError") {
						console.log(`[${LIB}] Preemptive pkg ${potential_types_pkg_name} not found, ignoring.`)
						return undefined
					}
					if ((err as any)?.name === "VersionNotFoundError") {
						console.log(
							`[${LIB}] Preemptive pkg ${potential_types_pkg_name} has no version old enough, ignoring.`,
						)
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

	return raw
}

async function _ↆretrieveꓽpackageᐧjson(
	pkg_name: PkgFQName,
	version_specifier: SemVerⳇRange | undefined,
	minimum_release_age‿minutes: number,
): Promise<PackageJson> {
	if (PREFER_LOCAL_PNPM) {
		const packageᐧjsonⵧlocal = await ↆgetꓽpackageᐧjsonⵧfrom_local_pnpm(pkg_name, version_specifier)
		if (packageᐧjsonⵧlocal) return packageᐧjsonⵧlocal

		console.log(`"${pkg_name}" not available in the local pnpm store, falling back…`)
	}

	return ↆfetchꓽpackageᐧjsonⵧfrom_network(pkg_name, {
		minimum_release_age‿minutes,
		version_specifier,
	})
}

/////////////////////////////////////////////////

import { assert_from, assert, assertⵧnever_reached } from "@monorepo-private/assert"
import type { Immutable, SemVerⳇRange } from "@monorepo-private/ts--types"

import type { PackageJson, PkgFQName } from "../state/types.ts"

import { ↆfetchꓽpackageᐧjsonⵧfrom_network } from "./retrieve--from-registries.ts"
import { ↆgetꓽpackageᐧjsonⵧfrom_local_pnpm } from "./retrieve--from_local.ts"
import { getꓽlikely_corresponding_types_pkg, hasꓽembedded_typescript_types } from "./utils--npm.ts"
