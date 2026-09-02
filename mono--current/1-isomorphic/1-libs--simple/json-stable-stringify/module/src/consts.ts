/////////////////////////////////////////////////

// Default to a plain code-unit comparison rather than localeCompare():
// the whole point of this lib is a STABLE, deterministic output, but localeCompare()
// is locale/ICU-dependent so it can order the same keys differently across environments (and is slower).
export const default_cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)

export const CYCLES__REPLACEMENT_VALUE = "__cycle__"

export const CYCLES__ERROR_MESSAGE = "Converting circular structure to JSON"

export const NON_JSON__ERROR_MESSAGE = "Unexpected non-JSON node encountered!"

/////////////////////////////////////////////////
