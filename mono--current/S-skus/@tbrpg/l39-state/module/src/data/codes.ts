import { type CodeSpec, normalize_code, type State as CodesState } from "@oh-my-rpg/state--codes"

import { assert_from, assert } from "@monorepo-private/assert"
import { getꓽUTC_timestampⵧhuman_readable‿minutes } from "@monorepo-private/timestamps"
import { type Immutable } from "@monorepo-private/ts--types"

import { is_alpha, is_registered_alpha_player, getꓽavailable_energy‿float } from "../selectors/index.ts"
import { type State } from "../types.ts"

////////////

// TODO move data outside?

// for test only
const TEST_CODES: Immutable<{ [key: string]: Immutable<Partial<CodeSpec<State>>> }> = {
	TESTNOTIFS: {
		redeem_limit: null,
		is_redeemable: () => true,
	},

	TESTACH: {
		redeem_limit: null,
		is_redeemable: () => true,
	},

	REBORNX: {
		redeem_limit: null,
		is_redeemable: () => is_alpha(),
	},

	// see also DEV and NODEV in the-boring-rpg/client--browser/src/components/panels/meta/component.jsx
}

const ALPHA_CODES: Immutable<{ [key: string]: Immutable<Partial<CodeSpec<State>>> }> = {
	REBORN: {
		redeem_limit: null,
		is_redeemable: () => is_alpha(),
	},

	ALPHATWINK: {
		redeem_limit: 1,
		is_redeemable: () => is_alpha(),
	},
}

const POWER_CODES: Immutable<{ [key: string]: Immutable<Partial<CodeSpec<State>>> }> = {
	BORED: {
		redeem_limit: null,
		is_redeemable: (state: Immutable<State>, codes_state: Immutable<CodesState>) => {
			const has_energy_depleted = getꓽavailable_energy‿float(state.t_state) < 1
			if (!has_energy_depleted) return false

			if (!codes_state.redeemed_codes["BORED"]) return true

			const now_minutes = getꓽUTC_timestampⵧhuman_readable‿minutes()
			const last_redeem_date_minutes = codes_state.redeemed_codes["BORED"]!.last_redeem_date_minutes
			const is_same_day = now_minutes.slice(0, 8) === last_redeem_date_minutes.slice(0, 8)
			return !is_same_day
		},
	},

	// https://en.wikipedia.org/wiki/Colossal_Cave_Adventure
	XYZZY: {
		redeem_limit: null,
		is_redeemable: () => true,
	},
	PLUGH: {
		redeem_limit: null,
		is_redeemable: () => true,
	},
}

const RAW_CODES: Immutable<{ [key: string]: Immutable<Partial<CodeSpec<State>>> }> = {
	...TEST_CODES,
	...ALPHA_CODES,
	...POWER_CODES,
}

// TODO common mobile games codes VIP777 etc.

////////////

const ALL_CODESPECS: Immutable<CodeSpec<State>>[] = Object.keys(RAW_CODES).map((key) => {
	const { code, redeem_limit, is_redeemable } = RAW_CODES[key]!

	if (code) throw new Error(`Code entry "${key}" redundantly specifies a code!`) // it's taken from the key in this file
	assert(key === normalize_code(key), `Code entry "${key}" should have normalized form "${normalize_code(key)}"!`)
	assert(redeem_limit === null || typeof redeem_limit === "number", `redeem_limit should be null or an integer!`)
	assert(!!is_redeemable, `is_redeemable!`)

	return {
		code: key,
		redeem_limit,
		is_redeemable,
	} satisfies CodeSpec<State>
})

const CODE_SPECS_BY_KEY: { [key: string]: Immutable<CodeSpec<State>> } = ALL_CODESPECS.reduce(
	(acc, code_spec) => {
		acc[code_spec.code] = code_spec
		return acc
	},
	{} as { [key: string]: Immutable<CodeSpec<State>> },
)

////////////

export { CODE_SPECS_BY_KEY }
