import type { Immutable } from "../embedded-deps/types/index.ts"
import type { RNGEngine } from "../types.ts"

/////////////////////////////////////////////////

type RandomValueGenerator<V> = (engine: Immutable<RNGEngine>) => V

/////////////////////////////////////////////////

export { type RandomValueGenerator }
