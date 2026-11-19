/////////////////////////////////////////////////

export type ComparisonOperator = "===" | "!==" | ">" | ">=" | "<" | "<="

// for more semantic and easier field comparisons
// (NOT sorting, see @monorepo-private/utils--sort)
export function compare<T>(
	a: Immutable<T>,
	operator: ComparisonOperator,
	b: Immutable<T>,
	to_index: (val: Immutable<T>) => number,
): boolean {
	const index_a: number = to_index(a)
	const index_b: number = to_index(b)

	switch (operator) {
		case "===":
			return index_a === index_b
		case "!==":
			return index_a !== index_b
		case ">":
			return index_a > index_b
		case ">=":
			return index_a >= index_b
		case "<":
			return index_a < index_b
		case "<=":
			return index_a <= index_b
		default:
			assertⵧnever_reached({ operator })
	}
}

/////////////////////////////////////////////////

import { assertⵧnever_reached } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
