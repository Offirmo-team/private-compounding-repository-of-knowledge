/////////////////////

import { type Item, ItemQuality, InventorySlot, createꓽitemⵧbase } from "@tbrpg/definitions"

import { getꓽrandom, type RNGEngine } from "@monorepo-private/random"
import type { Immutable } from "@monorepo-private/ts--types"

import { LIB, MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL } from "./consts.ts"
import { i18n_messages, ARMOR_BASES, ARMOR_QUALIFIERS1, ARMOR_QUALIFIERS2 } from "./data/index.ts"
import { BASE_STRENGTH_INTERVAL_BY_QUALITY } from "./selectors.ts"
import { type Armor } from "./types.ts"

/////////////////////

function _pick_random_quality(rng: RNGEngine): ItemQuality {
	// old
	// common    =  400/1000
	// uncommon  =  389/1000
	// rare:     =  200/1000
	// epic:     =   10/1000
	// legendary =    1/1000

	// recalculated 2018/12/03
	// we want a legendary drop every 2 month
	// currently computed = 60 drops / 2 month
	// that gives:
	// common    =  300/1000
	// uncommon  =  300/1000
	// rare:     =  250/1000
	// epic:     =  120/1000
	// legendary =   30/1000

	let p = getꓽrandom.generator_of.integer.between(1, 1000)(rng)

	if (p <= 300) return ItemQuality.common
	p -= 300

	if (p <= 300) return ItemQuality.uncommon
	p -= 300

	if (p <= 250) return ItemQuality.rare
	p -= 250

	if (p <= 120) return ItemQuality.epic

	return ItemQuality.legendary
}

function _pick_random_base(rng: RNGEngine): string {
	return getꓽrandom.picker.of(ARMOR_BASES)(rng).hid
}
function _pick_random_qualifier1(rng: RNGEngine): string {
	return getꓽrandom.picker.of(ARMOR_QUALIFIERS1)(rng).hid
}
function _pick_random_qualifier2(rng: RNGEngine): string {
	return getꓽrandom.picker.of(ARMOR_QUALIFIERS2)(rng).hid
}
function _pick_random_base_strength(rng: RNGEngine, quality: ItemQuality): number {
	return getꓽrandom.generator_of.integer.in_interval(BASE_STRENGTH_INTERVAL_BY_QUALITY[quality]!)(rng)
}

/////////////////////

function create(rng: RNGEngine, hints: Immutable<Partial<Armor>> = {}): Armor {
	// TODO add a check for hints to be in existing components

	const base = createꓽitemⵧbase(InventorySlot.armor, hints.quality || _pick_random_quality(rng)) as Item & {
		slot: typeof InventorySlot.armor
	}

	const temp: Armor = {
		...base,
		base_hid: hints.base_hid || _pick_random_base(rng),
		qualifier1_hid: hints.qualifier1_hid || _pick_random_qualifier1(rng),
		qualifier2_hid: hints.qualifier2_hid || _pick_random_qualifier2(rng),
		base_strength: hints.base_strength || _pick_random_base_strength(rng, base.quality),
		enhancement_level: hints.enhancement_level || MIN_ENHANCEMENT_LEVEL,
	}

	if (temp.base_strength < BASE_STRENGTH_INTERVAL_BY_QUALITY[temp.quality]![0])
		throw new Error(`${LIB}: create(): base_strength too low for this quality!`)
	if (temp.base_strength > BASE_STRENGTH_INTERVAL_BY_QUALITY[temp.quality]![1])
		throw new Error(`${LIB}: create(): base_strength too high for this quality!`)

	return temp
}

function enhance(armor: Immutable<Armor>): Immutable<Armor> {
	if (armor.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
		throw new Error("can’t enhance a armor above the maximal enhancement level!")

	return {
		...armor,
		enhancement_level: armor.enhancement_level + 1,
	}
}

/////////////////////

export { create, enhance }
export { i18n_messages } from "./data/index.ts"

/////////////////////
