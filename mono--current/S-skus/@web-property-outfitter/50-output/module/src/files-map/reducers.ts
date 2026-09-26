/////////////////////////////////////////////////

export function removeꓽfile(map: Immutable<FilesMap>, relpath: PathⳇRelative): Immutable<FilesMap> {
	if (!Object.hasOwn(map, relpath)) return map // no change

	const { [relpath]: _removed, ...remaining } = map

	return remaining
}

// on conflict, the last map wins
export function mergeꓽfiles_maps(
	mapⵧbase: Immutable<FilesMap>,
	mapⵧoverriding: Immutable<FilesMap>,
): Immutable<FilesMap> {
	return {
		...mapⵧbase,
		...mapⵧoverriding,
	}
}

/////////////////////////////////////////////////

import type { Immutable, PathⳇRelative } from "@monorepo-private/ts--types"

import type { FilesMap } from "./types.ts"
