import { assert } from "../embedded-deps/assert/index.ts"
import type { Immutable, Percentage } from "../embedded-deps/types/index.ts"
import type { Int32, RNGEngine } from "../types.ts"

import { _getꓽgenerator_ofꓽconstant } from "./_internal.ts"
import type { RandomValueGenerator } from "./types.ts"

/////////////////////////////////////////////////

function _hasꓽlast_bitꘌ1(i: Int32): boolean {
	return (i & 1) === 1
}

function getꓽrandom_generator_ofꓽbool(): RandomValueGenerator<boolean> {
	return function _randomly_generateꓽbool(engine: Immutable<RNGEngine>) {
		return _hasꓽlast_bitꘌ1(engine.get_Int32())
	}
}

function getꓽrandom_generator_ofꓽboolⵧweighted(percentage: Percentage): RandomValueGenerator<boolean> {
	assert(percentage >= 0, "percentage should be >= 0")
	assert(percentage <= 1, "percentage should be <= 1")

	if (percentage === 0) return _getꓽgenerator_ofꓽconstant(false)
	if (percentage === 1) return _getꓽgenerator_ofꓽconstant(true)

	// scale the percentage to Int32
	// while not 100% precise, the precision should be plenty enough
	let scaled_percentageⵧ32bits = percentage * 0x1_0000_0000
	const is_scaled_percentageⵧ32bits_perfect = Number.isInteger(scaled_percentageⵧ32bits)
	if (!is_scaled_percentageⵧ32bits_perfect) {
		// In case the 32bits scaling doesn't fall on an integer,
		// the original library (random.js) used to scale to 53 bits = max possible in js
		// this was at the cost of speed, drawing 53bits being twice more costly (2x 32 bits)
		// and not always pertinent since irrational binary numbers may not benefit from a scaling to more bits
		// In this lib, we consider that a precision of 1/4_294_967_295 is plenty good enough!
		// TODO consider a warning if too close to 0 or 1?
		scaled_percentageⵧ32bits = Math.round(scaled_percentageⵧ32bits) // really needed?
	}

	const ceil = scaled_percentageⵧ32bits - 0x8000_0000 // convert to unsigned
	/*console.log({
		percentage,
		bounds: {
			min: -(2 ** 31 - 1),
			max: 2 ** 31 - 1,
		},
		scaled_percentageⵧ32bits,
		ceil,
	})*/
	return function _randomly_generateꓽboolⵧweighted(engine: Immutable<RNGEngine>) {
		const i = engine.get_Int32()
		return i < ceil
	}
}

/////////////////////////////////////////////////

export { getꓽrandom_generator_ofꓽbool, getꓽrandom_generator_ofꓽboolⵧweighted }
