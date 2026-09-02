import { type Armor } from "@tbrpg/logic--armors"
import { type Monster } from "@tbrpg/logic--monsters"
import { type Weapon } from "@tbrpg/logic--weapons"
import { Enum } from "typescript-string-enums"

import { type UUID } from "@monorepo-private/uuid"

/////////////////////////////////////////////////

// Note: matches @see AdventureArchetype['outcome']
const GainType = Enum(
	"level",
	"health",
	"mana",
	"strength",
	"agility",
	"charisma",
	"wisdom",
	"luck",
	"coin",
	"token",
	"weapon",
	"armor",
	"improvementⵧweapon",
	"improvementⵧarmor",
)
type GainType = Enum<typeof GainType> // eslint-disable-line no-redeclare

interface ResolvedAdventure {
	readonly uuid: UUID
	hid: string
	good: boolean
	encounter: Monster | null
	gains: {
		level: number
		health: number
		mana: number
		strength: number
		agility: number
		charisma: number
		wisdom: number
		luck: number
		coin: number
		token: number
		weapon: null | Weapon
		armor: null | Armor
		improvementⵧweapon: boolean
		improvementⵧarmor: boolean
	}
}

/////////////////////////////////////////////////

export { GainType, type ResolvedAdventure }

/////////////////////
