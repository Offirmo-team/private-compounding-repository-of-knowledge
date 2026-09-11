/////////////////////////////////////////////////

export interface WebPropertyBundle {
	files: FilesMap
	meta: {
		serve_me‿relpath: PathⳇRelative
		spec: WebPropertySpec
	}
}

/////////////////////////////////////////////////

import type { WebPropertySpec } from "@web-property-outfitter/spec"

import type { PathⳇRelative } from "@monorepo-private/ts--types"

import type { FilesMap } from "./files-map/types.ts"
