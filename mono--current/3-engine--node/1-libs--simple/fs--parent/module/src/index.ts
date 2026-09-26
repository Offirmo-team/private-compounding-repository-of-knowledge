/////////////////////////////////////////////////

export function getꓽparent_packageᐧjson__name(import_meta: ImportMeta): string {
	const pkgPath = getꓽparent_packageᐧjson__path(import_meta)

	const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))

	return pkg.name
}

export function getꓽparent_packageᐧjson__path(import_meta: ImportMeta): PathⳇAbsolute {
	const ǃ = assert_from({ getꓽparent_packageᐧjson__path })

	const pkgPath: PathⳇAbsolute | undefined = findPackageJSON(import_meta.url)
	ǃ.forⵧvalue({ pkgPath }).assert(!!pkgPath, `should find a parent "package.json"`)
	assert(!!pkgPath)

	const dir = nodeꓽpath.dirname(pkgPath)
	assertꓽallowed_result(dir, import_meta.dirname)

	return pkgPath
}

export function getꓽparent_packageᐧjson__dir(import_meta: ImportMeta): PathⳇAbsolute {
	const ǃ = assert_from({ getꓽparent_packageᐧjson__dir })

	const pkgPath = getꓽparent_packageᐧjson__path(import_meta)

	return nodeꓽpath.dirname(pkgPath)
}

export function getꓽparent_git_repo__root(import_meta: ImportMeta): PathⳇAbsolute {
	return _findꓽparent_dir_containing(import_meta.dirname, ".git")
}

export function getꓽparent_pnpm_monorepo__root(import_meta: ImportMeta): PathⳇAbsolute {
	return _findꓽparent_dir_containing(import_meta.dirname, "pnpm-workspace.yaml")
}

/////////////////////////////////////////////////

// walks up from `dir` (included) until the marker is found or the search bounds are crossed
function _findꓽparent_dir_containing(
	dir: PathⳇAbsolute,
	entry__name: string,
	searchᐧstart: PathⳇAbsolute = dir,
): PathⳇAbsolute {
	assertꓽallowed_result(dir, searchᐧstart)

	if (existsSync(nodeꓽpath.join(dir, entry__name))) return dir

	return _findꓽparent_dir_containing(nodeꓽpath.dirname(dir), entry__name, searchᐧstart)
}

// small safety to NOT match:
// - root (e.g. docker container)
// - home or higher
// - to high up the chain relative to the caller
// Private code, can relax if not applicable. No need for unit tests.
function assertꓽallowed_result(candidate: PathⳇAbsolute, searchᐧstart: PathⳇAbsolute): void {
	if (candidate === nodeꓽpath.parse(candidate).root) throw new Error("[fs--parent safety] Not found up to root node!")

	const homeⵧdir = nodeꓽos.homedir()
	if (candidate === homeⵧdir || homeⵧdir.startsWith(candidate + nodeꓽpath.sep))
		throw new Error("[fs--parent safety] Not found up to home or higher!")

	const levels_up = nodeꓽpath.relative(searchᐧstart, candidate).split(nodeꓽpath.sep).filter(Boolean).length
	if (levels_up > 12) throw new Error("[fs--parent safety] Not found up to too high!")
}

/////////////////////////////////////////////////

import { existsSync, readFileSync } from "node:fs"
import { findPackageJSON } from "node:module"
import * as nodeꓽos from "node:os"
import * as nodeꓽpath from "node:path"

import { assert_from, assert } from "@monorepo-private/assert"
import type { PathⳇAbsolute } from "@monorepo-private/ts--types"
