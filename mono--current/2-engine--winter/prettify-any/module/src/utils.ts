/////////////////////////////////////////////////

// https://stackoverflow.com/a/51398944/587407
const COMPARABLE_TYPES = ["number", "string"]
function cmp<T>(a: T, b: T): number {
	const ta = typeof a
	const tb = typeof b
	if (ta !== tb) return cmp(ta, tb)

	if (!COMPARABLE_TYPES.includes(ta)) {
		// Very crude. mainly for symbols.
		return cmp(String(a), String(b))
	}

	return -(a < b) || +(a > b)
}

/////////////////////////////////////////////////

export { cmp }
