import { type State as CodesState } from "@oh-my-rpg/state--codes"
import { type State as EngagementState } from "@oh-my-rpg/state--engagement"
import { type State as MetaState } from "@oh-my-rpg/state--meta"
import { type State as PRNGState } from "@oh-my-rpg/state--prng"
import { type HypermediaContentType } from "@tbrpg/definitions"
import { type ResolvedAdventure } from "@tbrpg/logic--adventure--resolved"
import { type State as AchievementsState } from "@tbrpg/state--achievements"
import { type State as CharacterState } from "@tbrpg/state--character"
import { type UState as EnergyUState, type TState as EnergyTState } from "@tbrpg/state--energy"
import { type State as InventoryState } from "@tbrpg/state--inventory"
import { type State as WalletState } from "@tbrpg/state--wallet"

import { type BaseUState, type BaseTState, type BaseRootState } from "@monorepo-private/state-utils"

/////////////////////////////////////////////////

interface UState extends BaseUState {
	// core
	avatar: CharacterState
	energy: EnergyUState
	inventory: InventoryState
	progress: AchievementsState
	wallet: WalletState
	last_adventure: ResolvedAdventure | null

	// technical
	prng: PRNGState
	engagement: EngagementState<HypermediaContentType>

	// meta = growth etc.
	meta: MetaState
	codes: CodesState
}

interface TState extends BaseTState {
	energy: EnergyTState
}

interface State extends BaseRootState<UState, TState> {
	schema_version: number // yes it's redundant but very convenient for debugging in the console
}

/////////////////////////////////////////////////

export { type UState, type TState, type State }

/////////////////////
