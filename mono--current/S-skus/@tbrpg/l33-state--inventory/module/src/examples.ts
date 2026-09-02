import { InventorySlot } from "@tbrpg/definitions"
import { DEMO_ARMOR_1, DEMO_ARMOR_2 } from "@tbrpg/logic--armors"
import { DEMO_WEAPON_1, DEMO_WEAPON_2 } from "@tbrpg/logic--weapons"

import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { type State } from "./types.ts"

/////////////////////

// needed to test migrations, both here and in composing parents

// a full-featured, non-trivial demo state
// needed for demos
const DEMO_STATE: Immutable<State> = enforceꓽimmutable<State>({
	schema_version: 1,
	revision: 42,

	unslotted_capacity: 20,
	slotted: {
		[InventorySlot.armor]: DEMO_ARMOR_2,
		[InventorySlot.weapon]: DEMO_WEAPON_1,
	},
	unslotted: [DEMO_WEAPON_2, DEMO_ARMOR_1],
})

/////////////////////

export { DEMO_STATE }

/////////////////////
