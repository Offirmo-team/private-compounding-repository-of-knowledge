/////////////////////////////////////////////////

// 1 package per core: its checks are separate processes (tsc, vitest…)
const CONCURRENCY = availableParallelism()

/////////////////////////////////////////////////

// see notes.md
export async function resurrect(
	monorepo_root?: PathⳇAny,
	{
		from, // ex. "1.2" = active checks starting with group 1 subgroup 2
		all = false, // true = never stop the active checks, whatever the issues
	}: { from?: string; all?: boolean } = {},
): Promise<Array<PackageWithIssues>> {
	console.log(styleText(["bold", "italic"], "------------ @infinite-monorepo resurrect ------------"))

	const monorepo_root‿abs: PathⳇAbsolute = nodeꓽpath.resolve(process.cwd(), monorepo_root ?? ".")
	const fromⵧparsed = from === undefined ? [] : parseꓽfrom(from)
	const graph = await _ↆloadꓽgraph(monorepo_root‿abs)

	const isꓽblocking = (pkg: Immutable<PackageGraphⳇPackage>) => !isꓽin_incubator(pkg)
	const zones = getꓽzones(sortꓽpackages(graph.packages))
	const widths = getꓽzone_header_widths(zones)
	const packages_with_issues = await ೱexploreꓽzones(zones, {
		ೱgetꓽissues: (pkg) => _ೱgetꓽissues(pkg, monorepo_root‿abs),
		getꓽissuesⵧknown: _getꓽissuesⵧgraph,
		isꓽskipped: (pkg) => isꓽbefore(pkg, fromⵧparsed),
		isꓽblocking,
		isꓽexhaustive: all,
		onꓽpackage_checked: (pkg, issues, isꓽactive) =>
			process.stdout.write(formatꓽdot(issues.length, { isꓽactive, isꓽblocking: isꓽblocking(pkg) })),
		onꓽzone_start: (zone, zoneⵧprevious) => process.stdout.write(formatꓽzone_header(zone, zoneⵧprevious, widths)),
		concurrency: CONCURRENCY,
	})
	process.stdout.write("\n\n")
	console.log(formatꓽreport(packages_with_issues))

	return packages_with_issues
}

export type * from "./types.ts"

/////////////////////////////////////////////////

async function _ↆloadꓽgraph(monorepo_root‿abs: PathⳇAbsolute): Promise<PackageGraph> {
	const graph‿abs = nodeꓽpath.normalize(manifestꓽgraphᐧjson5.path‿ar.replace(PATHVARⵧROOTⵧMONOREPO, monorepo_root‿abs))
	const graph = (await ↆloadꓽfileⵧjson5(graph‿abs)) as unknown as Partial<PackageGraph>

	const isꓽup_to_date =
		Array.isArray(graph.packages) &&
		graph.packages.every((p) => typeof p.isꓽphantom === "boolean" && typeof p.layer === "number")
	if (!isꓽup_to_date) throw new Error(`Outdated graph, please re-run the "apply" operation! (${graph‿abs})`)

	return graph as PackageGraph
}

async function _ೱgetꓽissues(
	pkg: Immutable<PackageGraphⳇPackage>,
	monorepo_root‿abs: PathⳇAbsolute,
): Promise<Array<ResurrectionIssue>> {
	const issuesⵧgraph = _getꓽissuesⵧgraph(pkg)
	if (pkg.isꓽphantom) return issuesⵧgraph // no folder = nothing to run

	const pkg‿abs: PathⳇAbsolute = nodeꓽpath.join(monorepo_root‿abs, pkg.path‿rel)
	const packageᐧjson = (await ↆloadꓽfileⵧjson5(nodeꓽpath.join(pkg‿abs, "package.json"))) as {
		scripts?: Record<string, string>
	}
	const issuesⵧscripts = await getꓽscripts_to_run(packageᐧjson.scripts).reduce<
		Promise<Array<ResurrectionIssueⵧscript>>
	>(async (ↆacc, script) => [...(await ↆacc), ...(await _ೱrunꓽscript(script, pkg‿abs))], Promise.resolve([]))

	return [...issuesⵧgraph, ...issuesⵧscripts]
}

function _getꓽissuesⵧgraph(pkg: Immutable<PackageGraphⳇPackage>): Array<ResurrectionIssueⵧgraph> {
	return (pkg.issues ?? []).map((issue) => ({ source: "graph", issue }))
}

// 0 or 1 issue
async function _ೱrunꓽscript(script: string, pkg‿abs: PathⳇAbsolute): Promise<Array<ResurrectionIssueⵧscript>> {
	try {
		await ೱspawnCorrectlyAndResolvesWithStdout({
			spawnCommand: "pnpm",
			spawnArgs: ["run", script],
			spawnOptions: { cwd: pkg‿abs },
		})
		return []
	} catch {
		return [{ source: "script", script }]
	}
}

/////////////////////////////////////////////////

import { availableParallelism } from "node:os"
import nodeꓽpath from "node:path"
import process from "node:process"
import { styleText } from "node:util"

import {
	manifestꓽgraphᐧjson5,
	type PackageGraph,
	type PackageGraphⳇPackage,
	sortꓽpackages,
} from "@infinite-monorepo/plugin--graph"
import { PATHVARⵧROOTⵧMONOREPO } from "@infinite-monorepo/types-for-plugins"

import { assert } from "@monorepo-private/assert"
import { ↆloadꓽfileⵧjson5 } from "@monorepo-private/read-write-any-structured-file/read"
import { ೱspawnCorrectlyAndResolvesWithStdout } from "@monorepo-private/spawn-correctly"
import type { Immutable, PathⳇAbsolute, PathⳇAny } from "@monorepo-private/ts--types"

import { ೱexploreꓽzones } from "./explore.ts"
import {
	formatꓽdot,
	formatꓽreport,
	formatꓽzone_header,
	getꓽscripts_to_run,
	getꓽzone_header_widths,
	getꓽzones,
	isꓽbefore,
	isꓽin_incubator,
	parseꓽfrom,
} from "./selectors.ts"
import type {
	PackageWithIssues,
	ResurrectionIssue,
	ResurrectionIssueⵧgraph,
	ResurrectionIssueⵧscript,
} from "./types.ts"
