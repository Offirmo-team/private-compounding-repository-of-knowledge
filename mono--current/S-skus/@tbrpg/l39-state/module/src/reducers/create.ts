/////////////////////

/////////////////////
import * as CodesState from "@oh-my-rpg/state--codes"
import * as EngagementState from "@oh-my-rpg/state--engagement"
import * as MetaState from "@oh-my-rpg/state--meta"
import * as PRNGState from "@oh-my-rpg/state--prng"
import { ItemQuality } from "@tbrpg/definitions"
import { type Armor, create as create_armor } from "@tbrpg/logic--armors"
import { type Weapon, create as create_weapon } from "@tbrpg/logic--weapons"
import * as AchievementsState from "@tbrpg/state--achievements"
import * as CharacterState from "@tbrpg/state--character"
import * as EnergyState from "@tbrpg/state--energy"
import * as InventoryState from "@tbrpg/state--inventory"
import * as WalletState from "@tbrpg/state--wallet"

import { assert_from, assert } from "@monorepo-private/assert"
import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"
import { type TimestampUTCMs, getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"
/////////////////////

import { SCHEMA_VERSION } from "../consts.ts"
import { type TBRSoftExecutionContext, getꓽSXC } from "../services/sxc.ts"
import { type State } from "../types.ts"

import { _refresh_achievements } from "./achievements/index.ts"
import { equip_item } from "./base.ts"
import { _receive_item, _ack_all_engagements } from "./internal.ts"

/////////////////////

const STARTING_WEAPON_SPEC: Immutable<Partial<Weapon>> = {
	base_hid: "spoon",
	qualifier1_hid: "used",
	qualifier2_hid: "noob",
	quality: ItemQuality.common,
	base_strength: 1,
}
const STARTING_ARMOR_SPEC: Immutable<Partial<Armor>> = {
	base_hid: "socks",
	qualifier1_hid: "used",
	qualifier2_hid: "noob",
	quality: ItemQuality.common,
	base_strength: 1,
}

interface CreateParams {
	now_ms?: TimestampUTCMs // will be inferred if not provided
	seed?: PRNGState.Seed // will be auto-seeded if not provided
}
function create(
	SXC?: TBRSoftExecutionContext,
	{ now_ms = getꓽUTC_timestamp‿ms(), seed }: CreateParams = {},
): Immutable<State> {
	//console.log('Create()', { now_ms, seed })
	return getꓽSXC(SXC).xTry("create", () => {
		const [u_state_energy, t_state_energy] = EnergyState.create(0) // T-state doesn't need current timestamp, update_to_now() will take care of it

		let state: Immutable<State> = {
			ⵙapp_id: "tbrpg",
			schema_version: SCHEMA_VERSION,
			last_user_investment_tms: now_ms,

			u_state: {
				schema_version: SCHEMA_VERSION,
				revision: 0,

				avatar: CharacterState.create(SXC),
				inventory: InventoryState.create(SXC),
				wallet: WalletState.add_amount(WalletState.create(), WalletState.Currency.coin, 1), // don't start empty so that a loss can happen
				prng: PRNGState.create(seed),
				energy: u_state_energy,
				engagement: EngagementState.create(SXC as any),
				codes: CodesState.create(SXC as any),
				progress: AchievementsState.create(SXC),
				meta: MetaState.create(),

				last_adventure: null,
			},
			t_state: {
				schema_version: SCHEMA_VERSION,
				revision: 0,
				timestamp_ms: t_state_energy.timestamp_ms,

				energy: t_state_energy,
			},
		}

		const rng = PRNGState.getꓽprng(state.u_state.prng)

		const starting_weapon = create_weapon(rng, STARTING_WEAPON_SPEC)
		state = _receive_item(state, starting_weapon)
		state = equip_item(state, { now_ms, uuid: starting_weapon.uuid })

		const starting_armor = create_armor(rng, STARTING_ARMOR_SPEC)
		state = _receive_item(state, starting_armor)
		state = equip_item(state, { now_ms, uuid: starting_armor.uuid })

		state = _refresh_achievements(state) // there are some initial achievements
		state = _ack_all_engagements(state) // clear engagements that may have been created by noisy initial achievements, distracting

		// now insert some relevant start engagements
		/* TODO review if it's the right place! Or should it be inferred instead?
		state = {
			...state,
			u_state: {
				...state.u_state,
				engagement: EngagementState.enqueue(state.u_state.engagement, {
					type: EngagementState.EngagementType.flow,
					key: EngagementKey['tip--first_play'],
				}),
			},
		}*/

		assert(state.u_state.prng.prng_state.call_count === 0, "prng never used yet")
		//state.prng = PRNGState.update_use_count(state.prng, rng)

		state = {
			...state,
			u_state: {
				...state.u_state,

				// to compensate sub-functions used during creation:
				revision: 0,
			},
		}

		// No, hurts the unit tests!
		//state = _update_to_now(state, now_ms)

		return enforceꓽimmutable<State>(state)
	})
}

// TODO review normally only useful for UTests
function re_seed(state: Immutable<State>, seed?: PRNGState.Seed): Immutable<State> {
	if (seed) {
		console.warn("TODO review manual seeding!") // unless UT we normally don't want a manual seed
		state = {
			...state,
			u_state: {
				...state.u_state,
				prng: PRNGState.set_seed(state.u_state.prng, seed),
				revision: state.u_state.revision + 1,
			},
		}
	} else {
		state = {
			...state,
			u_state: {
				...state.u_state,
				prng: PRNGState.auto_reseed(state.u_state.prng),
				revision: state.u_state.revision + 1,
			},
		}
	}

	return enforceꓽimmutable<State>(state)
}

/////////////////////

export { STARTING_WEAPON_SPEC, STARTING_ARMOR_SPEC, type CreateParams, create, re_seed }

/////////////////////
