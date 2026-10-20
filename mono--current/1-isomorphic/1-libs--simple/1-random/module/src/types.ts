// RNG = Random Number Generator
// PRNG = Pseudorandom Number Generator https://en.wikipedia.org/wiki/Pseudorandom_number_generator

import type { Immutable, PositiveInteger } from "./embedded-deps/types/index.ts"

/////////////////////////////////////////////////

type Int8 = number
type Int32 = number
type Int53 = number
type UInt53 = number // 53bits = MAX_SAFE_INTEGER cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
type Seed = ReadonlyArray<number> | number | string

interface RNGEngine {
	get_Int32(): Int32

	is_prng(/*this: RNGEngine | PRNGEngine*/): this is PRNGEngine // whether this engine is a pseudo-RNG
}

interface PRNGState {
	algorithm_id?: "ISAAC32" | "MT19937"
	seed: Seed
	call_count: PositiveInteger
}

// for convenience, the setters return 'this' to allow fluid chaining
interface PRNGEngine extends RNGEngine {
	seed(seed: Seed): PRNGEngine
	discard(call_count: PositiveInteger): PRNGEngine

	// set/get both seed + call_count
	set_state(state: Immutable<PRNGState>): PRNGEngine
	get_state(): PRNGState
}

/*
export interface ImmutableRNGEngine {
	get_Int32(): { i: Int32, next_engine: ImmutableRNGEngine }

	is_prng(): this is ImmutablePRNGEngine // whether this engine is a pseudo-RNG
}
export interface ImmutablePRNGEngine extends ImmutableRNGEngine {
	get_Int32(): { i: Int32, next_engine: ImmutablePRNGEngine }

	seed(seed: Seed): ImmutablePRNGEngine
	// seedⵧauto(p: unknown) // TODO work out the params

	set_state(seed: Seed, call_count: Integer): ImmutablePRNGEngine
	get_state(): {seed: Seed, call_count: Integer}
}
*/

/////////////////////////////////////////////////

export { type Int8, type Int32, type Int53, type UInt53, type Seed, type RNGEngine, type PRNGState, type PRNGEngine }
