/////////////////////////////////////////////////

export const PACKAGES_WITH_ISSUES__MAX = 5 // blocking ones only

export interface ExploreOptions {
	ೱgetꓽissues: (pkg: Immutable<PackageGraphⳇPackage>) => Promise<Array<ResurrectionIssue>> // active checks
	getꓽissuesⵧknown: (pkg: Immutable<PackageGraphⳇPackage>) => Array<ResurrectionIssue> // = without active checks
	isꓽskipped: (pkg: Immutable<PackageGraphⳇPackage>) => boolean // = passive, ex. before --from
	isꓽblocking: (pkg: Immutable<PackageGraphⳇPackage>) => boolean // false = issues reported, but not stopping the walk
	isꓽexhaustive: boolean // true = never stop the active checks, whatever the issues (--all)
	onꓽpackage_checked: (
		pkg: Immutable<PackageGraphⳇPackage>,
		issues: Immutable<Array<ResurrectionIssue>>,
		isꓽactive: boolean,
	) => void
	onꓽzone_start: (zone: Immutable<Zone>, zoneⵧprevious: Immutable<Zone> | undefined) => void
	concurrency: number // max packages checked at the same time
}

// one zone after the other, actively checked until the end of the 1st zone with blocking issues
// or until there are enough packages to fix (unless exhaustive).
// The remaining packages are still walked, passively (= displayed with their known issues, NOT reported)
export async function ೱexploreꓽzones(
	zones: Immutable<Array<Zone>>,
	options: Immutable<ExploreOptions>,
	zoneⵧprevious?: Immutable<Zone>,
	packages_with_issuesⵧbefore: Array<PackageWithIssues> = [],
): Promise<Array<PackageWithIssues>> {
	const [zone, ...zonesⵧnext] = zones
	if (!zone) return packages_with_issuesⵧbefore

	const isꓽstopped = !options.isꓽexhaustive && packages_with_issuesⵧbefore.some(({ isꓽblocking }) => isꓽblocking)
	options.onꓽzone_start(zone, zoneⵧprevious)
	const packages_with_issues = [...packages_with_issuesⵧbefore, ...(await _ೱexploreꓽzone(zone, isꓽstopped, options))]

	return ೱexploreꓽzones(zonesⵧnext, options, zone, packages_with_issues)
}

/////////////////////////////////////////////////

// in parallel: checking a package doesn't need its deps to be checked first, the order only matters for the report
// started and reported in resurrection order, whatever the completion order
// no active check started once there are enough packages to fix, but the running ones are completed (= may report a few more)
async function _ೱexploreꓽzone(
	zone: Immutable<Zone>,
	isꓽstopped: boolean,
	{
		ೱgetꓽissues,
		getꓽissuesⵧknown,
		isꓽskipped,
		isꓽblocking,
		isꓽexhaustive,
		onꓽpackage_checked,
		concurrency,
	}: Immutable<ExploreOptions>,
): Promise<Array<PackageWithIssues>> {
	// shared by the workers. NOTE: array iterators have no return() = a worker stopping does NOT close it for the others
	const queue = zone.entries()
	const issues_by_index = new Map<number, Array<ResurrectionIssue>>()
	const indexesⵧblocking = new Set<number>()

	async function ೱwork(): Promise<void> {
		for (const [index, pkg] of queue) {
			const isꓽactive =
				!isꓽstopped && (isꓽexhaustive || indexesⵧblocking.size < PACKAGES_WITH_ISSUES__MAX) && !isꓽskipped(pkg)
			if (!isꓽactive) {
				onꓽpackage_checked(pkg, getꓽissuesⵧknown(pkg), false)
				continue
			}

			const issues = await ೱgetꓽissues(pkg)
			onꓽpackage_checked(pkg, issues, true)
			if (issues.length === 0) continue

			issues_by_index.set(index, issues)
			if (isꓽblocking(pkg)) indexesⵧblocking.add(index)
		}
	}
	await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, zone.length)) }, ೱwork))

	return zone.flatMap((pkg, index) => {
		const issues = issues_by_index.get(index)
		return issues ? [{ pkg, issues, isꓽblocking: indexesⵧblocking.has(index) }] : []
	})
}

/////////////////////////////////////////////////

import type { PackageGraphⳇPackage } from "@infinite-monorepo/plugin--graph"

import { assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { PackageWithIssues, ResurrectionIssue, Zone } from "./types.ts"
