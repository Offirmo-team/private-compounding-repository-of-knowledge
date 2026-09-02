// useful to activate the focus ring only when needed
// https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2

import { has_seenꓽkey_usageⵧtab } from "../l2-internal/_event-listeners.ts"

/////////////////////////////////////////////////

function usesꓽtab(): boolean | undefined {
	return has_seenꓽkey_usageⵧtab
}

/////////////////////////////////////////////////

export { usesꓽtab }

// TODO persist it lo LS if we detect it!
