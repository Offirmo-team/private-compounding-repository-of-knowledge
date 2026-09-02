import type { RNGEngine } from "../../types.ts"

/////////////////////////////////////////////////

function getꓽRNGⵧMathᐧrandom(): RNGEngine {
	const engine: RNGEngine = {
		// @ts-expect-error TS2322: Type '() => false' is not assignable to type '() => this is PRNGEngine'
		is_prng() {
			return false
		},
		get_Int32() {
			return (Math.random() * 0x100_000_000) | 0
		},
	}
	return engine
}

/////////////////////////////////////////////////

export { getꓽRNGⵧMathᐧrandom }
