import type { PRNGState } from "@monorepo-private/random"
import type { BaseUState } from "@monorepo-private/state-utils"
import type { UUID } from "@monorepo-private/uuid"

/////////////////////////////////////////////////

interface State extends BaseUState {
	uuid: UUID // for caching / debug. Do not mind.

	// underlying @monorepo-private/random state
	prng_state: PRNGState

	// additional features:
	// - prevent repetition
	recently_encountered_by_id: {
		[k: string]: Array<string | number>
	}
}

/////////////////////////////////////////////////

export { type State }
