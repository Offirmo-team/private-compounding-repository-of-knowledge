export async function ೱloadꓽfiles(dir: PathⳇAbsolute, segment?: string | undefined): Promise<FilesMap> {
	const ǃ = assert_from({ ೱloadꓽfiles })

	dir = nodeꓽpath.normalize(dir)
	ǃ.forⵧparam({ serveDir: dir }).require(nodeꓽpath.isAbsolute(dir), `dir must be absolute, got "${dir}"`)

	const relpaths = lsFilesRecursiveSync(dir, { full_path: false })

	const entries = await Promise.all(
		relpaths.map(async (relpath: PathⳇRelative) => {
			const content = await fs.readFile(nodeꓽpath.join(dir, relpath))

			const path = segment ? nodeꓽpath.join(segment, relpath) : relpath
			return [path, { content }] as const
		}),
	)

	return Object.fromEntries(entries)
}

/////////////////////////////////////////////////
import * as fs from "node:fs/promises"
import * as nodeꓽpath from "node:path"

import { assert_from, assert } from "@monorepo-private/assert"
import { lsFilesRecursiveSync } from "@monorepo-private/fs--ls"
import type { PathⳇAbsolute, PathⳇRelative } from "@monorepo-private/ts--types"

import type { FilesMap } from "./types.ts"
