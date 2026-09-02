/////////////////////////////////////////////////

export interface Thing extends WithLang, WithTitle {
	description: string // must be simple, a paragraph at most
	author: Author | undefined // undef = unknown :-(
	since‿y?: number // for copyright notice
	src?: Url‿str // if digital
}

/////////////////////////////////////////////////

import type { WithLang, WithTitle } from "../../00-base/types.ts"
import type { Url‿str } from "../../01-links/types.ts"
import type { Author } from "../20-author/types.ts"
