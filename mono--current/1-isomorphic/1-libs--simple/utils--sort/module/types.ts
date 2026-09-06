/////////////////////////////////////////////////

// https://devdocs.io/javascript/global_objects/array/sort
// output:
// - A negative value indicates that a should come before b.
// - A positive value indicates that a should come after b.
// - Zero or NaN indicates that a and b are considered equal.
export type CompareFn<T> = (a: Immutable<T>, b: Immutable<T>) => number

// lower score = come before
export type ScorerFn<T> = (a: Immutable<T>) => number

export type ComparisonOrder = ">" | "<"

/////////////////////////////////////////////////

import type { Immutable } from "@monorepo-private/ts--types"
