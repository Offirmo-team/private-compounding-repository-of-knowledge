/////////////////////

import { getꓽengine, type RNGEngine } from "@monorepo-private/random"

/////////////////////

function create(rng: RNGEngine): void {
	// TODO one day
}

/////////////////////

// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_shop(): void {
	const rng = getꓽengine.good_enough()
	return create(rng)
}

/////////////////////

export { generate_random_demo_shop, create }

/////////////////////
