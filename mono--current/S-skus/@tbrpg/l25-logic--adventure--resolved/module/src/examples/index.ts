import { DEMO_MONSTER_01 } from "@tbrpg/logic--monsters"
import { DEMO_WEAPON_1 } from "@tbrpg/logic--weapons"

import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { type ResolvedAdventure } from "../types.ts"

/////////////////////////////////////////////////

// needed to test migrations, both here and in composing parents

// with skill gain
const DEMO_ADVENTURE_01: Immutable<ResolvedAdventure> = enforceꓽimmutable<ResolvedAdventure>({
	hid: "fight_lost_any",
	uuid: "uu1~example~adventure~01",
	good: true,
	encounter: DEMO_MONSTER_01,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 1,
		coin: 0,
		token: 0,
		armor: null,
		weapon: null,
		improvementⵧarmor: false,
		improvementⵧweapon: false,
	},
})
// with coin gain
const DEMO_ADVENTURE_02: Immutable<ResolvedAdventure> = enforceꓽimmutable<ResolvedAdventure>({
	hid: "dying_man",
	uuid: "uu1~example~adventure~02",
	good: true,
	encounter: null,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 0,
		coin: 1234,
		token: 0,
		weapon: null,
		armor: null,
		improvementⵧweapon: false,
		improvementⵧarmor: false,
	},
})
// with loot gain
const DEMO_ADVENTURE_03: Immutable<ResolvedAdventure> = enforceꓽimmutable<ResolvedAdventure>({
	hid: "rare_goods_seller",
	uuid: "uu1~example~adventure~03",
	good: true,
	encounter: null,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 0,
		coin: 0,
		token: 0,
		weapon: DEMO_WEAPON_1,
		armor: null,
		improvementⵧweapon: false,
		improvementⵧarmor: false,
	},
})
// with weapon enhancement gain
const DEMO_ADVENTURE_04: Immutable<ResolvedAdventure> = enforceꓽimmutable<ResolvedAdventure>({
	hid: "princess",
	uuid: "uu1~example~adventure~04",
	good: true,
	encounter: null,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 0,
		coin: 123,
		token: 0,
		weapon: null,
		armor: null,
		improvementⵧweapon: false,
		improvementⵧarmor: true,
	},
})

/////////////////////////////////////////////////

export { DEMO_ADVENTURE_01, DEMO_ADVENTURE_02, DEMO_ADVENTURE_03, DEMO_ADVENTURE_04 }
