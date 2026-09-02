// https://cimi.io/murmurhash3js-revisited/
// https://github.com/cimi/murmurhash3js-revisited
import * as _MurmurHash3_cjs from "murmurhash3js-revisited"

import { stringifyⵧstable } from "@monorepo-private/json-stable-stringify"

const MurmurHash3 = (_MurmurHash3_cjs as any).default

/////////////////////////////////////////////////

const MurmurHash = {
	v3: {
		x64ⵧ128: {
			hashꓽstring(str: string): string {
				const bytes = new TextEncoder().encode(str)
				return MurmurHash3.x64.hash128(bytes)
			},
			hashꓽobject(o: Readonly<any>): string {
				const str = stringifyⵧstable(o, { indent: null })
				const bytes = new TextEncoder().encode(str)
				return MurmurHash3.x64.hash128(bytes)
			},
		},
	},
}

/////////////////////////////////////////////////

export { MurmurHash }

export default MurmurHash
