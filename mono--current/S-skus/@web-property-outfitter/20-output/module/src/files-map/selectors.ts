/////////////////////////////////////////////////

export function getꓽsubpath(map: Immutable<FilesMap>, subpath: PathⳇRelative): Immutable<FilesMap> {
	subpath = subpath + (subpath.endsWith("/") ? "" : "/")

	return Object.fromEntries(
		Object.entries(map)
			.filter(([path, _]) => {
				return path.startsWith(subpath)
			})
			.map(([path, content]) => {
				return [path.slice(subpath.length), content]
			}),
	)
}

/////////////////////////////////////////////////

import type { Immutable, PathⳇRelative } from "@monorepo-private/ts--types"

import type { FilesMap } from "./types.ts"
