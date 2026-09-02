// local assertion to avoid dependencies
// inspired by https://github.com/alexreardon/tiny-invariant

const _ASSERTION_PREFIX: string = "Invariant failed"

export function assert(condition: any, message: string): asserts condition {
	if (condition) return

	throw new Error(`${_ASSERTION_PREFIX}: ${message}`)
}
