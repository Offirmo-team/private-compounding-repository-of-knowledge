/////////////////////

import { ItemQuality, InventorySlot, ElementType } from "@tbrpg/definitions"

import { getꓽrandom, getꓽengine, type RNGEngine } from "@monorepo-private/random"
import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL } from "./consts.ts"
import { ARMOR_BASES, ARMOR_QUALIFIERS1, ARMOR_QUALIFIERS2 } from "./data/index.ts"
import { BASE_STRENGTH_INTERVAL_BY_QUALITY } from "./selectors.ts"
import { create } from "./state.ts"
import type { Armor } from "./types.ts"

/////////////////////

const DEMO_ARMOR_1: Immutable<Armor> = enforceꓽimmutable<Armor>({
	uuid: "uu1~test~demo~armor~0001",
	element_type: ElementType.item,
	slot: InventorySlot.armor,
	base_hid: ARMOR_BASES[0]!.hid,
	qualifier1_hid: ARMOR_QUALIFIERS1[0]!.hid,
	qualifier2_hid: ARMOR_QUALIFIERS2[0]!.hid,
	quality: ItemQuality.uncommon,
	base_strength: BASE_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.uncommon]![0] + 1,
	enhancement_level: MIN_ENHANCEMENT_LEVEL,
})

const DEMO_ARMOR_2: Immutable<Armor> = enforceꓽimmutable<Armor>({
	uuid: "uu1~test~demo~armor~0002",
	element_type: ElementType.item,
	slot: InventorySlot.armor,
	base_hid: ARMOR_BASES[1]!.hid,
	qualifier1_hid: ARMOR_QUALIFIERS1[1]!.hid,
	qualifier2_hid: ARMOR_QUALIFIERS2[1]!.hid,
	quality: ItemQuality.legendary,
	base_strength: BASE_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary]![1] - 1,
	enhancement_level: MAX_ENHANCEMENT_LEVEL,
})

// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_armor(rng?: RNGEngine): Armor {
	rng = rng || getꓽengine.good_enough()
	return create(rng!, {
		enhancement_level: getꓽrandom.generator_of.integer.between(MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL)(rng),
	})
}

////////////////////////////////////

export { DEMO_ARMOR_1, DEMO_ARMOR_2, generate_random_demo_armor }

/////////////////////
