/////////////////////////////////////////////////

// Gotcha: already-frozen objects are assumed to be deep-frozen and are NOT traversed.
// = cheap re-freeze of a state made of already-frozen sub-states + safe on reference cycles
// BUT a shallow-frozen object (Object.freeze) with mutable children stays partially mutable.
export function freezeⵧdeep<T>(value: T): T {
	if (!_isꓽobjectⵧnon_null(value)) return value
	if (Object.isFrozen(value)) return value

	Object.freeze(value) // BEFORE recursing, to stop on reference cycles
	Object.values(value).forEach(freezeⵧdeep)

	return value
}

// arrays included, functions excluded
function _isꓽobjectⵧnon_null(value: unknown): value is object {
	return typeof value === "object" && value !== null
}
