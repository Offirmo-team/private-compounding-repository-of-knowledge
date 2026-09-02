/////////////////////////////////////////////////

// Own implementation with our own semantic:
// - assuming undefined = unknown/missing => yielding to a previously defined value
// - assuming null is intentional => treat it like any other primitive type, does NOT yield to a previousl defined value like undefined does
// - NOT creating copies unless active merge
// - if encountering different container types (except undefined / null) => throw; ex. an array and an object cannot be merged
// - arrays are merged with deduplication by value (===)
export function mergeⵧdeep<T>(a: T | undefined, b: T | undefined): T {
	if (b === undefined) return a as T
	if (a === undefined) return b as T

	if (!haveCompatibleContainerTypes(a, b)) {
		throw new Error(`Cannot merge incompatible container types`)
	}

	if (Array.isArray(a) && Array.isArray(b)) return mergeⵧarrays(a, b) as T

	if (isꓽobjectⵧkv(a) && isꓽobjectⵧkv(b)) return mergeⵧplainObjects(a, b) as T

	// primitives: b wins
	// TODO review if we should prevent mismatched primitive types
	return b as T
}

function haveCompatibleContainerTypes(a: unknown, b: unknown): boolean {
	if (Array.isArray(a)) return Array.isArray(b) || b === null
	if (Array.isArray(b)) return Array.isArray(a) || a === null

	// order is important!
	if (isꓽobjectⵧliteral(a)) return isꓽobjectⵧliteral(b) || b === null
	if (isꓽobjectⵧliteral(b)) return isꓽobjectⵧliteral(a) || a === null

	// we don't check for prototype (maybe later if use cases)
	if (isꓽobjectⵧkv(a)) return isꓽobjectⵧkv(b) || b === null
	if (isꓽobjectⵧkv(b)) return isꓽobjectⵧkv(a) || a === null

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

function mergeⵧplainObjects(a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> {
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

import { isꓽobjectⵧliteral, isꓽobjectⵧkv } from "@monorepo-private/type-detection"
