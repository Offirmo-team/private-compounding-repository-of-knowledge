/////////////////////////////////////////////////

export interface Thing extends WithLang, WithTitle {
	// [inherited] title?: ContentⳇTitle
	caption: ContentⳇCaption // especially important if not textual

	// [inherited] lang?: IETFLanguageType

	creator: Creator | undefined // undef = unknown

	since‿y?: number // for copyright notice
	urlⵧcanonical?: Url‿str // if digital
}

/////////////////////////////////////////////////

import type { ContentⳇCaption, WithLang, WithTitle } from "../../00-base/types.ts"
import type { Url‿str } from "../../01-links/types.ts"
import type { Creator } from "../20-creator/types.ts"
