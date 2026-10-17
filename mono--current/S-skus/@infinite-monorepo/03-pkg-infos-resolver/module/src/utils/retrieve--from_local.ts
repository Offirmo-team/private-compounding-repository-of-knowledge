/////////////////////////////////////////////////
// XXX written by Claude Code XXX
// Retrieve package.json files from the local pnpm lockfile + virtual store
// = faster + avoid network, useful for test runs
// ONLY support my current pnpm config
// OPTIONAL, can be dropped
const LIB = "PkgVersionResolver/FromLocal"

// only the subset we use https://github.com/pnpm/spec/blob/master/lockfile/9.0.md
export interface PnpmLockfile {
	catalogs?: Record<string, Record<PkgFQName, { specifier: string; version: string }>>
	packages?: Record<string, object> // key = "<name>@<version>"
}

interface LocalPnpm {
	lockfile: PnpmLockfile
	virtual_store_dir‿abs: string
	virtual_store_entries: ReadonlyArray<string>
}

/////////////////////////////////////////////////

// undefined = not available locally, caller should fall back to npm
export async function ↆgetꓽpackageᐧjsonⵧfrom_local_pnpm(
	pkg_name: PkgFQName,
	version_range: SemVerⳇRange | undefined,
	from‿abs: string = process.cwd(),
): Promise<PackageJson | undefined> {
	const local_pnpm = await _ↆloadꓽlocal_pnpm(from‿abs)
	if (!local_pnpm) return undefined

	const version = pickꓽversionⵧlocked(local_pnpm.lockfile, pkg_name, version_range)
	if (!version) return undefined

	const virtual_store_entry = findꓽvirtual_store_entry(local_pnpm.virtual_store_entries, pkg_name, version)
	if (!virtual_store_entry) return undefined

	const packageᐧjson__path‿abs = path.join(
		local_pnpm.virtual_store_dir‿abs,
		virtual_store_entry,
		"node_modules",
		pkg_name,
		"package.json",
	)
	try {
		return JSON.parse(await fs.readFile(packageᐧjson__path‿abs, "utf8")) as PackageJson
	} catch {
		return undefined
	}
}

// catalog version first (= what the monorepo actually uses), else the highest locked version
export function pickꓽversionⵧlocked(
	lockfile: Immutable<PnpmLockfile>,
	pkg_name: PkgFQName,
	version_range: SemVerⳇRange | undefined,
): SemVerⳇExact | undefined {
	const range = version_range ?? "*"

	const versionⵧcatalog = _stripꓽpeers_suffix(lockfile.catalogs?.["default"]?.[pkg_name]?.version ?? "")
	if (semver.valid(versionⵧcatalog) && semver.satisfies(versionⵧcatalog, range)) return versionⵧcatalog

	const versionsⵧlocked = Object.keys(lockfile.packages ?? {})
		.map(_parseꓽpackage_key)
		.filter((parsed) => parsed?.name === pkg_name)
		.map((parsed) => parsed!.version)
		.filter((version) => semver.valid(version))

	return semver.maxSatisfying(versionsⵧlocked, range) ?? undefined
}

// mirrors pnpm's depPathToFilename(): "/" -> "+", peers appended after "_"
// (very long names get hashed by pnpm, those won't be found = fall back to npm)
export function findꓽvirtual_store_entry(
	entries: ReadonlyArray<string>,
	pkg_name: PkgFQName,
	version: SemVerⳇExact,
): string | undefined {
	const prefix = `${pkg_name.replace("/", "+")}@${version}`
	return entries.find((entry) => entry === prefix || entry.startsWith(`${prefix}_`))
}

/////////////////////////////////////////////////

const _ↆlocal_pnpm_by_start_dir = new Map<string, Promise<LocalPnpm | undefined>>()
function _ↆloadꓽlocal_pnpm(from‿abs: string): Promise<LocalPnpm | undefined> {
	if (!_ↆlocal_pnpm_by_start_dir.has(from‿abs)) {
		_ↆlocal_pnpm_by_start_dir.set(from‿abs, _ↆloadꓽlocal_pnpmⵧuncached(from‿abs))
	}
	return _ↆlocal_pnpm_by_start_dir.get(from‿abs)!
}

async function _ↆloadꓽlocal_pnpmⵧuncached(from‿abs: string): Promise<LocalPnpm | undefined> {
	const lockfile__path‿abs = await _ↆfind_upꓽfile("pnpm-lock.yaml", from‿abs)
	if (!lockfile__path‿abs) {
		console.warn(`No pnpm-lock.yaml found above "${from‿abs}", will use npm.`)
		return undefined
	}

	// default location, we don't support a custom virtualStoreDir
	const virtual_store_dir‿abs = path.join(path.dirname(lockfile__path‿abs), "node_modules", ".pnpm")
	const [lockfile, virtual_store_entries] = await Promise.all([
		// lazy = the npm-only mode doesn't need this dep
		Promise.all([fs.readFile(lockfile__path‿abs, "utf8"), import("yaml")]).then(
			([content, YAML]) => YAML.parse(content) as PnpmLockfile,
		),
		fs.readdir(virtual_store_dir‿abs).catch(() => []),
	])
	console.log(
		`Using local pnpm data: "${lockfile__path‿abs}" + ${virtual_store_entries.length} entries in the virtual store`,
	)

	return { lockfile, virtual_store_dir‿abs, virtual_store_entries }
}

async function _ↆfind_upꓽfile(file_name: string, from‿abs: string): Promise<string | undefined> {
	const candidate‿abs = path.join(from‿abs, file_name)
	const exists = await fs.access(candidate‿abs).then(
		() => true,
		() => false,
	)
	if (exists) return candidate‿abs

	const parent‿abs = path.dirname(from‿abs)
	if (parent‿abs === from‿abs) return undefined

	return _ↆfind_upꓽfile(file_name, parent‿abs)
}

// "@types/node@24.1.0" -> { name: "@types/node", version: "24.1.0" }
function _parseꓽpackage_key(key: string): { name: PkgFQName; version: string } | undefined {
	const separator_index = key.indexOf("@", 1) // skip the scope's leading "@"
	if (separator_index < 0) return undefined

	return {
		name: key.slice(0, separator_index),
		version: _stripꓽpeers_suffix(key.slice(separator_index + 1)),
	}
}

// "2.16.4(@parcel/core@2.16.4)" -> "2.16.4"
function _stripꓽpeers_suffix(version: string): string {
	return version.replace(/\(.*$/, "")
}

/////////////////////////////////////////////////

import * as fs from "node:fs/promises"
import * as path from "node:path"

import * as semver from "semver"

import { assert } from "@monorepo-private/assert"
import type { Immutable, SemVerⳇExact, SemVerⳇRange } from "@monorepo-private/ts--types"

import type { PackageJson, PkgFQName } from "../state/types.ts"
