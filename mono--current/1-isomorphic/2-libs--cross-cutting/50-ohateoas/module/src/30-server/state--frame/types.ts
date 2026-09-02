import type { Immutable } from "@monorepo-private/ts--types"
import type { Url‿str } from "@monorepo-private/ts--types--hypermedia"

import type { OHAHyperMedia } from "../../01-types/index.ts"

/////////////////////////////////////////////////

/* REMINDER
 * this state is to accommodate both Terminal and React
 */
interface State {
	//session_start_tms: number
	//last_user_activity_tms: number

	// note: all urls should always be normalized, should always be relative

	// TODO review: SSoT: can be inferred from the representation?
	// Or needed in case the current representation doesn't have it?
	//urlⵧhome?: Url‿str // latest known recommended home (root if absent)
	//urlⵧup?: Url‿str // latest known recommended up (home if absent)

	urlⵧload: Url‿str // url we're loading or have loaded with no pending load
	reload_counter: number // for mutating this state on reload

	$representation: OHAHyperMedia | undefined // latest we got
	//urlⵧself: Url‿str | undefined // "self" advertised by the $representation. can be != load if the rsrc returns a different "self"

	status_msg: string

	// TODO one day
	//url_history: []
	//engagements: {}
}

/////////////////////////////////////////////////

export { type State }
