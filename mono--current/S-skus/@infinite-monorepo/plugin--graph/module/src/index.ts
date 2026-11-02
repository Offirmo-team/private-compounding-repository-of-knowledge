/////////////////////////////////////////////////

const graphᐧjson5__path‿ar: MonorepoPathⳇRelative = `${PATHVARⵧROOTⵧMONOREPO}/.monorepo/graph.json5`
export const manifestꓽgraphᐧjson5: StructuredFsⳇFileManifest = {
	path‿ar: graphᐧjson5__path‿ar,
	doc: [],
}

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		return StateLib.declareꓽfile_manifest(state, manifestꓽgraphᐧjson5)
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>): Immutable<State> {
		if (node.type !== "monorepo") return state

		// at this stage, all nodes are discovered and refined = we can derive the full graph at once
		const nodesⵧpackage = Object.values(state.graphs.nodesⵧworkspace).filter((n) => n.type === "package")
		const graph = {
			packages: deriveꓽpackages(nodesⵧpackage, node.path‿abs, (fqname) =>
				// same SSoT as for "workspace:*" in package.json
				state.pkg_infos_resolver.isꓽmonorepo_package(fqname),
			),
		} satisfies PackageGraph

		return StateLib.requestꓽfile_output(state, {
			parent_node: node,
			manifest: manifestꓽgraphᐧjson5,
			intent: "present--exact",
			content: graph,
		} satisfies FileOutputPresent)
	},
}
export default PLUGIN

export type * from "./types.ts"
export * from "./utils.ts"

/////////////////////////////////////////////////

import * as StateLib from "@infinite-monorepo/state"
import {
	type FileOutputPresent,
	type MonorepoPathⳇRelative,
	type Node,
	PATHVARⵧROOTⵧMONOREPO,
	type Plugin,
	type State,
	type StructuredFsⳇFileManifest,
} from "@infinite-monorepo/types-for-plugins"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import { deriveꓽpackages } from "./selectors.ts"
import type { PackageGraph } from "./types.ts"
