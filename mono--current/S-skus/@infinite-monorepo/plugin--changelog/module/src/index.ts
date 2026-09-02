import * as StateLib from "@infinite-monorepo/state"
import {
	type Plugin,
	type StructuredFsⳇFileManifest,
	type MonorepoPathⳇRelative,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const CHANGELOGᐧmd__path‿ar: MonorepoPathⳇRelative = "$WORKSPACE_ROOT/CHANGELOG.md"

const CHANGELOGᐧmd__manifest: StructuredFsⳇFileManifest = {
	path‿ar: CHANGELOGᐧmd__path‿ar,
	doc: ["https://openchangelog.com/blog/changelog-md"],
}

/////////////////////////////////////////////////

const PLUGIN: Plugin = {
	onꓽload(state: Immutable<StateLib.State>): Immutable<StateLib.State> {
		state = StateLib.declareꓽfile_manifest(state, CHANGELOGᐧmd__manifest)

		return state
	},
}

/////////////////////////////////////////////////

export default PLUGIN
