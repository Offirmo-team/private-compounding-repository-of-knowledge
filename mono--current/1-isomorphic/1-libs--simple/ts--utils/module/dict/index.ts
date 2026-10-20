/////////////////////////////////////////////////
// use case: declaring data once, in an array, then deriving a dict from it, with typed IDs

// Important: for the ids to be fully typed, pass a literal list:
//   flat_list_to_dict([ ... ] as const satisfies ReadonlyArray<Immutable<Entity>>)
// (plain `satisfies` without `as const` widens the ids back to string)
export function deriveꓽdictⵧfrom_flat_list<const T extends WithId>(arr: ReadonlyArray<T>): DictById<T> {
	const ǃ = assert_from({ deriveꓽdictⵧfrom_flat_list })

	const encountered_ids = new Set<string>()

	const dict = arr.reduce(
		(acc, item) => {
			const id = item.id
			ǃ.forⵧparam({ id }).require(!!id && typeof id === "string", "should be a non-null string")
			ǃ.forⵧparam({ id }).require(!encountered_ids.has(id), "should not repeat in the list")
			encountered_ids.add(id)

			acc[item.id] = item
			return acc
		},
		{} as Record<string, T>,
	)

	// a mapped type can't be built incrementally
	return dict as DictById<T>
}

export type DictById<T extends WithId> = string extends T["id"]
	? { [id: string]: T } // ids not known at compile time
	: { [Id in T["id"]]: Extract<T, { id: Id }> } // stronger typing

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import type { WithId } from "@monorepo-private/ts--types"
