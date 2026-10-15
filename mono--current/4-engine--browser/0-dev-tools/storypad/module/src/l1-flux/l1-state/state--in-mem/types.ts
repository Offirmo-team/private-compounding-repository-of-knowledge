import type { JSONPrimitiveType } from "@monorepo-private/ts--types"

import type { Config } from "../../../l0-types/l2-config/index.ts"
import type { StoryUId, StoryTree } from "../types.ts"

/////////////////////////////////////////////////

export interface State {
	config: Config

	first_encountered_story‿uid: StoryUId | undefined

	tree: StoryTree

	annotations: Record<string, JSONPrimitiveType>

	view: {
		manager: {
			sidebar: {}
		}
		story_area: {}
	}
}
