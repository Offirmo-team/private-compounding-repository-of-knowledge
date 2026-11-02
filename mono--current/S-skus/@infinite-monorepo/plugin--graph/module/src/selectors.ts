/////////////////////////////////////////////////

const SKUS__DIRNAME = "S-skus"

// also used for any non-numbered top folder
export const PRECEDENCE_GROUPⵧSKU = 99

export const PRECEDENCE_SUBGROUPⵧDEFAULT = 99

export const PRECEDENCE_PKGⵧDEFAULT = 999

/////////////////////////////////////////////////

export type IsꓽMonorepoPackage = (fqname: PkgFQName) => boolean

// = what can be derived from a package alone, without knowing the other packages
export type PackageGraphⳇPackageⵧisolated = Omit<PackageGraphⳇPackageⵧreal, "sibling_deps_count" | "issues" | "layer">

export type PackageGraphⳇPackageⵧphantomⵧwithout_layer = Omit<PackageGraphⳇPackageⵧphantom, "layer">

// phantoms included = valid targets (ex. for counting) but flagged as missing
export type DepTarget = PackageGraphⳇPackageⵧisolated | PackageGraphⳇPackageⵧphantomⵧwithout_layer
export type DepTargetsByFqname = ReadonlyMap<PkgFQName, Immutable<DepTarget>>

export type ReachableByFqname = ReadonlyMap<PkgFQName, ReadonlySet<PkgFQName>>

export function deriveꓽpackages(
	nodesⵧpackage: Immutable<Array<NodeⳇPackage>>,
	monorepo_root‿abs: DirPathⳇAbsolute,
	isꓽmonorepo_package: IsꓽMonorepoPackage,
): Array<PackageGraphⳇPackage> {
	const packagesⵧisolatedⵧraw = nodesⵧpackage.map((node) =>
		deriveꓽpackage(node, monorepo_root‿abs, isꓽmonorepo_package),
	)
	const subgroup_by_sku = deriveꓽsubgroup_by_sku(packagesⵧisolatedⵧraw)
	const packagesⵧisolated = packagesⵧisolatedⵧraw.map((p) =>
		p.sku === undefined ? p : { ...p, precedence_subgroup: subgroup_by_sku.get(p.sku)! },
	)
	const phantoms = deriveꓽphantoms(packagesⵧisolated)
	const targets_by_fqname: DepTargetsByFqname = new Map([...packagesⵧisolated, ...phantoms].map((p) => [p.fqname, p]))
	const reachable_by_fqname = deriveꓽreachable_by_fqname(packagesⵧisolated)

	const packagesⵧreal = packagesⵧisolated
		.map((p): Omit<PackageGraphⳇPackageⵧreal, "layer"> => {
			const issues = deriveꓽissues(p, targets_by_fqname, reachable_by_fqname)

			return {
				...p,
				sibling_deps_count: deriveꓽsibling_deps_count(p, targets_by_fqname),
				...(issues.length > 0 && { issues }),
			}
		})
		.toSorted((a, b) => compareꓽstringsⵧfast_good_enough(a.path‿rel, b.path‿rel))

	const packagesⵧwithout_layer: Array<PackageGraphⳇPackageⵧwithout_layer> = [...phantoms, ...packagesⵧreal]
	const layer_by_fqname = deriveꓽlayer_by_fqname(packagesⵧwithout_layer)

	return packagesⵧwithout_layer.map((p): PackageGraphⳇPackage => ({ ...p, layer: layer_by_fqname.get(p.fqname)! }))
}

// the SKUs are subgroups of their group (S-skus/@foo/ = at the subgroup level), ordered by their deps on each other:
// a SKU depending on another one comes after it, then by name (no number in their folder names)
// cycle = the first remaining one by name is placed anyway (the deps against the order are reported as precedence_violation)
export function deriveꓽsubgroup_by_sku(
	packages: Immutable<Array<PackageGraphⳇPackageⵧisolated>>,
): ReadonlyMap<string, number> {
	const sku_by_fqname = new Map(packages.flatMap((p) => (p.sku === undefined ? [] : [[p.fqname, p.sku] as const])))
	const skus = [...new Set(sku_by_fqname.values())].toSorted(compareꓽstringsⵧfast_good_enough)
	const deps_by_sku = new Map(
		skus.map((sku) => [
			sku,
			[
				...new Set(
					packages
						.filter((p) => p.sku === sku)
						.flatMap(_getꓽmonorepo_deps)
						.flatMap((dep) => {
							const skuⵧdep = sku_by_fqname.get(dep)
							return skuⵧdep === undefined || skuⵧdep === sku ? [] : [skuⵧdep]
						}),
				),
			],
		]),
	)

	return new Map(
		_deriveꓽlayers(skus, new Set(), deps_by_sku)
			.flat()
			.map((sku, index) => [sku, index]),
	)
}

// layer = within its precedence chunk, the round of Kahn's algorithm at which the package is ready (= its deps placed)
// only deps within the chunk matter: the other ones are either in earlier chunks or reported as issues
// cycle = no package ready = the first remaining one by tie-breaks is forced into a layer of its own
export function deriveꓽlayer_by_fqname(
	packages: Immutable<Array<PackageGraphⳇPackageⵧwithout_layer>>,
): ReadonlyMap<PkgFQName, number> {
	const chunks = Map.groupBy(packages, (p) => getꓽprecedence_score(p).join("."))

	return new Map(
		[...chunks.values()].flatMap((chunk) =>
			_deriveꓽlayersⵧof_chunk(chunk).flatMap((layer, index) => layer.map((fqname) => [fqname, index] as const)),
		),
	)
}

// = monorepo deps missing from the packages list
// sorted by fqname
export function deriveꓽphantoms(
	packages: Immutable<Array<PackageGraphⳇPackageⵧisolated>>,
): Array<PackageGraphⳇPackageⵧphantomⵧwithout_layer> {
	const listed = new Set(packages.map((p) => p.fqname))
	const missing_deps_with_dependent = packages.flatMap((p) =>
		_getꓽmonorepo_deps(p)
			.filter((dep) => !listed.has(dep))
			.map((dep) => ({ dep, dependent: p })),
	)
	const missing_deps = [...new Set(missing_deps_with_dependent.map(({ dep }) => dep))].toSorted(
		compareꓽstringsⵧfast_good_enough,
	)

	return missing_deps.map((fqname): PackageGraphⳇPackageⵧphantomⵧwithout_layer => {
		const dependents = missing_deps_with_dependent
			.filter(({ dep }) => dep === fqname)
			.map(({ dependent }) => dependent)
		const dependentⵧearliest = dependents.toSorted((a, b) =>
			compareꓽscores(getꓽprecedence_score(a), getꓽprecedence_score(b)),
		)[0]!
		const dependents_fqnames = dependents.map((p) => p.fqname).toSorted(compareꓽstringsⵧfast_good_enough)

		return {
			isꓽphantom: true,
			fqname,
			precedence_group: dependentⵧearliest.precedence_group,
			precedence_subgroup: dependentⵧearliest.precedence_subgroup,
			precedence_pkg: dependentⵧearliest.precedence_pkg,
			sibling_deps_count: 0,
			monorepo_deps_count: 0,
			isꓽpublic: false,
			issues: [
				{
					type: "missing_package",
					dependents: dependents_fqnames,
					message: `missing from the packages list, needed by ${dependents_fqnames.length} package(s)`,
				},
			],
		}
	})
}

export function deriveꓽpackage(
	node: Immutable<NodeⳇPackage>,
	monorepo_root‿abs: DirPathⳇAbsolute,
	isꓽmonorepo_package: IsꓽMonorepoPackage,
): PackageGraphⳇPackageⵧisolated {
	const ǃ = assert_from({ deriveꓽpackage })

	const path‿rel: DirPathⳇRelative = `${path.relative(monorepo_root‿abs, node.path‿abs)}/`
	ǃ.forⵧparam({ node }).require(!path‿rel.startsWith(".."), `Package expected inside the monorepo: ${node.path‿abs}!`)

	const precedence_group = deriveꓽprecedence_group(path‿rel)
	const sku = deriveꓽsku(path‿rel)
	const deps = deriveꓽdeps(node.details, isꓽmonorepo_package)

	return {
		isꓽphantom: false,
		fqname: node.details.fqname,
		path‿rel,
		precedence_group,
		precedence_subgroup: deriveꓽprecedence_subgroup(path‿rel),
		precedence_pkg: deriveꓽprecedence_pkg(path‿rel),
		monorepo_deps_count: deriveꓽmonorepo_deps_count(deps),
		...(sku !== undefined && { sku }),
		isꓽpublic: node.details.isꓽpublished,
		...(deps.length > 0 && { deps }),
	}
}

// ordered by type, then dep
export function deriveꓽissues(
	pkg: Immutable<PackageGraphⳇPackageⵧisolated>,
	targets_by_fqname: DepTargetsByFqname,
	reachable_by_fqname: ReachableByFqname,
): Array<PackageGraphⳇIssueⵧany> {
	const monorepo_deps = _getꓽmonorepo_deps(pkg)

	const issuesⵧmissing_dep = monorepo_deps
		.filter((dep) => targets_by_fqname.get(dep)?.isꓽphantom ?? true)
		.map((dep): PackageGraphⳇIssueⵧmissing_dep => ({
			type: "missing_dep",
			dep,
			message: `depends on "${dep}" = a monorepo package missing from the packages list`,
		}))

	const precedence = getꓽprecedence_score(pkg)
	const issuesⵧprecedence_violation = monorepo_deps.flatMap((dep): Array<PackageGraphⳇIssueⵧprecedence_violation> => {
		const target = targets_by_fqname.get(dep)
		if (!target || target.isꓽphantom) return [] // missing, already reported

		const precedenceⵧtarget = getꓽprecedence_score(target)
		if (compareꓽscores(precedenceⵧtarget, precedence) <= 0) return []

		return [
			{
				type: "precedence_violation",
				dep,
				message: `depends on "${dep}" which comes later in the explicit order (${precedenceⵧtarget.join(".")} > ${precedence.join(".")})`,
			},
		]
	})

	const peers = deriveꓽdep_cycle_peers(pkg.fqname, reachable_by_fqname)
	const issuesⵧdep_cycle: Array<PackageGraphⳇIssueⵧdep_cycle> =
		peers.length === 0
			? []
			: [{ type: "dep_cycle", peers, message: `in a dependency cycle with ${peers.join(", ")}` }]

	return [...issuesⵧmissing_dep, ...issuesⵧprecedence_violation, ...issuesⵧdep_cycle]
}

// = through monorepo deps (missing ones are skipped)
export function deriveꓽreachable_by_fqname(
	packages: Immutable<Array<PackageGraphⳇPackageⵧisolated>>,
): ReachableByFqname {
	const listed = new Set(packages.map((p) => p.fqname))
	const deps_by_fqname: ReachableByFqname = new Map(
		packages.map((p) => [p.fqname, new Set(_getꓽmonorepo_deps(p).filter((dep) => listed.has(dep)))]),
	)

	return new Map(
		packages.map((p) => [p.fqname, _getꓽreachable(deps_by_fqname.get(p.fqname)!, new Set(), deps_by_fqname)]),
	)
}

// = the other members of its dependency cycle(s) = mutually reachable
export function deriveꓽdep_cycle_peers(fqname: PkgFQName, reachable_by_fqname: ReachableByFqname): Array<PkgFQName> {
	const reachable = reachable_by_fqname.get(fqname) ?? new Set()

	return [...reachable]
		.filter((other) => other !== fqname && (reachable_by_fqname.get(other)?.has(fqname) ?? false))
		.toSorted(compareꓽstringsⵧfast_good_enough)
}

// distinct, since the same package can be several dep types, ex. peer + dev
// missing ones = phantoms are counted with their inherited precedence
export function deriveꓽsibling_deps_count(
	pkg: Immutable<PackageGraphⳇPackageⵧisolated>,
	targets_by_fqname: DepTargetsByFqname,
): number {
	return _getꓽmonorepo_deps(pkg)
		.map((dep) => targets_by_fqname.get(dep))
		.filter((target) => target !== undefined)
		.filter(
			(target) =>
				target.precedence_group === pkg.precedence_group && target.precedence_subgroup === pkg.precedence_subgroup,
		).length
}

export function deriveꓽprecedence_group(path‿rel: DirPathⳇRelative): number {
	return _parseꓽleading_number(path‿rel) ?? PRECEDENCE_GROUPⵧSKU
}

export function deriveꓽprecedence_subgroup(path‿rel: DirPathⳇRelative): number {
	const [_group_folder, subgroup_folder, ...rest] = path‿rel.split("/").filter((segment) => segment !== "")
	const isꓽpackage_folder = rest.length === 0
	if (subgroup_folder === undefined || isꓽpackage_folder) return PRECEDENCE_SUBGROUPⵧDEFAULT

	return _parseꓽleading_number(subgroup_folder) ?? PRECEDENCE_SUBGROUPⵧDEFAULT
}

export function deriveꓽprecedence_pkg(path‿rel: DirPathⳇRelative): number {
	return _parseꓽleading_number(path.basename(path‿rel)) ?? PRECEDENCE_PKGⵧDEFAULT
}

export function deriveꓽsku(path‿rel: DirPathⳇRelative): string | undefined {
	const [first_segment, second_segment] = path‿rel.split("/")
	if (first_segment !== SKUS__DIRNAME) return undefined

	return second_segment || undefined
}

// distinct, since the same package can be several dep types, ex. peer + dev
export function deriveꓽmonorepo_deps_count(deps: Immutable<Array<PackageGraphⳇDependency>>): number {
	return new Set(deps.filter((dep) => dep.isꓽmonorepo).map((dep) => dep.fqname)).size
}

// ordered by type, then fqname
export function deriveꓽdeps(
	details: Immutable<PureModuleDetails>,
	isꓽmonorepo_package: IsꓽMonorepoPackage,
): Array<PackageGraphⳇDependency> {
	return PkgDetailsLib.reduceꓽdependency_type<Array<PackageGraphⳇDependency>>(
		details,
		({ acc, type, map }) => [
			...acc,
			...Array.from(map.keys())
				.toSorted(compareꓽstringsⵧfast_good_enough)
				.map((fqname) => ({ fqname, type, isꓽmonorepo: isꓽmonorepo_package(fqname) })),
		],
		[],
	)
}

/////////////////////////////////////////////////

function _deriveꓽlayersⵧof_chunk(chunk: Immutable<Array<PackageGraphⳇPackageⵧwithout_layer>>): Array<Array<PkgFQName>> {
	const fqnames = new Set(chunk.map((p) => p.fqname))
	const deps_in_chunk_by_fqname: ReadonlyMap<PkgFQName, ReadonlyArray<PkgFQName>> = new Map(
		chunk.map((p) => [
			p.fqname,
			(p.isꓽphantom ? [] : _getꓽmonorepo_deps(p)).filter((dep) => dep !== p.fqname && fqnames.has(dep)),
		]),
	)

	return _deriveꓽlayers(
		chunk.toSorted(compareꓽpackagesⵧtie_breaks).map((p) => p.fqname),
		new Set(),
		deps_in_chunk_by_fqname,
	)
}

// Kahn's algorithm, on ids (= fqnames, SKUs…)
// layer = ALL the ids ready at this round (= deps placed), in the input order
function _deriveꓽlayers(
	remaining: ReadonlyArray<string>,
	placed: ReadonlySet<string>,
	deps_by_id: ReadonlyMap<string, ReadonlyArray<string>>,
): Array<Array<string>> {
	if (remaining.length === 0) return []

	const ready = remaining.filter((id) => deps_by_id.get(id)!.every((dep) => placed.has(dep)))
	const layer = ready.length > 0 ? ready : [remaining[0]!] // cycle: place anyway
	const placedⵧnext = placed.union(new Set(layer))

	return [
		layer,
		..._deriveꓽlayers(
			remaining.filter((id) => !placedⵧnext.has(id)),
			placedⵧnext,
			deps_by_id,
		),
	]
}

// distinct, sorted
function _getꓽmonorepo_deps(pkg: Immutable<Pick<PackageGraphⳇPackageⵧreal, "deps">>): Array<PkgFQName> {
	return [...new Set((pkg.deps ?? []).filter((dep) => dep.isꓽmonorepo).map((dep) => dep.fqname))].toSorted(
		compareꓽstringsⵧfast_good_enough,
	)
}

// breadth-first, level by level. Cycle-safe thanks to `visited`
function _getꓽreachable(
	frontier: ReadonlySet<PkgFQName>,
	visited: ReadonlySet<PkgFQName>,
	deps_by_fqname: ReachableByFqname,
): ReadonlySet<PkgFQName> {
	if (frontier.size === 0) return visited

	const visitedⵧnext = visited.union(frontier)
	const frontierⵧnext = new Set([...frontier].flatMap((fqname) => [...(deps_by_fqname.get(fqname) ?? [])])).difference(
		visitedⵧnext,
	)

	return _getꓽreachable(frontierⵧnext, visitedⵧnext, deps_by_fqname)
}

// "12-foo…" → 12
function _parseꓽleading_number(str: string): number | undefined {
	const digits = /^(\d+)-/.exec(str)?.[1]
	if (digits === undefined) return undefined

	return Number(digits)
}

/////////////////////////////////////////////////

import * as path from "node:path"

import * as PkgDetailsLib from "@infinite-monorepo/package-details"
import type { NodeⳇPackage, PkgFQName, PureModuleDetails } from "@infinite-monorepo/types-for-plugins"

import { assert_from, assert } from "@monorepo-private/assert"
import type { DirPathⳇAbsolute, DirPathⳇRelative, Immutable } from "@monorepo-private/ts--types"
import { compareꓽscores, compareꓽstringsⵧfast_good_enough } from "@monorepo-private/utils--sort"

import type {
	PackageGraphⳇDependency,
	PackageGraphⳇIssueⵧany,
	PackageGraphⳇIssueⵧdep_cycle,
	PackageGraphⳇIssueⵧmissing_dep,
	PackageGraphⳇIssueⵧprecedence_violation,
	PackageGraphⳇPackage,
	PackageGraphⳇPackageⵧphantom,
	PackageGraphⳇPackageⵧreal,
	PackageGraphⳇPackageⵧwithout_layer,
} from "./types.ts"
import { compareꓽpackagesⵧtie_breaks, getꓽprecedence_score } from "./utils.ts"
