/////////////////////////////////////////////////

// resurrection order:
// 1. explicit order = specification: precedence_group > precedence_subgroup > precedence_pkg
// 2. within the same explicit precedence: dependency order (deps first) = by layer (pre-computed in the graph)
// 3. tie-breaks within a layer: "simplest" first, then public first, then path
// NOTE: a dep contradicting the explicit order is ignored here (= reported as an issue in the graph)
export function sortꓽpackages(
	packages: Immutable<Array<PackageGraphⳇPackage>>,
): Array<Immutable<PackageGraphⳇPackage>> {
	return packages.toSorted(
		(a, b) => compareꓽscores(getꓽlayer_score(a), getꓽlayer_score(b)) || compareꓽpackagesⵧtie_breaks(a, b),
	)
}

// the explicit order, as specified. Lower comes first
export function getꓽprecedence_score(
	pkg: Immutable<Pick<PackageGraphⳇPackage, "precedence_group" | "precedence_subgroup" | "precedence_pkg">>,
): NonNullable<Score> {
	return [pkg.precedence_group, pkg.precedence_subgroup, pkg.precedence_pkg]
}

// lower comes first
export function getꓽlayer_score(
	pkg: Immutable<Pick<PackageGraphⳇPackage, "precedence_group" | "precedence_subgroup" | "precedence_pkg" | "layer">>,
): NonNullable<Score> {
	return [...getꓽprecedence_score(pkg), pkg.layer]
}

// "simplest" first, then public first, then path
// also used to pick the package forced into a layer in case of dep cycle
export function compareꓽpackagesⵧtie_breaks(
	a: Immutable<PackageGraphⳇPackageⵧwithout_layer>,
	b: Immutable<PackageGraphⳇPackageⵧwithout_layer>,
): number {
	return (
		compareꓽscores(_getꓽtie_breaks_score(a), _getꓽtie_breaks_score(b)) ||
		compareꓽstringsⵧfast_good_enough(_getꓽpathⵧfor_sorting(a), _getꓽpathⵧfor_sorting(b))
	)
}

/////////////////////////////////////////////////

// lower comes first
function _getꓽtie_breaks_score(pkg: Immutable<PackageGraphⳇPackageⵧwithout_layer>): NonNullable<Score> {
	return [pkg.sibling_deps_count, pkg.monorepo_deps_count, pkg.isꓽpublic ? 0 : 1]
}

// phantoms have no path: placed first among exact ties = "fix the missing first"
function _getꓽpathⵧfor_sorting(pkg: Immutable<PackageGraphⳇPackageⵧwithout_layer>): string {
	return pkg.isꓽphantom ? "" : pkg.path‿rel
}

/////////////////////////////////////////////////

import type { Immutable } from "@monorepo-private/ts--types"
import { compareꓽscores, compareꓽstringsⵧfast_good_enough, type Score } from "@monorepo-private/utils--sort"

import type { PackageGraphⳇPackage, PackageGraphⳇPackageⵧwithout_layer } from "./types.ts"
