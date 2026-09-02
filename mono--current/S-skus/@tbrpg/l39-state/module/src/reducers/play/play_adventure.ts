/////////////////////

import * as PRNGState from "@oh-my-rpg/state--prng"
import { getꓽprng } from "@oh-my-rpg/state--prng"
import { create as instantiate_adventure_archetype } from "@tbrpg/logic--adventure--resolved"
import { type AdventureArchetype } from "@tbrpg/logic--adventures"
import { CharacterAttribute, CharacterClass } from "@tbrpg/state--character"
import { Enum } from "typescript-string-enums"

import { type Immutable } from "@monorepo-private/ts--types"

import { LIB } from "../../consts.ts"
import type { State } from "../../types.ts"
import {
	_receive_stat_increase,
	_receive_coins,
	_lose_coins,
	_receive_tokens,
	_receive_item,
	_enhance_an_armor,
	_enhance_a_weapon,
} from "../internal.ts"

/////////////////////

const ALL_ATTRIBUTES_X_LVL: Array<CharacterAttribute> = [
	"health",
	"mana",
	"strength",
	"agility",
	"charisma",
	"wisdom",
	"luck",
]

const WARRIOR_LIKE_PRIMARY_ATTRIBUTES: Array<CharacterAttribute> = ["strength"]
const ROGUE_LIKE_PRIMARY_ATTRIBUTES: Array<CharacterAttribute> = ["agility"]
const MAGE_LIKE_PRIMARY_ATTRIBUTES: Array<CharacterAttribute> = ["mana"]
const HYBRID_PALADIN_LIKE_PRIMARY_ATTRIBUTES: Array<CharacterAttribute> = ["strength", "mana"]

const PRIMARY_STATS_BY_CLASS: { [k: string]: Array<CharacterAttribute> } = {
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

const WARRIOR_LIKE_SECONDARY_ATTRIBUTES: Array<CharacterAttribute> = ["health"]
const ROGUE_LIKE_SECONDARY_ATTRIBUTES: Array<CharacterAttribute> = ["luck"]
const MAGE_LIKE_SECONDARY_ATTRIBUTES: Array<CharacterAttribute> = ["wisdom"]
const HYBRID_PALADIN_LIKE_SECONDARY_ATTRIBUTES: Array<CharacterAttribute> = ["health"]

const SECONDARY_STATS_BY_CLASS: { [k: string]: Array<CharacterAttribute> } = {
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

/////////////////////

function _play_adventure(state: Immutable<State>, aa: Immutable<AdventureArchetype>): Immutable<State> {
	const rng = getꓽprng(state.u_state.prng)

	const adventure = instantiate_adventure_archetype(
		rng,
		aa,
		state.u_state.avatar,
		state.u_state.inventory,
		state.u_state.wallet,
	)
	//console.log(adventure.hid, state.u_state.wallet)
	//console.log(adventure)

	const { gains: gained } = adventure

	let gain_count = 0
	let item_gain_count = 0

	if (gained.level) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.level)
	}
	if (gained.health) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.health, gained.health)
	}
	if (gained.mana) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.mana, gained.mana)
	}
	if (gained.strength) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.strength, gained.strength)
	}
	if (gained.agility) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.agility, gained.agility)
	}
	if (gained.charisma) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.charisma, gained.charisma)
	}
	if (gained.wisdom) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.wisdom, gained.wisdom)
	}
	if (gained.luck) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.luck, gained.luck)
	}

	if (gained.coin) {
		gain_count++
		if (gained.coin >= 0) state = _receive_coins(state, gained.coin)
		else state = _lose_coins(state, -gained.coin)
	}
	if (gained.token) {
		gain_count++
		state = _receive_tokens(state, gained.token)
	}

	if (gained.weapon) {
		gain_count++
		item_gain_count++
		//console.log('gained weapon')
		state = _receive_item(state, gained.weapon)
	}
	if (gained.armor) {
		gain_count++
		item_gain_count++
		//console.log('gained armor')
		state = _receive_item(state, gained.armor)
	}

	if (gained.improvementⵧweapon) {
		gain_count++
		state = _enhance_a_weapon(state)
	}

	if (gained.improvementⵧarmor) {
		gain_count++
		state = _enhance_an_armor(state)
	}

	if (aa.good && !gain_count) {
		//dumpꓽanyⵧprettified('Error NO gain!', {aa, adventure})
		throw new Error(`${LIB}: play_adventure() for "good click" hid "${aa.hid}" unexpectedly resulted in NO gains!`)
	}
	if (item_gain_count > 1) {
		//dumpꓽanyⵧprettified('Error 2x item gain!', {aa, adventure})
		throw new Error(
			`${LIB}: play_adventure() for hid "${aa.hid}" unexpectedly resulted in ${item_gain_count} item gains!`,
		)
	}

	state = {
		...state,
		u_state: {
			...state.u_state,
			last_adventure: adventure,
			prng: PRNGState.update_use_count(state.u_state.prng, rng, {
				// we can't know because it depends on the adventure,
				// ex. generate a random weapon
				I_swear_I_really_cant_know_whether_the_rng_was_used: true,
			}),
		},
	}

	return state
}

/////////////////////

export { _play_adventure }

/////////////////////
