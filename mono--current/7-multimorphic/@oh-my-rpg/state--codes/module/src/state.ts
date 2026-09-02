import { type Immutable, enforceꓽimmutable } from "@monorepo-private/state-utils"
import { getꓽUTC_timestampⵧhuman_readable‿minutes } from "@monorepo-private/timestamps"

import { SCHEMA_VERSION } from "./consts.ts"
import { type SoftExecutionContext, getꓽSXC } from "./sec.ts"
import { is_code_redeemable } from "./selectors.ts"
import type { CodeSpec, CodeRedemption, State } from "./types.ts"

/////////////////////

function create(SXC?: SoftExecutionContext): Immutable<State> {
	return getꓽSXC(SXC).xTry("create", () => {
		return enforceꓽimmutable<State>({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			redeemed_codes: {},
		})
	})
}

/////////////////////

function attempt_to_redeem_code<T>(
	state: Immutable<State>,
	code_spec: Immutable<CodeSpec<T>>,
	infos: Immutable<T>,
): Immutable<State> {
	return getꓽSXC().xTry("redeem_code", (): Immutable<State> => {
		if (!is_code_redeemable(state, code_spec, infos))
			throw new Error("This code is either non-existing or non redeemable at the moment!")

		const code = code_spec.code

		const r: CodeRedemption =
			state.redeemed_codes[code] ||
			({
				redeem_count: 0,
				last_redeem_date_minutes: "",
			} as CodeRedemption)

		return enforceꓽimmutable<State>({
			...state,

			redeemed_codes: {
				...state.redeemed_codes,
				[code]: {
					...r,
					redeem_count: r.redeem_count + 1,
					last_redeem_date_minutes: getꓽUTC_timestampⵧhuman_readable‿minutes(),
				},
			},

			revision: state.revision + 1,
		})
	})
}

/////////////////////

export { create, attempt_to_redeem_code }

/////////////////////
