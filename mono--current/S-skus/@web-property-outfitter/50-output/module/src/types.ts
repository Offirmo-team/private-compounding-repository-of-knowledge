/////////////////////////////////////////////////

export interface FilesMap {
	[relpath: PathⳇRelative]: {
		content: string | Buffer
		// room for per-file metadata later
	}
}

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
