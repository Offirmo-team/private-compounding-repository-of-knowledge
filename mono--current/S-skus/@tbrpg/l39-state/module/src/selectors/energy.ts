import { getꓽavailable_energy‿float as _get_available_energy_float, getꓽhuman_time_to_next } from "@tbrpg/state--energy"

import { type Immutable } from "@monorepo-private/ts--types"

import type { State, TState } from "../types.ts"

/////////////////////////////////////////////////

function getꓽavailable_energy‿float(t_state: Immutable<TState>): number {
	return _get_available_energy_float(t_state.energy)
}

function getꓽhuman_time_to_next_energy({ u_state, t_state }: Immutable<State>): string {
	return getꓽhuman_time_to_next(u_state.energy, t_state.energy)
}

/////////////////////////////////////////////////

export { getꓽavailable_energy‿float, getꓽhuman_time_to_next_energy }
