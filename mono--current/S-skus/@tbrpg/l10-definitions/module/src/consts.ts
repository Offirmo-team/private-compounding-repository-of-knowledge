import { Enum } from "typescript-string-enums"

import { assert_from, assert } from "@monorepo-private/assert"

import { ItemQuality, InventorySlot } from "./types.ts"

/////////////////////////////////////////////////

export const APP = "@tbrpg"

export const LIB = "@tbrpg/definitions"

/////////////////////////////////////////////////

export const ITEM_QUALITIES = Enum.keys(ItemQuality)

// useful for ex. for sorting
export const ITEM_QUALITIES_TO_INT: Readonly<Record<ItemQuality, number>> = {
	[ItemQuality.common]: 6,
	[ItemQuality.uncommon]: 5,
	[ItemQuality.rare]: 4,
	[ItemQuality.epic]: 3,
	[ItemQuality.legendary]: 2,
	[ItemQuality.artifact]: 1,
}
assert(
	Object.keys(ITEM_QUALITIES_TO_INT).length === ITEM_QUALITIES.length,
	`ITEM_QUALITIES_TO_INT should be up to date!`,
)

///////

export const ITEM_SLOTS: InventorySlot[] = Enum.keys(InventorySlot)
	.filter((s) => s !== InventorySlot.none)
	.sort()

// useful for ex. for sorting
export const ITEM_SLOTS_TO_INT: Readonly<Record<InventorySlot, number>> = {
	[InventorySlot.weapon]: 1,
	[InventorySlot.armor]: 2,

	[InventorySlot.none]: NaN, // impossible, for type only
}
assert(
	Object.keys(ITEM_SLOTS_TO_INT).filter((s) => s !== InventorySlot.none).length === ITEM_SLOTS.length,
	`ITEM_SLOTS_TO_INT should be up to date!`,
)

/////////////////////////////////////////////////

export const MIN_LEVEL = 1
export const MAX_LEVEL = 9999
