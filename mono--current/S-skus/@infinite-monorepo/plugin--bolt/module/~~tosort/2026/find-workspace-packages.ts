import path from 'node:path'
import fs from 'node:fs'

import globby from 'globby'

/**
 * Discovers workspace package directories using the exact same algorithm
 * and library as bolt's `Project.getPackages()` — glob patterns from
 * `bolt.workspaces` are expanded via globby, filtered to directories
 * containing a `package.json`, and returned as sorted, deduplicated
 * relative paths.
 *
 * @see https://github.com/boltpkg/bolt/blob/master/src/Project.js — getPackages()
 * @see https://github.com/boltpkg/bolt/blob/master/src/utils/globs.js — findWorkspaces()
 */
export async function findWorkspacePackages(workspaceRoot: string, patterns: string[]): Promise<string[]> {
	const matchedPaths = await globby(patterns, {
		cwd: workspaceRoot,
	})

	const packageDirs = matchedPaths.filter((p) => {
		const packageJsonPath = path.join(workspaceRoot, p, 'package.json')
		return fs.existsSync(packageJsonPath)
	})

	return [...new Set(packageDirs)].sort().map((p) => path.normalize(p))
}
