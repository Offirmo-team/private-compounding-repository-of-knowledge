import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import type { State } from "./types.ts"

/////////////////////

// needed to test migrations, both here and in composing parents

// a full-featured, non-trivial demo state
// needed for demos

const DEMO_STATE: Immutable<State> = enforceꓽimmutable<State>({
	schema_version: 3,
	revision: 5,

	slot_id: 0,

	is_web_diversity_supporter: true,
	is_logged_in: true,
	roles: ["tbrpg:alpha"],
})

/////////////////////

export { DEMO_STATE }
