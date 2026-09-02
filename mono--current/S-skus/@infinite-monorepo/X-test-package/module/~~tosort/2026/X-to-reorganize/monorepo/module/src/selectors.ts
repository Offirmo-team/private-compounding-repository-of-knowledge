import { existsSync, renameSync } from "node:fs"
import * as path from "node:path"

import { lsDirsSync } from "@monorepo-private/fs--ls"

import { getꓽbolt_monorepo__workspaces } from "./bolt.ts"
import { MONOREPO_ROOT } from "./consts.ts"

/////////////////////////////////////////////////

type AbsPath = string

function getꓽall_known_pure_module__dirs‿abspath(): Array<AbsPath> {
	// we're currently using bolt
	// TODO one day out-of-source build from a flat list of pure modules
	const workspaces = getꓽbolt_monorepo__workspaces(MONOREPO_ROOT)

	return workspaces
		.reduce((acc, workspace) => {
			const subdirs = lsDirsSync(workspace.path‿abs, { full_path: true })
				.filter((p) => !p.includes("~~"))
				.filter((p) => {
					if (p.endsWith("/0-dev-tools/parcel--config--default")) return false // TODO complicated
					if (p.endsWith("/0-dev-tools/parcel--toolbox")) return false // TODO complicated
					if (p.endsWith("/0-dev-tools/vite--toolbox")) return false // TODO complicated
					return true
				})
				/*.filter((p) => {
					// migration
					if (!existsSync(path.resolve(p, "module"))) {
						if (!existsSync(path.resolve(p, "src"))) {
							return false
						}
						renameSync(path.resolve(p, "src"), path.resolve(p, "module"))
					}
					return true
				})*/
				.map((p) => path.join(p, "module"))

			return acc.concat(subdirs)
		}, [] as Array<AbsPath>)
		.sort()
}

/////////////////////////////////////////////////

export { getꓽall_known_pure_module__dirs‿abspath }
