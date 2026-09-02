/////////////////////

import { Enum } from "typescript-string-enums"

import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"

import { LIB, SCHEMA_VERSION } from "./consts.ts"
import { type TBRSoftExecutionContext, getꓽSXC } from "./sxc.ts"
import { CharacterAttribute, CharacterClass, type CharacterAttributes, type State } from "./types.ts"

/////////////////////

const DEFAULT_AVATAR_NAME = "[new player]"
const CHARACTER_ATTRIBUTES = Enum.keys(CharacterAttribute)
const CHARACTER_ATTRIBUTES_SORTED: Readonly<CharacterAttribute>[] = [
	"level",
	"health",
	"mana",
	"strength",
	"agility",
	"charisma",
	"wisdom",
	"luck",
]

getꓽSXC().xTry("boot checks", () => {
	if (CHARACTER_ATTRIBUTES.length !== CHARACTER_ATTRIBUTES_SORTED.length)
		throw new Error(`${LIB}: CHARACTER_ATTRIBUTES to update!`)
})

const CHARACTER_CLASSES = Enum.keys(CharacterClass)

///////

function create(SXC?: TBRSoftExecutionContext): Immutable<State> {
	return getꓽSXC(SXC).xTry("create", () => {
		return enforceꓽimmutable<State>({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			name: DEFAULT_AVATAR_NAME,
			klass: CharacterClass.novice,
			attributes: {
				level: 1,

				// TODO improve this one day
				health: 1,
				mana: 0,

				strength: 1,
				agility: 1,
				charisma: 1,
				wisdom: 1,
				luck: 1,
			},
		})
	})
}

/////////////////////

function rename(SXC: TBRSoftExecutionContext, state: Immutable<State>, new_name: string): Immutable<State> {
	return getꓽSXC(SXC).xTry("rename", () => {
		// TODO name normalization
		if (!new_name) throw new Error(`${LIB}: Error while renaming to "${new_name}": invalid target value!`) // TODO details
		if (new_name === state.name) return state

		return enforceꓽimmutable<State>({
			...state,
			name: new_name,
			revision: state.revision + 1,
		})
	})
}

function switch_class(SXC: TBRSoftExecutionContext, state: Immutable<State>, klass: CharacterClass): Immutable<State> {
	return getꓽSXC(SXC).xTry("switch_class", () => {
		if (klass === state.klass) return state

		if (!Enum.isType(CharacterClass, klass)) throw new Error(`${LIB}: "${klass}" is not a valid class!`)

		return enforceꓽimmutable<State>({
			...state,
			klass,
			revision: state.revision + 1,
		})
	})
}

function increase_stat(
	SXC: TBRSoftExecutionContext,
	state: Immutable<State>,
	stat: CharacterAttribute,
	amount = 1,
): Immutable<State> {
	return getꓽSXC(SXC).xTry("increase_stat", () => {
		if (amount <= 0) throw new Error(`${LIB}: Error while increasing stat "${stat}": invalid amount!`) // TODO details

		// TODO stats caps?

		return enforceꓽimmutable<State>({
			...state,
			attributes: {
				...state.attributes,
				[stat]: state.attributes[stat] + amount,
			},
			revision: state.revision + 1,
		})
	})
}

/////////////////////

export {
	CharacterAttribute,
	CharacterClass,
	type CharacterAttributes,
	type State,
	DEFAULT_AVATAR_NAME,
	CHARACTER_ATTRIBUTES,
	CHARACTER_ATTRIBUTES_SORTED,
	CHARACTER_CLASSES,
	create,
	rename,
	switch_class,
	increase_stat,
}

/////////////////////
