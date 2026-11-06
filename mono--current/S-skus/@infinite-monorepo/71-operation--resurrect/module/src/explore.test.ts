/////////////////////////////////////////////////

describe("@infinite-monorepo/operation--resurrect -- explore", () => {
	describe("ೱexploreꓽzones()", () => {
		it("should go through all the zones when no issues", async () => {
			const { packages_with_issues, checked } = await _explore([["a/", "b/"], ["c/"]])

			expect(packages_with_issues).toEqual([])
			expect(checked).toEqual(["a/", "b/", "c/"])
		})

		it("should finish the current zone then stop the active checks, when a package has issues", async () => {
			const { packages_with_issues, checked, passive } = await _explore([["a/", "b/", "c/"], ["d/"]], {
				paths_with_issues: ["a/"],
			})

			expect(packages_with_issues).toEqual([
				{ pkg: expect.objectContaining({ path‿rel: "a/" }), issues: [ISSUE], isꓽblocking: true },
			])
			expect(checked).toEqual(["a/", "b/", "c/"])
			expect(passive).toEqual(["d/"]) // still displayed
		})

		it(`should stop the active checks as soon as ${PACKAGES_WITH_ISSUES__MAX} packages have issues`, async () => {
			const zone: Array<DirPathⳇRelative> = ["a/", "b/", "c/", "d/", "e/", "f/", "g/"]

			const { packages_with_issues, checked, passive } = await _explore([zone], { paths_with_issues: zone })

			expect(packages_with_issues).toHaveLength(PACKAGES_WITH_ISSUES__MAX)
			expect(checked).toEqual(zone.slice(0, PACKAGES_WITH_ISSUES__MAX))
			expect(passive).toEqual(["f/", "g/"])
		})

		it("should never stop the active checks when exhaustive (--all)", async () => {
			const zones: Array<Array<DirPathⳇRelative>> = [["a/", "b/", "c/", "d/", "e/", "f/", "g/"], ["h/"]]

			const { packages_with_issues, checked, passive } = await _explore(zones, {
				paths_with_issues: zones.flat(),
				isꓽexhaustive: true,
			})

			expect(packages_with_issues.map(({ pkg }) => _getꓽpath(pkg))).toEqual(zones.flat())
			expect(checked).toEqual(zones.flat())
			expect(passive).toEqual([])
		})

		it("should only display the skipped packages (ex. --from), with their known issues, NOT reporting them", async () => {
			const { packages_with_issues, checked, passive } = await _explore([["a/", "b/"], ["c/"]], {
				isꓽskipped: (pkg) => _getꓽpath(pkg) !== "c/",
				getꓽissuesⵧknown: (pkg) => (_getꓽpath(pkg) === "a/" ? [ISSUE] : []),
			})

			expect(packages_with_issues).toEqual([])
			expect(checked).toEqual(["c/"])
			expect(passive).toEqual(["a/", "b/"])
		})

		it("should report the non-blocking packages, but NOT stop on them nor count them", async () => {
			const zone: Array<DirPathⳇRelative> = ["nb1/", "nb2/", "nb3/", "nb4/", "nb5/", "nb6/"]

			const { packages_with_issues, checked } = await _explore([zone, ["a/"]], {
				paths_with_issues: [...zone, "a/"],
				isꓽblocking: (pkg) => !_getꓽpath(pkg).startsWith("nb"),
			})

			expect(packages_with_issues.map(({ pkg }) => _getꓽpath(pkg))).toEqual([...zone, "a/"])
			expect(checked).toEqual([...zone, "a/"])
		})

		it("should check up to `concurrency` packages at the same time", async () => {
			const running = { current: 0, max: 0 }

			await _explore([["a/", "b/", "c/", "d/", "e/"]], {
				concurrency: 2,
				ೱgetꓽissues: async () => {
					running.current++
					running.max = Math.max(running.max, running.current)
					await wait(5)
					running.current--
					return []
				},
			})

			expect(running.max).toBe(2)
		})

		it("should report in resurrection order, whatever the completion order", async () => {
			const delay_ms_by_path: Record<string, number> = { "a/": 20, "b/": 0, "c/": 10 }

			const { packages_with_issues } = await _explore([["a/", "b/", "c/"]], {
				concurrency: 3,
				ೱgetꓽissues: async (pkg) => {
					await wait(delay_ms_by_path[_getꓽpath(pkg)]!)
					return [ISSUE]
				},
			})

			expect(packages_with_issues.map(({ pkg }) => _getꓽpath(pkg))).toEqual(["a/", "b/", "c/"])
		})
	})
})

/////////////////////////////////////////////////

const ISSUE: ResurrectionIssue = {
	source: "script",
	script: "check:ts",
	log‿abs: "/a/.monorepo/resurrect--check--ts.log",
}

// zones of paths. Returns what was actively checked / passively displayed, in order
async function _explore(
	zones: Array<Array<DirPathⳇRelative>>,
	{
		paths_with_issues = [],
		concurrency = 1,
		ೱgetꓽissues = async (pkg) => (paths_with_issues.includes(_getꓽpath(pkg)) ? [ISSUE] : []),
		isꓽblocking = () => true,
		isꓽexhaustive = false,
		isꓽskipped = () => false,
		getꓽissuesⵧknown = () => [],
	}: Partial<{
		paths_with_issues: Array<string>
		concurrency: number
		ೱgetꓽissues: ExploreOptions["ೱgetꓽissues"]
		isꓽblocking: ExploreOptions["isꓽblocking"]
		isꓽexhaustive: boolean
		isꓽskipped: ExploreOptions["isꓽskipped"]
		getꓽissuesⵧknown: ExploreOptions["getꓽissuesⵧknown"]
	}> = {},
) {
	const ೱgetꓽissuesⵧspied = vi.fn(ೱgetꓽissues)
	const onꓽpackage_checked = vi.fn<ExploreOptions["onꓽpackage_checked"]>()

	const packages_with_issues = await ೱexploreꓽzones(
		zones.map((zone) => zone.map(_createꓽpackage)),
		{
			ೱgetꓽissues: ೱgetꓽissuesⵧspied,
			getꓽissuesⵧknown,
			isꓽskipped,
			isꓽblocking,
			isꓽexhaustive,
			onꓽpackage_checked,
			onꓽzone_start: () => {},
			concurrency,
		},
	)

	return {
		packages_with_issues,
		checked: ೱgetꓽissuesⵧspied.mock.calls.map(([pkg]) => _getꓽpath(pkg)),
		passive: onꓽpackage_checked.mock.calls.filter(([, , isꓽactive]) => !isꓽactive).map(([pkg]) => _getꓽpath(pkg)),
	}
}

function _getꓽpath(pkg: Immutable<PackageGraphⳇPackage>): string {
	return pkg.isꓽphantom ? "(phantom)" : pkg.path‿rel
}

function _createꓽpackage(path‿rel: DirPathⳇRelative): PackageGraphⳇPackageⵧreal {
	return {
		isꓽphantom: false,
		fqname: `@test/${path‿rel}`,
		path‿rel,
		precedence_group: 5,
		precedence_subgroup: 5,
		precedence_pkg: 5,
		sibling_deps_count: 5,
		monorepo_deps_count: 5,
		layer: 5,
		isꓽpublic: false,
	}
}

/////////////////////////////////////////////////

import { setTimeout as wait } from "node:timers/promises"

import type { PackageGraphⳇPackage, PackageGraphⳇPackageⵧreal } from "@infinite-monorepo/plugin--graph"
import { describe, it, expect, vi } from "vitest"

import type { DirPathⳇRelative, Immutable } from "@monorepo-private/ts--types"

import { type ExploreOptions, PACKAGES_WITH_ISSUES__MAX, ೱexploreꓽzones } from "./explore.ts"
import type { ResurrectionIssue } from "./types.ts"
