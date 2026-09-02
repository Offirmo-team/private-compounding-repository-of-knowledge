import { type Item, InventorySlot } from "@tbrpg/definitions"
import { type Armor } from "@tbrpg/logic--armors"
import { type Weapon } from "@tbrpg/logic--weapons"

import { type BaseUState } from "@monorepo-private/state-utils"

/////////////////////

interface State extends BaseUState {
	slotted: {
		[InventorySlot.armor]: Armor | undefined
		[InventorySlot.weapon]: Weapon | undefined
	}
	unslotted_capacity: number
	unslotted: Array<Item>
}

/////////////////////

export { type Item, type State }

/////////////////////
