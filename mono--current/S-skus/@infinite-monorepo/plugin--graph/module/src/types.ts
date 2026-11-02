/////////////////////////////////////////////////

// content of $MONOREPO_ROOT$/.monorepo/graph.json5
export interface PackageGraph {
	packages: Array<PackageGraphⳇPackage> // the phantoms first by fqname, then sorted by path
}

export type PackageGraphⳇPackage = PackageGraphⳇPackageⵧreal | PackageGraphⳇPackageⵧphantom

export interface PackageGraphⳇPackageⵧreal {
	isꓽphantom: false
	fqname: PkgFQName
	path‿rel: DirPathⳇRelative // relative to the monorepo root

	////// pre-extracted infos (could be dynamically re-extracted later, but easier to have it ready)
	// dependencies specification
	deps?: Array<PackageGraphⳇDependency> // monorepo AND external. Omitted if none (empty containers are trimmed when written)
	precedence_group: number // root grouping: slice N can only depend on <=N. Currently extracted from the leading number of the top folder, ex. "0-meta/" → 0, "1-isomorphic/" → 1, otherwise 99 (currently SKU)
	precedence_subgroup: number // sub-grouping (within a group) Subgroup N can only depend on <= N. Currently extracted from the leading number of the 2nd folder if not the package folder, ex. "1-isomorphic/1-libs--simple/…" → 1, "1-isomorphic/2-libs--cross-cutting/…" → 2, otherwise 99
	precedence_pkg: number // a further grouping: package with hint H can only depend on <=H. Currently extracted from the leading number of the package folder, ex. "…/0-freeze/" → 0, "…/43-spec--load/" → 43, otherwise 999
	sibling_deps_count: number // number of distinct monorepo packages directly depended on with the same precedence_group AND precedence_subgroup
	monorepo_deps_count: number // number of distinct monorepo packages directly depended on (all dep types), the lower the simpler
	layer: number // within its precedence chunk (= same precedence_*): 0 = no deps in the chunk, N = all deps in layers < N. In a dep cycle = forced into a layer of its own

	// useful
	sku?: string // ex. "S-skus/@tbrpg/…" → "@tbrpg"
	isꓽpublic: boolean // = published = more critical

	// = to be fixed during resurrection. Omitted if none (empty containers are trimmed when written)
	issues?: Array<PackageGraphⳇIssueⵧany>
}

// = a monorepo dep missing from the packages list, added to be able to call it out and order it
// precedence = inherited from its dependent with the smallest precedence (= the first one needing it)
// no deps since unknown
export interface PackageGraphⳇPackageⵧphantom extends Omit<
	PackageGraphⳇPackageⵧreal,
	"isꓽphantom" | "path‿rel" | "deps" | "sku"
> {
	isꓽphantom: true
}

// = before the layers are derived (they need all the other infos)
export type PackageGraphⳇPackageⵧwithout_layer =
	| Omit<PackageGraphⳇPackageⵧreal, "layer">
	| Omit<PackageGraphⳇPackageⵧphantom, "layer">

export interface PackageGraphⳇDependency {
	fqname: PkgFQName
	type: DependencyType
	// = from this monorepo, by name or namespace
	// if missing from the packages list = reported as an issue
	isꓽmonorepo: boolean
}

/////////////////////////////////////////////////

// generic, to be extended (+ added to the union below)
export interface PackageGraphⳇIssue {
	type: string // discriminant
	message: string // human-readable, ex. for display
}

export interface PackageGraphⳇIssueⵧmissing_dep extends PackageGraphⳇIssue {
	type: "missing_dep" // monorepo dep missing from the packages list (= a phantom)
	dep: PkgFQName
}

export interface PackageGraphⳇIssueⵧmissing_package extends PackageGraphⳇIssue {
	type: "missing_package" // on a phantom
	dependents: Array<PkgFQName>
}

export interface PackageGraphⳇIssueⵧprecedence_violation extends PackageGraphⳇIssue {
	type: "precedence_violation" // monorepo dep coming LATER in the explicit order (precedence_group > precedence_subgroup > precedence_pkg) = against the specification
	dep: PkgFQName
}

export interface PackageGraphⳇIssueⵧdep_cycle extends PackageGraphⳇIssue {
	type: "dep_cycle"
	peers: Array<PkgFQName> // the other packages of the cycle(s)
}

export type PackageGraphⳇIssueⵧany =
	| PackageGraphⳇIssueⵧmissing_dep
	| PackageGraphⳇIssueⵧmissing_package
	| PackageGraphⳇIssueⵧprecedence_violation
	| PackageGraphⳇIssueⵧdep_cycle

/////////////////////////////////////////////////

import type { DependencyType, PkgFQName } from "@infinite-monorepo/types-for-plugins"

import type { DirPathⳇRelative } from "@monorepo-private/ts--types"
