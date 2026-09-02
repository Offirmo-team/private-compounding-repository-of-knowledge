import type { State, Plugin } from "@infinite-monorepo/state"
import * as StateLib from "@infinite-monorepo/state"
import type { FileOutputPresent } from "@infinite-monorepo/state"
import {
	PATHVARⵧROOTⵧNODE,
	type StructuredFsⳇFileManifest,
	type Node,
	type NodePathⳇRelative,
	type RepoPathⳇRelative,
	PATHVARⵧROOTⵧREPO,
	type MonorepoPathⳇRelative,
	PATHVARⵧROOTⵧMONOREPO,
} from "@infinite-monorepo/types-for-plugins"
import * as semver from "semver"

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

/////////////////////////////////////////////////

const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		return state
	},
}

/////////////////////////////////////////////////

export default PLUGIN
//export { PLUGIN }
