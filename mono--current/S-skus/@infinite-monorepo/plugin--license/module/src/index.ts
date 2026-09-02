import * as StateLib from "@infinite-monorepo/state"
import {
	type Plugin,
	type StructuredFsⳇFileManifest,
	type MonorepoPathⳇRelative,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const LICENSE__path‿ar: MonorepoPathⳇRelative = "$WORKSPACE_ROOT/LICENSE"

const LICENSE__manifest: StructuredFsⳇFileManifest = {
	path‿ar: LICENSE__path‿ar,
	doc: ["https://github.com/nvm-sh/nvm?tab=readme-ov-file#nvmrc", "https://www.npmjs.com/package/nvmrc"],
}

/////////////////////////////////////////////////

const PLUGIN: Plugin = {
	onꓽload(state: Immutable<StateLib.State>): Immutable<StateLib.State> {
		state = StateLib.declareꓽfile_manifest(state, LICENSE__manifest)

		return state
	},
}

/////////////////////////////////////////////////

export default PLUGIN
