import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { type State } from "./types.ts"

/////////////////////

// a full-featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Immutable<State> = enforceꓽimmutable<State>({
	schema_version: 1,
	revision: 42,

	coin_count: 23456,
	token_count: 89,
})

/////////////////////

export { DEMO_STATE }
