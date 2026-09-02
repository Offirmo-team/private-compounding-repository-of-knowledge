import * as EngagementState from "@oh-my-rpg/state--engagement"
import { ITEM_SLOTS, type InventorySlot, type Element, type HypermediaContentType } from "@tbrpg/definitions"
import { appraise_power } from "@tbrpg/logic--shop"
import { type AchievementSnapshot } from "@tbrpg/state--achievements"
import { getꓽitem as _get_item, getꓽitem_in_slot as _get_item_in_slot } from "@tbrpg/state--inventory"

import { type Immutable } from "@monorepo-private/ts--types"
import { type UUID } from "@monorepo-private/uuid"
/////////////////////

import type { UState } from "../types.ts"

import { getꓽachievement_snapshot_by_temporary_id } from "./achievements.ts"

/////////////////////

// TODO power
function appraise_player_power(u_state: Immutable<UState>): number {
	let power: number = 1

	ITEM_SLOTS.forEach((slot: InventorySlot) => {
		const item = _get_item_in_slot(u_state.inventory, slot)

		if (item) power += appraise_power(item)
	})

	// TODO appraise attributes relative to class

	return power
}

function find_element(u_state: Immutable<UState>, uuid: UUID): Immutable<Element> | AchievementSnapshot | null {
	// only inventory for now
	let possible_achievement: AchievementSnapshot | null = null
	try {
		possible_achievement = getꓽachievement_snapshot_by_temporary_id(u_state, uuid)
	} catch (err) {
		// not found, swallow
	}
	return possible_achievement || _get_item(u_state.inventory, uuid)
}

function getꓽpending_engagements(
	u_state: Immutable<UState>,
): ReturnType<typeof EngagementState.getꓽpending_engagements<HypermediaContentType>> {
	return EngagementState.getꓽpending_engagements(u_state.engagement)
}

/////////////////////

export { find_element, appraise_player_power, getꓽpending_engagements }
