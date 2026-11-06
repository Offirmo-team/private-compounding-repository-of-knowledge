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
	const graph = (await ↆreadꓽfileⵧjson5(graph‿abs)) as unknown as Partial<PackageGraph>

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
	const packageᐧjson = (await ↆreadꓽfileⵧjson5(nodeꓽpath.join(pkg‿abs, "package.json"))) as {
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
// the log only exists if the last run failed (removed on success = never stale)
async function _ೱrunꓽscript(script: string, pkg‿abs: PathⳇAbsolute): Promise<Array<ResurrectionIssueⵧscript>> {
	const log‿abs: PathⳇAbsolute = nodeꓽpath.join(pkg‿abs, ".monorepo", `resurrect--${script.replaceAll(":", "--")}.log`)
	const started_at‿ms = Date.now()
	const err = await ೱspawnCorrectlyAndResolvesWithStdout({
		spawnCommand: "pnpm",
		spawnArgs: ["run", script],
		spawnOptions: { cwd: pkg‿abs },
	}).then(
		() => undefined,
		(err: SpawnError) => err,
	)

	if (err) {
		await fs.mkdir(nodeꓽpath.dirname(log‿abs), { recursive: true })
		await fs.writeFile(
			log‿abs,
			_formatꓽscript_log(err, {
				pkg‿abs,
				started_at‿ms,
				ended_at‿ms: Date.now(),
				load‿1min: loadavg()[0] ?? NaN,
				cores: availableParallelism(),
			}),
		)
		return [{ source: "script", script, log‿abs }]
	}

	await fs.rm(log‿abs, { force: true })
	return []
}

// load >> cores = overloaded machine = likely timeouts = flaky failure
function _formatꓽscript_log(
	{ commandForLog, code, signal, message, stdout, stderr }: Immutable<SpawnError>,
	{
		pkg‿abs,
		started_at‿ms,
		ended_at‿ms,
		load‿1min,
		cores,
	}: { pkg‿abs: PathⳇAbsolute; started_at‿ms: number; ended_at‿ms: number; load‿1min: number; cores: number },
): string {
	return [
		`$ cd ${pkg‿abs} && ${commandForLog}`,
		`failed at ${new Date(ended_at‿ms).toISOString()} after ${((ended_at‿ms - started_at‿ms) / 1000).toFixed(1)}s, code=${code} signal=${signal}`,
		`load avg (1 min) at failure = ${load‿1min.toFixed(1)} for ${cores} cores`,
		`error: ${message}`,
		"",
		"------- stdout -------",
		stdout,
		"",
		"------- stderr -------",
		stderr,
		"",
	].join("\n")
}

/////////////////////////////////////////////////

import fs from "node:fs/promises"
import { availableParallelism, loadavg } from "node:os"
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
import { ↆreadꓽfileⵧjson5 } from "@monorepo-private/read-write-any-structured-file/read"
import { ೱspawnCorrectlyAndResolvesWithStdout, type SpawnError } from "@monorepo-private/spawn-correctly"
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
