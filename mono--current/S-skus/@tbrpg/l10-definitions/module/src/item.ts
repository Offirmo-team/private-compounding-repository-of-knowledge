import type { Immutable } from "@monorepo-private/ts--types"

import { ITEM_SLOTS_TO_INT, ITEM_QUALITIES_TO_INT } from "./consts.ts"
import { createꓽelementⵧbase } from "./element.ts"
import { ElementType, type Item, ItemQuality, InventorySlot } from "./types.ts"

/////////////////////////////////////////////////

function createꓽitemⵧbase(slot: InventorySlot, quality: ItemQuality = ItemQuality.common): Item {
	return {
		...createꓽelementⵧbase(ElementType.item),
		slot,
		quality,
	}
}

function compareꓽitemsⵧby_slot(a: Immutable<Item>, b: Immutable<Item>): number {
	const rank_a = ITEM_SLOTS_TO_INT[a.slot]
	if (!Number.isInteger(rank_a)) throw new Error("compare items by slots: unhandled slot! (A)")

	const rank_b = ITEM_SLOTS_TO_INT[b.slot]
	if (!Number.isInteger(rank_b)) throw new Error("compare items by slots: unhandled slot! (B)")

	return rank_a! - rank_b!
}

function compareꓽitemsⵧby_quality(a: Immutable<Item>, b: Immutable<Item>): number {
	const rank_a = ITEM_QUALITIES_TO_INT[a.quality]
	if (!Number.isInteger(rank_a)) throw new Error("compare items by quality: unhandled quality! (A)")

	const rank_b = ITEM_QUALITIES_TO_INT[b.quality]
	if (!Number.isInteger(rank_b)) throw new Error("compare items by quality: unhandled quality! (B)")

	return rank_a! - rank_b!
}

/////////////////////////////////////////////////

export { createꓽitemⵧbase, compareꓽitemsⵧby_slot, compareꓽitemsⵧby_quality }
