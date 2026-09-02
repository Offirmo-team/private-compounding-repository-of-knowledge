import type { BaseUState } from "@monorepo-private/state-utils"

/////////////////////

interface State extends BaseUState {
	slot_id: number // TODO rework

	is_web_diversity_supporter: boolean

	is_logged_in: boolean // useful for achievements
	roles: string[]
}

/////////////////////

export { type State }
