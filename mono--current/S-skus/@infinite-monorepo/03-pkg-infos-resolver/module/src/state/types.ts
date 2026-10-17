/////////////////////////////////////////////////

export type PkgName = string
export type PkgNamespace = `@${string}`
export type PkgFQName = string // ex. @offirmo/cli or foo

export type Catalog = Record<PkgFQName, SemVerⳇRange>

export interface State {
	///////////////////// config
	// ⚠️ some config can not be applied too late (or wouldn't take effect)
	// Susceptible to race condition, will throw if set too late
	configⵧcritical: {
		minimum_release_age‿minutes: number | undefined // undef at the beginning
		specifier_overrides_by_fqname: Record<PkgFQName, SemVerⳇRange>
	}
	ↆcritical_config: InspectablePromiseWithResolvers<Required<State["configⵧcritical"]>> // to be resolved once the required config is set, no fetch will happen before
	// no race condition (not critical if missed)
	packages_blocklist: Set<PkgFQName> // those packages should never be seen / processed / requested (used to weed out legacy stuff)
	monorepo_namespaces: Set<PkgFQName> // useful bc we may encounter (preload) a monorepo package before it's declared
	monorepo_pkgs: Set<PkgFQName>
	catalogs: Record<string, Catalog>

	// results
	latest_known_packageᐧjson_by_fqname: Record<PkgFQName, PackageJson>

	// intermediates
	ↆpackageᐧjson_fetches_by_fqname: Record<PkgFQName, PendingAsync<PackageJson>>
}

// can be declared once, overrides later will crash
export interface ResolutionConfig {
	// only pick versions published at least this long ago (supply chain attacks are usually detected quickly)
	// same semantic as pnpm's minimumReleaseAge https://pnpm.io/settings#minimumreleaseage
}

export type PendingAsync<T> = InspectablePromise<
	T,
	{
		_auto: boolean // if true, means it's a preemptive+speculative load, should not crash if failure
		key: string
	}
>

export interface PackageJson {
	// subset of interest to us so far, more is available if needed
	name: PkgFQName
	version?: SemVerⳇExact
	types?: PkgFQName // https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package
	private?: true
	// TODO 1D peer and optional

	// custom
	_types_package_json?: PackageJson | undefined | null // null = no types, undef = don't know for sure
}

/////////////////////////////////////////////////

import type { SemVerⳇExact, SemVerⳇRange } from "@monorepo-private/ts--types"
import type { InspectablePromise, InspectablePromiseWithResolvers } from "@monorepo-private/utils--async"
