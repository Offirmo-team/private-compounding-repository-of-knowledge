import { type NumeratorDenominator } from "fraction.js"

import { type BaseUState, type BaseTState } from "@monorepo-private/state-utils"

/////////////////////

interface UState extends BaseUState {
	max_energy: number
	total_energy_consumed_so_far: number
}

interface TState extends BaseTState {
	available_energy: NumeratorDenominator
}

/////////////////////

export { type UState, type TState }

/////////////////////
