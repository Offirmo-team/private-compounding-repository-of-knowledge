/////////////////////////////////////////////////

export type PkgName = string
export type PkgNamespace = `@${string}`
export type PkgFQName = string // ex. @offirmo/cli or foo

export type Catalog = Record<PkgFQName, SemVerⳇRange>

export interface PackageJson {
	// subset of interest to us so far, more is available if needed
	name: PkgFQName
	version?: SemVerⳇExact
	types?: PkgFQName // https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package
	private?: true
	// TODO peer

	_types_package_json?: PackageJson | undefined | null // null = no types, undef = don't know for sure
}

export type PendingAsync<T> = InspectablePromise<
	T,
	{
		_auto: boolean // if true, means it's a preemptive+speculative load, should not crash if failure
		key: string
	}
>

export interface ResolverConfig {
	// only pick versions published at least this long ago (supply chain attacks are usually detected quickly)
	// same semantic as pnpm's minimumReleaseAge https://pnpm.io/settings#minimumreleaseage
	minimum_release_age‿minutes: number
}

export interface State {
	config: {
		// undefined = not declared yet = no constraint
		// can be declared only once, a different value later = conflict
		minimum_release_age‿minutes: number | undefined
	}

	latest_known_packageᐧjson_by_fqname: Record<PkgFQName, PackageJson>

	ↆpackageᐧjson_fetches_by_fqname: Record<PkgFQName, PendingAsync<PackageJson>>

	packages_blocklist: Set<PkgFQName>

	// declarative
	specifier_overrides_by_fqname: Record<PkgFQName, SemVerⳇRange>
	monorepo_pkgs: Set<PkgFQName>
	monorepo_namespaces: Set<PkgFQName> // useful bc we may encounter (preload) a monorepo package before it's declared

	catalogs: Record<string, Catalog>
}

/////////////////////////////////////////////////

import type { SemVerⳇExact, SemVerⳇRange } from "@monorepo-private/ts--types"
import type { InspectablePromise } from "@monorepo-private/utils--async"
