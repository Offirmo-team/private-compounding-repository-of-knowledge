/////////////////////

import { nanoid, customRandom, urlAlphabet } from "nanoid"

import { type RNGEngine, getꓽrandom_generator_ofꓽintegerⵧbetween } from "@monorepo-private/random"

import type { UUID } from "./types.ts"

/////////////////////////////////////////////////

const UUID_RADIX = "uu1"

const NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES = 21 // according to the doc

const UUID_LENGTH = UUID_RADIX.length + NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES

function generate_uuid({
	length = NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES,
	rng,
}: Readonly<{ length?: number; rng?: RNGEngine }> = {}): UUID {
	if (!rng) return UUID_RADIX + nanoid(length)

	const gen = getꓽrandom_generator_ofꓽintegerⵧbetween(0, 255)

	return (
		UUID_RADIX +
		customRandom(urlAlphabet, length, (size: number): Uint8Array => {
			//const result: number[] = []
			//for (let i = 0; i < size; i++) result.push(gen(rng!))
			return new Uint8Array(size).map(() => gen(rng!))
		})()
	)
}

/////////////////////////////////////////////////

export { UUID_LENGTH, generate_uuid }
