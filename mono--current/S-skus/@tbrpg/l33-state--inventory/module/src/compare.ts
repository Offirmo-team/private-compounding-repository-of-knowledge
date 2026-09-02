/////////////////////

import { type Item, InventorySlot, compareꓽitemsⵧby_slot } from "@tbrpg/definitions"
import { type Armor, compare_armors_by_potential } from "@tbrpg/logic--armors"
import { type Weapon, compare_weapons_by_potential } from "@tbrpg/logic--weapons"

import { LIB } from "./consts.ts"

/////////////////////

function compareꓽitemsⵧby_slot_then_strength(a: Readonly<Item>, b: Readonly<Item>): number {
	if (a.slot !== b.slot) return compareꓽitemsⵧby_slot(a, b)

	switch (a.slot) {
		case InventorySlot.armor: {
			const sort = compare_armors_by_potential(a as Armor, b as Armor)
			if (!Number.isInteger(sort)) throw new Error(`${LIB}: compare():  error sorting armors!`)
			return sort
		}
		case InventorySlot.weapon: {
			const sort = compare_weapons_by_potential(a as Weapon, b as Weapon)
			if (!Number.isInteger(sort)) throw new Error(`${LIB}: compare():  error sorting weapons!`)
			return sort
		}
		default:
			throw new Error(`${LIB}: compare(): unhandled item slot "${a.slot}"!`)
	}
}

/////////////////////

export { compareꓽitemsⵧby_slot_then_strength }

/////////////////////
