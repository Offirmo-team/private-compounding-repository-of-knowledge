/////////////////////////////////////////////////

export interface UState extends BaseUState {
	// core

	// technical
	//prng: PRNGState
	//engagement: EngagementState<HypermediaContentType>

	// meta = growth etc.
	//meta: MetaState
	//codes: CodesState
}

export interface TState extends BaseTState {
	//energy: EnergyTState
}

export interface State extends BaseRootState<UState, TState> {
	schema_version: number // yes it's redundant but very convenient for debugging in the console
}

/////////////////////////////////////////////////

import { type BaseUState, type BaseTState, type BaseRootState } from "@monorepo-private/state-utils"
