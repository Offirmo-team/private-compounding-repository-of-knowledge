/* Common building blocks for the more advanced types.
 */

/////////////////////////////////////////////////

export interface WithLang {
	lang?: IETFLanguageType
}

export interface WithCharset {
	charset?: never // Nothing. I use utf-8 everywhere by default.
	// trivial to implement if needed.
}

export interface WithTitle {
	title?: string // Ex. "The Boring RPG" or "La Joconde"
}

/////////////////////////////////////////////////

import type { IETFLanguageType, Charset } from "@monorepo-private/ts--types"
