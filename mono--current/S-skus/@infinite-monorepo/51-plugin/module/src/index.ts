import type { Node } from "@infinite-monorepo/graph"
import * as StateLib from "@infinite-monorepo/state"

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

export interface Plugin {
	/////// BEFORE ANY LOCAL (spec, files) IS LOADED ///////

	// first call
	// IMPORTANT at this stage, the state is a blank, default one
	// the plugin should NOT be making decisions, only do generic stuff like registering manifests
	onꓽload?: (state: Immutable<StateLib.State>) => Immutable<StateLib.State>

	/////// AFTER SPEC IS LOADED, BEFORE ANY WRITE ///////
	// at this stage, we have at least:
	// - 1   SCM root "repository"
	// - 1…n workspace roots "monorepo"
	// => they will trigger "on node discovered" below

	// TODO maybe we should have a spec discovery first? or "hybrid" version?

	// to gather facts (and not opinions!)
	// IMPORTANT this will be called for each node, not necessarily in any specific order
	// the plugin can discover:
	// - what exists
	// - config, if in hybrid mode e.g. pnpm plugin seeing a pnpm-workspace.yaml file and later (async) inferring pnpm is used
	// - new nodes + register them (using state reducers) e.g. pnpm using its heuristic to detect packages
	onꓽnodeⵧdiscoveredⵧfirst_time?: (
		state: Immutable<StateLib.State>,
		node: Immutable<Node>,
	) => Immutable<StateLib.State>

	// this is basically a second pass of onꓽnodeⵧdiscoveredⵧfirst_time()
	// to account for async tasks initiated previously (e.g. foreign config files reads)
	// especially useful in hybrid mode
	// example:
	// 1) onꓽnodeⵧdiscoveredⵧfirst_time() [above] discovers we're using pnpm
	// 2) this one glob the workspace lines and register new nodes
	// if creating packages, this is also the place (+ register them) now that we know they don't exist
	// BFS so that the spec cascade can be set and properly cascade down
	onꓽnodeⵧdiscoveredⵧbfs?: (state: Immutable<StateLib.State>, node: Immutable<Node>) => Immutable<StateLib.State>

	// a package analysis will now be triggered

	// refine before apply
	// useful to tweak the details before apply
	// no BFS = should not be important at this stage
	onꓽnodeⵧrefine?: (state: Immutable<StateLib.State>, node: Immutable<Node>) => Immutable<StateLib.State>

	// to reach the ideal state (file outputs)
	// no BFS = should not be important at this stage
	onꓽapply?: (state: Immutable<StateLib.State>, node: Immutable<Node>) => Immutable<StateLib.State>
}
