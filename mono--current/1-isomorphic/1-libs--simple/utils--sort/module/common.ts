/////////////////////////////////////////////////

// "ordering" should seldom be used, the scorer should normally always do the trick
export function getꓽcompareFn<T>(to_score: ScorerFn<T>, ordering: ComparisonOrder = "<"): CompareFn<T> {
	return function compare(a: Immutable<T>, b: Immutable<T>): number {
		const index_a: number = to_score(a)
		if (typeof index_a !== "number" || isNaN(index_a))
			throw new Error("getꓽcompareFn(): to_score() should return a number")
		const index_b: number = to_score(b)
		if (typeof index_b !== "number" || isNaN(index_b))
			throw new Error("getꓽcompareFn(): to_score() should return a number")

		if (ordering === ">") return index_b - index_a

		// usual one, lower comes earlier
		return index_a - index_b
	}
}

// with multiple scorers ordered, taking into account the first one yielding a difference
export function getꓽcompareFnⵧcompose<T>(
	to_indexⵧordered: Array<ScorerFn<T>>,
	ordering: ComparisonOrder = "<",
): CompareFn<T> {
	return function compare(a: Immutable<T>, b: Immutable<T>): number {
		return to_indexⵧordered.reduce((acc, to_index) => {
			if (acc !== 0) return acc // already resolved

			const index_a: number = to_index(a)
			const index_b: number = to_index(b)

			if (ordering === ">") return index_b - index_a

			// usual one, lower comes earlier
			return index_a - index_b
		}, 0)
	}
}

/////////////////////////////////////////////////

import type { Immutable } from "@monorepo-private/ts--types"

import type { CompareFn, ComparisonOrder, ScorerFn } from "./types.ts"
