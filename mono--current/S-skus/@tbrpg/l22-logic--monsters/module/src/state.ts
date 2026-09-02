/////////////////////

import { MAX_LEVEL } from "@tbrpg/definitions"

import { getꓽrandom, type RNGEngine } from "@monorepo-private/random"

import { ENTRIES } from "./data/index.ts"
import { type Monster, MonsterRank } from "./types.ts"

/////////////////////

function pick_random_rank(rng: RNGEngine): MonsterRank {
	// out of 10 times: 1 boss, 2 elites, 7 common
	switch (getꓽrandom.generator_of.integer.between(1, 10)(rng)) {
		case 1:
			return MonsterRank.boss
		case 2:
		case 3:
			return MonsterRank.elite
		default:
			return MonsterRank.common
	}
}

/////////////////////

const MONSTER_RELATIVE_LEVEL_SPREAD = 0.1

function create(rng: RNGEngine, hints: Readonly<Partial<Monster>> = {}): Monster {
	const raw = hints.name
		? ENTRIES.find((raw_monster) => raw_monster.name === hints.name)
		: getꓽrandom.picker.of(ENTRIES)(rng)

	if (!raw) throw new Error(`OMR Monster create: can't find a monster corresponding to hint "${hints.name}"!`)

	let level = -1
	if (!hints.level) level = getꓽrandom.generator_of.integer.between(1, MAX_LEVEL)(rng)
	else {
		// stay close to the given level
		const reference_level = hints.level
		const variation = Math.round(Math.max(1, reference_level * MONSTER_RELATIVE_LEVEL_SPREAD))
		level = Math.max(
			1,
			Math.min(MAX_LEVEL, reference_level + getꓽrandom.generator_of.integer.between(-variation, variation)(rng)),
		)
	}

	return {
		name: raw.name,
		level,
		rank: hints.rank || pick_random_rank(rng),
		possible_emoji: hints.possible_emoji || raw.emoji,
	}
}

/////////////////////

export { create }

/////////////////////
