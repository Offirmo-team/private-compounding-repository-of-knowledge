import type { Config } from "../../../l0-types/l2-config/index.ts"
import type { StoryUId, StoryTree } from "../types.ts"

/////////////////////////////////////////////////

export interface State {
	config: Config

	first_encountered_story‿uid: StoryUId | undefined

	tree: StoryTree

	view: {
		manager: {
			sidebar: {}
		}
		story_area: {
			drawer: {
				status_bar: {
					pills: Record<string, string>
				}
			}
		}
	}
}
