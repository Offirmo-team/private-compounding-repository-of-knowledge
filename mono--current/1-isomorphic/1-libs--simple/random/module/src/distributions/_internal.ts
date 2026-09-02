import type { Immutable } from "../embedded-deps/types/index.ts"
import type { RNGEngine } from "../types.ts"

import type { RandomValueGenerator } from "./types.ts"

/////////////////////////////////////////////////

function _getꓽgenerator_ofꓽconstant<T>(c: T): RandomValueGenerator<T> {
	return function _generate_constant(engine: Immutable<RNGEngine>) {
		return c
	}
}

/////////////////////////////////////////////////

export { _getꓽgenerator_ofꓽconstant }
