/////////////////////////////////////////////////

export interface FilesMap {
	[relpath: PathⳇRelative]: {
		content: string | Buffer
		// room for per-file metadata later
	}
}

/////////////////////////////////////////////////

import type { PathⳇRelative } from "@monorepo-private/ts--types"
