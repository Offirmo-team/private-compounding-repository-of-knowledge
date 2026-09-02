import { assert } from "../embedded-deps/assert/index.ts"
import type { Immutable, Integer, PositiveInteger } from "../embedded-deps/types/index.ts"
import type { RNGEngine, UInt53 } from "../types.ts"

import { _getꓽgenerator_ofꓽconstant } from "./_internal.ts"
import type { RandomValueGenerator } from "./types.ts"

/////////////////////////////////////////////////

function getꓽrandom_generator_ofꓽintegerⵧbetween(min: Integer, max: Integer): RandomValueGenerator<Integer> {
	assert(Number.isInteger(min), `min should be an integer (${min})!`)
	assert(Number.isInteger(max), `max should be an integer (${max})!`)

	const possible_output_count = max - min + 1
	assert(possible_output_count >= 1, `range should be positive!`)
	assert(Number.isInteger(possible_output_count), `range should be an integer!`)

	if (possible_output_count === 1) return _getꓽgenerator_ofꓽconstant(min)

	// ok we have a range
	// WARNING properly downscaling into a range is NOT TRIVIAL
	// Cf. https://github.com/ckknight/random-js#how-does-randomjs-alleviate-these-problems

	// how many bits do we need at minimum to store this range?
	const bits_needed = Math.ceil(Math.log2(possible_output_count)) // https://en.wikipedia.org/wiki/Binary_logarithm
	// JS allows up to 53 bits integers
	assert(bits_needed <= 53, `Range error: JS only supports integers up to 53 bits!`)

	// While JS allows up to 32 bits integers,
	// binary operators only allows 32 bits
	// We decide to only support up to 32 bits so far
	// (not a hard limitation, 53 bits support could be added)
	assert(bits_needed <= 32, `Range error: this lib only supports range up to 32 bits!`)

	const mask = Math.pow(2, bits_needed) - 1

	/*console.log('generator', {
		min,
		max,
		possible_output_count,
		bits_needed,
		mask: Number(mask).toString(2),
	})*/
	return function _randomly_generateꓽintegerⵧcustom_range(engine: Immutable<RNGEngine>) {
		let available_bits: UInt53 = 0
		let available_bits_count: PositiveInteger = 0

		function _get_candidate_covering_the_range(): number {
			while (available_bits_count < bits_needed) {
				// shortcut!
				// since we get bits by batches of 32
				// and we don't allow more than 32 bits
				// it's easier to just refill the batch and discard the leftover
				const new_bits = engine.get_Int32() >>> 0 // turn the bits into positive representation. No change, just easier to follow in the debugger
				available_bits = new_bits
				available_bits_count = 32
				/*console.log('got new bits', {
					available_bits_count,
					xxxxxxxxxxxxxx: '44444444333333332222222211111111',
					new_bits______: Number(new_bits).toString(2),
					available_bits: Number(available_bits).toString(2),
					available_bits_: available_bits,
				})*/
			}

			const result = (available_bits & mask) >>> 0
			available_bits >>= bits_needed
			available_bits_count -= bits_needed

			/*console.log(`used ${bits_needed}`, {
				available_bits_count,
				xxxxxxxxxxxxxx: '44444444333333332222222211111111',
				available_bits: Number(available_bits).toString(2),
				available_bits_: available_bits,
			})*/

			return result
		}

		let candidate = 0
		let count = 0
		do {
			candidate = _get_candidate_covering_the_range()
			// if the candidate is above the range,
			// we need to re-draw with new bits.
			// otherwise the distribution would not be even.
			// ex. range 0-6 = 3 bits
			// if candidate = 7 we start over with new bits.
			//if (candidate >= range) console.log(`will loop #${count + 1} (range = ${range}, candidate=${candidate})`)
			count++
		} while (candidate >= possible_output_count)
		//console.log(`downrange needed #${count} loops. (range = ${range})`)

		return candidate + min
	}
}

function getꓽrandom_generator_ofꓽintegerⵧin_interval(interval: [Integer, Integer]): RandomValueGenerator<Integer> {
	return getꓽrandom_generator_ofꓽintegerⵧbetween(...interval)
}

function getꓽrandom_picker<T>(items: ReadonlyArray<T>): RandomValueGenerator<T> {
	const max_index = items.length - 1
	const generate_random_index = getꓽrandom_generator_ofꓽintegerⵧbetween(0, max_index)

	return function _randomly_pick_from_array(engine: Immutable<RNGEngine>) {
		let index = generate_random_index(engine)

		return items[index] as T
	}
}

/////////////////////////////////////////////////

export { getꓽrandom_generator_ofꓽintegerⵧbetween, getꓽrandom_generator_ofꓽintegerⵧin_interval, getꓽrandom_picker }
