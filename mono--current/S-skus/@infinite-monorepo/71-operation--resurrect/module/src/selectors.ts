/////////////////////////////////////////////////

const SCRIPTS_TO_RUN__PREFIX = "check:"

const INCUBATOR__FOLDER = "X-incubator"

/////////////////////////////////////////////////

// = consecutive packages of the same zone
export function getꓽzones(packagesⵧsorted: Immutable<Array<PackageGraphⳇPackage>>): Array<Zone> {
	return packagesⵧsorted.reduce<Array<Zone>>((zones, pkg) => {
		const zoneⵧlast = zones.at(-1)
		if (!zoneⵧlast || getꓽzone_id(zoneⵧlast[0]!) !== getꓽzone_id(pkg)) return [...zones, [pkg]]

		return [...zones.slice(0, -1), [...zoneⵧlast, pkg]]
	}, [])
}

// = group + subgroup, ex. "1.1" (a SKU = a subgroup of S-skus/, see plugin--graph)
export function getꓽzone_id(pkg: Immutable<PackageGraphⳇPackage>): string {
	return [pkg.precedence_group, pkg.precedence_subgroup].join(".")
}

// printed when entering a zone: the group name if it changed, then the subgroup name + path, followed by the dots
// the subgroup names right-aligned, the ids left-aligned = all the dots aligned
export function formatꓽzone_header(
	zone: Immutable<Zone>,
	zoneⵧprevious: Immutable<Zone> | undefined,
	widths: Immutable<ZoneHeaderWidths>,
): string {
	const pkg = zone[0]!
	const isꓽnew_group = zoneⵧprevious?.[0]!.precedence_group !== pkg.precedence_group

	return [
		"", // ends the current line of dots
		...(isꓽnew_group ? [styleText("bold", _getꓽfolder_names(zone).group)] : []),
		`  ${styleText("cyan", _getꓽzone_name(zone).padStart(widths.name))} ${styleText("gray", getꓽzone_id(pkg).padEnd(widths.id))} `,
	].join("\n")
}

export interface ZoneHeaderWidths {
	name: number
	id: number
}

export function getꓽzone_header_widths(zones: Immutable<Array<Zone>>): ZoneHeaderWidths {
	return {
		name: Math.max(0, ...zones.map((zone) => _getꓽzone_name(zone).length)),
		id: Math.max(0, ...zones.map((zone) => getꓽzone_id(zone[0]!).length)),
	}
}

export function isꓽin_incubator(pkg: Immutable<PackageGraphⳇPackage>): boolean {
	return !pkg.isꓽphantom && pkg.path‿rel.split("/").includes(INCUBATOR__FOLDER)
}

// ex. "1.2" → [1, 2] = from group 1 subgroup 2 (included). "1" → [1] = from group 1
export function parseꓽfrom(from: string): Array<number> {
	const numbers = from.split(".").map(Number)
	assert(
		numbers.length <= 2 && numbers.every(Number.isInteger),
		`--from: expected "<group>" or "<group>.<subgroup>", ex. "1.2", got "${from}"!`,
	)

	return numbers
}

export function isꓽbefore(pkg: Immutable<PackageGraphⳇPackage>, from: ReadonlyArray<number>): boolean {
	if (from.length === 0) return false // = no --from

	return compareꓽscores([pkg.precedence_group, pkg.precedence_subgroup].slice(0, from.length), [...from]) < 0
}

// green = OK, red = issues (blocking, or known = from the graph), yellow = non-blocking issues, gray = not checked
export function formatꓽdot(
	issues__count: number,
	{ isꓽactive, isꓽblocking }: { isꓽactive: boolean; isꓽblocking: boolean },
): string {
	if (issues__count === 0) return styleText(isꓽactive ? "green" : "gray", "●")

	return styleText(!isꓽactive || isꓽblocking ? "red" : "yellow", "●")
}

// NOT "test": already covered by "check:unit-tests" (= "run-s test")
export function getꓽscripts_to_run(scripts: Immutable<Record<string, string>> | undefined): Array<string> {
	return Object.keys(scripts ?? {})
		.filter((name) => name.startsWith(SCRIPTS_TO_RUN__PREFIX))
		.toSorted(compareꓽstringsⵧfast_good_enough)
}

export function formatꓽreport(packages_with_issues: Immutable<Array<PackageWithIssues>>): string {
	if (packages_with_issues.length === 0) return styleText("green", "✔ nothing to fix, all packages OK!")

	return [
		styleText(
			[packages_with_issues.some(({ isꓽblocking }) => isꓽblocking) ? "red" : "yellow", "bold"],
			"✖ next package(s) to fix, in this order:",
		),
		...packages_with_issues.map(({ pkg, issues, isꓽblocking }, index) =>
			[`${index + 1}. ${_formatꓽpackage(pkg, isꓽblocking)}`, ...issues.map(_formatꓽissue)].join("\n"),
		),
	].join("\n\n")
}

/////////////////////////////////////////////////

function _getꓽzone_name(zone: Immutable<Zone>): string {
	return _getꓽfolder_names(zone).subgroup ?? "(no subgroup)"
}

// from the 1st real package of the zone, ex. "1-isomorphic/1-libs--simple/foo/" → "1-isomorphic/" + "1-libs--simple/"
function _getꓽfolder_names(zone: Immutable<Zone>): { group: string; subgroup: string | undefined } {
	const pkg = zone.find((p) => !p.isꓽphantom)
	if (!pkg || pkg.isꓽphantom) return { group: "?", subgroup: undefined } // only phantoms

	const [group, subgroup, ...rest] = pkg.path‿rel.split("/").filter((segment) => segment !== "")
	const isꓽin_subgroup = rest.length > 0 // otherwise = the package folder

	return { group: `${group}/`, subgroup: isꓽin_subgroup ? `${subgroup}/` : undefined }
}

function _formatꓽpackage(pkg: Immutable<PackageGraphⳇPackage>, isꓽblocking: boolean): string {
	const location = pkg.isꓽphantom ? "(phantom = missing from the packages list)" : pkg.path‿rel
	const remark = isꓽblocking ? "" : ` ${styleText("yellow", "(not blocking)")}`

	return `${styleText("bold", pkg.fqname)} ${styleText("gray", `${location} [${getꓽlayer_score(pkg).join(".")}]`)}${remark}`
}

function _formatꓽissue(issue: Immutable<ResurrectionIssue>): string {
	switch (issue.source) {
		case "graph":
			return `   - [graph] ${styleText("yellow", issue.issue.type)}: ${issue.issue.message}`
		case "script":
			return `   - [${styleText("yellow", issue.script)}] failed`
		default:
			assertⵧnever_reached({ issue }, { discriminant: "source" })
	}
}

/////////////////////////////////////////////////

import { styleText } from "node:util"

import { getꓽlayer_score, type PackageGraphⳇPackage } from "@infinite-monorepo/plugin--graph"

import { assert, assertⵧnever_reached } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import { compareꓽscores, compareꓽstringsⵧfast_good_enough } from "@monorepo-private/utils--sort"

import type { PackageWithIssues, ResurrectionIssue, Zone } from "./types.ts"
