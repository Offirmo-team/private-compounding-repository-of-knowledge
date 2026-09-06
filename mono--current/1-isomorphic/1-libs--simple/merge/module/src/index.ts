/////////////////////////////////////////////////

// OWN implementation with our OWN semantic:
// - assuming undefined = unknown/missing => yielding to a previously defined value
// - assuming null is intentional => treat it like any other primitive type, does NOT yield to a previously defined value like undefined does
// - NOT creating copies unless active merge
// - if encountering different container types (except undefined / null) => throw; ex. an array and an object cannot be merged
// - arrays are merged with deduplication by value (===) = ~set
// - objects are expected to be PLAIN
export function mergeⵧdeep<T>(a: T | undefined, b: T | undefined): T {
	if (b === undefined) return a as T
	if (a === undefined) return b as T

	if (!haveCompatibleContainerTypes(a, b)) {
		throw new Error(`Cannot merge incompatible container types`)
	}

	if (Array.isArray(a) && Array.isArray(b)) return mergeⵧarrays(a, b) as T

	if (isꓽobjectⵧplain(a) && isꓽobjectⵧplain(b)) return mergeⵧobjects(a, b) as T

	// primitives: b wins
	// TODO review if we should prevent mismatched primitive types
	return b as T
}

function haveCompatibleContainerTypes(a: unknown, b: unknown): boolean {
	if (Array.isArray(a)) return Array.isArray(b) || b === null
	if (Array.isArray(b)) return Array.isArray(a) || a === null

	// order is important!
	if (isꓽobjectⵧplain(a)) return isꓽobjectⵧplain(b) || b === null
	if (isꓽobjectⵧplain(b)) return isꓽobjectⵧplain(a) || a === null

	// if still object, then not plain = unsupported
	if (isꓽobjectⵧdefined_non_array(a)) {
		throw new Error(`Cannot merge active record ${Object.getPrototypeOf(a)?.constructor?.name} Please check!`)
	}
	if (isꓽobjectⵧdefined_non_array(b)) {
		throw new Error(`Cannot merge active record ${Object.getPrototypeOf(a)?.constructor?.name} Please check!`)
	}
	/* previous implementation
	if (isꓽobjectⵧdefined_non_array(a)) return isꓽobjectⵧdefined_non_array(b) || b === null
	if (isꓽobjectⵧdefined_non_array(b)) return isꓽobjectⵧdefined_non_array(a) || a === null
	*/

	// assume not containers
	return true
}

function mergeⵧarrays(a: readonly unknown[], b: readonly unknown[]): unknown[] {
	const result = [...a]
	for (const item of b) {
		if (!result.includes(item)) {
			result.push(item)
		}
	}
	return result.sort() // since we're treating arrays as a set, why not sorting?
}

function mergeⵧobjects(a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> {
	const result = { ...a }
	for (const key of Object.keys(b)) {
		const bVal = b[key]

		if (bVal === undefined) continue

		const aVal = result[key]
		if (aVal === undefined) {
			result[key] = bVal
		} else {
			result[key] = mergeⵧdeep(aVal, bVal)
		}
	}
	return result
}

/////////////////////////////////////////////////

import { isꓽobjectⵧplain, isꓽobjectⵧdefined_non_array } from "@monorepo-private/type-detection"
