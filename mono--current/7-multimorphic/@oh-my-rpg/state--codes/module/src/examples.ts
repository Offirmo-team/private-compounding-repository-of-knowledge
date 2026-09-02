import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"
import { TEST_TIMESTAMP_MS, getꓽUTC_timestampⵧhuman_readable‿minutes } from "@monorepo-private/timestamps"

import { type State } from "./types.ts"

/////////////////////

// a full-featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Immutable<State> = enforceꓽimmutable<State>({
	schema_version: 1,
	revision: 3,

	redeemed_codes: {
		BORED: {
			redeem_count: 1,
			last_redeem_date_minutes: getꓽUTC_timestampⵧhuman_readable‿minutes(new Date(TEST_TIMESTAMP_MS)),
		},
	},
})

/////////////////////

export { DEMO_STATE }
