import { Enum } from "typescript-string-enums"

import { type BaseUState } from "@monorepo-private/offirmo-state"

/////////////////////

const Currency = Enum("coin", "token")
type Currency = Enum<typeof Currency> // eslint-disable-line no-redeclare

/////////////////////

interface State extends BaseUState {
	coin_count: number
	token_count: number
}

/////////////////////

export { Currency, type State }

/////////////////////
