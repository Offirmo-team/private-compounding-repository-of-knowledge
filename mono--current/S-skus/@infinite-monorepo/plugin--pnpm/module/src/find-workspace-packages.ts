import path from "node:path"

import { glob } from "tinyglobby"

/**
 * Discovers workspace package directories using the exact same algorithm as pnpm's `@pnpm/fs.find-packages` — glob
 * patterns are appended with `/package.{json,yaml,json5}`, matched via tinyglobby, deduplicated, and mapped back to
 * directory paths.
 *
 * We use tinyglobby directly instead of `@pnpm/fs.find-packages` because: - pnpm internal packages use unstable
 * 1000.x/1001.x versioning, not meant as public API - that package pulls in `@pnpm/read-project-manifest` +
 * `@pnpm/types` — we only need paths
 *
 * @see https://github.com/pnpm/pnpm/blob/main/fs/find-packages/src/index.ts
 */
export async function findWorkspacePackages(workspaceRoot: string, patterns: string[]): Promise<string[]> {
	const normalizedPatterns = patterns.map((p) => p.replace(/\/?$/, "/package.{json,yaml,json5}"))

	const manifestPaths = await glob(normalizedPatterns, {
		cwd: workspaceRoot,
		expandDirectories: false,
		ignore: ["**/node_modules/**", "**/bower_components/**"],
	})

	return [...new Set(manifestPaths.map((p) => path.dirname(p)))].sort().map((p) => path.normalize(p))
}
