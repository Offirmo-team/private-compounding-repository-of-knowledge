/* Type definition of an asset,
 * aiming at properly crediting the author(s)
 */

/////////////////////////////////////////////////

// for crediting. Rationale = one day, we may know which artist was used in the training data
// We are not re-using Author, those are not "authors"
interface AIModel {
	name: string
	version: SemVer | "unknown"
}

export interface Asset extends Thing {
	// to help with searching/displaying assets when giving credits
	type:
		| "image"
		| "imageⵧphoto"
		| "imageⵧillustration"
		| "imageⵧicon"
		| "imageⵧcursor"
		| "sound"
		| "soundⵧmusic"
		| "font"
		| "code"
	// TODO learning, inspiration... ?

	url: Url‿str

	alt: string // a textual description for clients who can't display

	co_authors?: Array<Creator>

	ai_involvement:
		| "none"
		| {
				generators?: Array<AIModel | "unknown_model">
				level:
					| "minor" // ex. author generated the base, then used AI to tweak
					| "major" // ex. generated the base, then author tweaked
		  }
}

/////////////////////////////////////////////////

import type { SemVer } from "@monorepo-private/ts--types"
import type { Url‿str, Thing, Creator } from "@monorepo-private/ts--types--hypermedia"
