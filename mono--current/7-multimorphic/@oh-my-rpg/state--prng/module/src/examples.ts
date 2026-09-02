import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { type State } from "./types.ts"

/////////////////////////////////////////////////

// a full-featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Immutable<State> = enforceꓽimmutable<State>({
	uuid: "uu1~example~state~PRNG~~",
	schema_version: 4,
	revision: 108,

	prng_state: {
		algorithm_id: "MT19937",
		call_count: 107,
		seed: -54321,
	},

	recently_encountered_by_id: {
		item: ["axe", "sword"],
		adventures: ["dragon", "king"],
		mystery: [],
	},
})

/////////////////////////////////////////////////

export { DEMO_STATE }
