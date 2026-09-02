import {
	type OutcomeArchetype,
	AdventureType,
	type AdventureArchetype,
	generate_random_coin_gain_or_loss,
} from "@tbrpg/logic--adventures"
import { create as create_armor } from "@tbrpg/logic--armors"
import { create as create_monster } from "@tbrpg/logic--monsters"
import { create as create_weapon, is_at_max_enhancement as is_weapon_at_max_enhancement } from "@tbrpg/logic--weapons"
import { CharacterAttribute, CharacterClass, type State as CharacterState } from "@tbrpg/state--character"
import * as InventoryState from "@tbrpg/state--inventory"
import * as WalletState from "@tbrpg/state--wallet"
import { Enum } from "typescript-string-enums"

import { getꓽrandom, type RNGEngine } from "@monorepo-private/random"
import { type Immutable } from "@monorepo-private/ts--types"
import { generate_uuid } from "@monorepo-private/uuid"

import { LIB } from "../consts.ts"
import { type ResolvedAdventure } from "../types.ts"

/////////////////////////////////////////////////

type AttributesArray = CharacterAttribute[]

const ALL_ATTRIBUTES_X_LVL: AttributesArray = ["health", "mana", "strength", "agility", "charisma", "wisdom", "luck"]

const WARRIOR_LIKE_PRIMARY_ATTRIBUTES: AttributesArray = ["strength"]
const ROGUE_LIKE_PRIMARY_ATTRIBUTES: AttributesArray = ["agility"]
const MAGE_LIKE_PRIMARY_ATTRIBUTES: AttributesArray = ["mana"]
const HYBRID_PALADIN_LIKE_PRIMARY_ATTRIBUTES: AttributesArray = ["strength", "mana"]

const PRIMARY_STATS_BY_CLASS: { [k: string]: AttributesArray } = {
	[CharacterClass.novice]: ALL_ATTRIBUTES_X_LVL,

	[CharacterClass.barbarian]: WARRIOR_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.druid]: ["wisdom", "mana"],
	[CharacterClass.warrior]: WARRIOR_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.paladin]: HYBRID_PALADIN_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.rogue]: ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.sorcerer]: MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.warlock]: MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.wizard]: MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass["darkness hunter"]]: HYBRID_PALADIN_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.hunter]: ["agility"],
	[CharacterClass.priest]: ["charisma", "mana"],
	[CharacterClass["death knight"]]: HYBRID_PALADIN_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.mage]: MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.engineer]: ["wisdom"],
	[CharacterClass.thief]: ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.assassin]: ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.illusionist]: ["charisma", "agility"],
	[CharacterClass.knight]: WARRIOR_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.pirate]: ["luck"],
	[CharacterClass.ninja]: ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.corsair]: ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.necromancer]: MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.sculptor]: ["agility"],
	[CharacterClass.summoner]: MAGE_LIKE_PRIMARY_ATTRIBUTES,
}
if (Object.keys(PRIMARY_STATS_BY_CLASS).length !== Enum.keys(CharacterClass).length)
	throw new Error(`${LIB}: PRIMARY_STATS_BY_CLASS is out of date!`)

const WARRIOR_LIKE_SECONDARY_ATTRIBUTES: AttributesArray = ["health"]
const ROGUE_LIKE_SECONDARY_ATTRIBUTES: AttributesArray = ["luck"]
const MAGE_LIKE_SECONDARY_ATTRIBUTES: AttributesArray = ["wisdom"]
const HYBRID_PALADIN_LIKE_SECONDARY_ATTRIBUTES: AttributesArray = ["health"]

const SECONDARY_STATS_BY_CLASS: { [k: string]: AttributesArray } = {
	[CharacterClass.novice]: ALL_ATTRIBUTES_X_LVL,

	[CharacterClass.barbarian]: WARRIOR_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.druid]: ["strength", "agility"],
	[CharacterClass.warrior]: WARRIOR_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.paladin]: HYBRID_PALADIN_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.rogue]: ROGUE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.sorcerer]: MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.warlock]: MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.wizard]: MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass["darkness hunter"]]: HYBRID_PALADIN_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.hunter]: ["strength"],
	[CharacterClass.priest]: ["wisdom"],
	[CharacterClass["death knight"]]: HYBRID_PALADIN_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.mage]: MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.engineer]: ["agility", "luck"],
	[CharacterClass.thief]: ROGUE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.assassin]: ROGUE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.illusionist]: ["luck"],
	[CharacterClass.knight]: WARRIOR_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.pirate]: ["charisma", "agility"],
	[CharacterClass.ninja]: ROGUE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.corsair]: ["charisma", "luck"],
	[CharacterClass.necromancer]: MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.sculptor]: ["wisdom", "charisma"],
	[CharacterClass.summoner]: MAGE_LIKE_SECONDARY_ATTRIBUTES,
}
if (Object.keys(SECONDARY_STATS_BY_CLASS).length !== Enum.keys(CharacterClass).length)
	throw new Error(`${LIB}: SECONDARY_STATS_BY_CLASS is out of date!`)

/////////////////////////////////////////////////

function create(
	rng: RNGEngine,
	aa: Immutable<AdventureArchetype>,
	character: Immutable<CharacterState>,
	inventory: Immutable<InventoryState.State>,
	wallet: Immutable<WalletState.State>,
): ResolvedAdventure {
	const { hid, good, type, outcome } = aa

	const should_gain: OutcomeArchetype = {
		...outcome,
	}

	// instantiate the special gains
	if (should_gain.random_attribute) {
		const stat: keyof OutcomeArchetype = getꓽrandom.picker.of(ALL_ATTRIBUTES_X_LVL)(rng) as keyof OutcomeArchetype
		;(should_gain as any)[stat] = true
	}
	if (should_gain.lowest_attribute) {
		const lowest_stat: keyof OutcomeArchetype = ALL_ATTRIBUTES_X_LVL.reduce((acc, val) => {
			return (character.attributes as any)[acc] < (character.attributes as any)[val] ? acc : val
		}, "health") as keyof OutcomeArchetype
		;(should_gain as any)[lowest_stat] = true
	}
	if (should_gain.class_primary_attribute) {
		const stat: keyof OutcomeArchetype = getꓽrandom.picker.of(PRIMARY_STATS_BY_CLASS[character.klass]!)(
			rng,
		) as keyof OutcomeArchetype
		;(should_gain as any)[stat] = true
	}
	if (should_gain.class_secondary_attribute) {
		const stat: keyof OutcomeArchetype = getꓽrandom.picker.of(SECONDARY_STATS_BY_CLASS[character.klass]!)(
			rng,
		) as keyof OutcomeArchetype
		;(should_gain as any)[stat] = true
	}

	if (should_gain.armor_or_weapon) {
		// TODO take into account the existing inventory?
		if (getꓽrandom.generator_of.bool()(rng)) should_gain.armor = true
		else should_gain.weapon = true
	}
	if (should_gain.improvementⵧarmor_or_weapon) {
		if (is_weapon_at_max_enhancement(InventoryState.get_slotted_weapon(inventory)!))
			// most likely to happen
			should_gain.improvementⵧarmor = true
		else if (getꓽrandom.generator_of.bool()(rng)) should_gain.improvementⵧarmor = true
		else should_gain.improvementⵧweapon = true
	}

	// intermediate data
	const new_player_level = character.attributes.level + (should_gain.level ? 1 : 0)

	// TODO check multiple charac gain (should not happen)
	return {
		uuid: generate_uuid(),
		hid,
		good,
		encounter: type === AdventureType.fight ? create_monster(rng, { level: character.attributes.level }) : null,
		gains: {
			level: should_gain.level ? 1 : 0,
			health: should_gain.health ? 1 : 0,
			mana: should_gain.mana ? 1 : 0,
			strength: should_gain.strength ? 1 : 0,
			agility: should_gain.agility ? 1 : 0,
			charisma: should_gain.charisma ? 1 : 0,
			wisdom: should_gain.wisdom ? 1 : 0,
			luck: should_gain.luck ? 1 : 0,
			coin: generate_random_coin_gain_or_loss(rng, {
				range: should_gain.coin,
				player_level: new_player_level,
				current_wallet_amount: wallet.coin_count,
			}),
			token: should_gain.token ? 1 : 0,
			armor: should_gain.armor ? create_armor(rng) : null,
			weapon: should_gain.weapon ? create_weapon(rng) : null,
			improvementⵧarmor: should_gain.improvementⵧarmor,
			improvementⵧweapon: should_gain.improvementⵧweapon,
		},
	}
}

/////////////////////////////////////////////////

export { create }
