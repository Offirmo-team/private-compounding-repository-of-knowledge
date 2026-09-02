/////////////////////

import type { Immutable } from "@monorepo-private/ts--types"

import { LIB } from "./consts.ts"
import { type State } from "./types.ts"

/////////////////////

interface RegenerateParams {
	id: string
	generate: () => number | string
	state: Immutable<State>
	max_tries?: number
}
function regenerate_until_not_recently_encountered({ id, generate, state, max_tries }: RegenerateParams) {
	const recently_encountered = state.recently_encountered_by_id[id] || []

	// Intelligently computes a reasonable max_tries.
	// Best effort, we would need the complete generation range to come up with a proper number.
	max_tries = max_tries || Math.max(10, recently_encountered.length * 10)

	let generated = generate()
	let try_count = 1
	while (recently_encountered.includes(generated) && try_count < max_tries) {
		generated = generate()
		try_count++
	}

	if (try_count >= max_tries) {
		console.error(state)
		throw new Error(`${LIB}: regenerate_until_not_recently_encountered(): failed after maximum tries!`)
	}

	return generated
}

/////////////////////

export { type RegenerateParams, regenerate_until_not_recently_encountered }

/////////////////////
