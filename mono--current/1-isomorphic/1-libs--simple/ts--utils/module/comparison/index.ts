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
			throw new Error(`ts-utils.compare: unknown comparison operator "${operator}"!`)
	}
}

/////////////////////////////////////////////////

import type { Immutable } from "@monorepo-private/ts--types"
