// ex sort { flow: 'main' } { flow: 'side' } against [ 'main', 'side' ]
export function getꓽcompareFnⵧby_resolved_enum<T>(
	key:
		| string // = attribute to dereference
		| ((val: Immutable<T>) => string), // generic resolver
	ordered_values: string[],
): CompareFn<T> {
	const ǃ = assert_from({ getꓽcompareFnⵧby_resolved_enum })

	function get_enum_value(val: Immutable<T>): string {
		if (typeof key === "string") {
			const index: string = (val as any)[key]
			ǃ.forⵧparam({ key }).require(
				typeof index === "string",
				"index dereferenced from [key] should always reference a string",
			)

			return index
		}

		const index = key(val)
		ǃ.forⵧparam({ key }).require(
			typeof index === "string",
			"index resolved from key() should always reference a string",
		)

		return index
	}

	function to_score(val: Immutable<T>): number {
		const key = get_enum_value(val)
		const index = ordered_values.indexOf(key)
		ǃ.forⵧvalue({ index }).ensure(index >= 0, "value was not found in the ordered enum list")

		return index
	}

	return getꓽcompareFn<T>(to_score)
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽcompareFn } from "./common.ts"
import type { CompareFn } from "./types.ts"
