/* Type definition of an asset,
 * aiming at properly crediting the author(s)
 */

import type { SemVer } from "@monorepo-private/ts--types"
import type { Url‿str, Thing, Author } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////
/* Reminder:
ThingWithOnlinePresence
	↳ contact?: Url‿str // if not provided, default to author's Ideally should be a "contact center" https://docs.aws.amazon.com/connect/latest/adminguide/connect-concepts.html
	↳ contactⵧsecurity?: Url‿str // if not provided, default to contact
	↳ contactⵧsupport?: Url‿str // if not provided, default to contact
	⇲ WithOnlinePresence
		↳ urlⵧcanonical: Url‿str
		↳ urlsⵧsocial?: SocialNetworkLink[]
	⇲ Thing
		↳ lang?: IETFLanguageType
		↳ description: string // must be simple, a paragraph at most
		↳ author: Author | undefined // undef = unknown :-(
			↳ name: string
			↳ intro?: string // very short intro. TODO refine
			↳ email?: Email‿str
			↳ contact?: Url‿str // should NOT duplicate email
		↳ since‿y?: number // for copyright notice

const AUTHOR = {
	name: 'Offirmo',
	intro: 'software engineer, open-source developer & creator',
	email: EMAIL,
	contact: ...
	urlⵧcanonical: WEBSITE,
	urlsⵧsocial: [SOCIAL_LINKⵧARTSTATION, SOCIAL_LINKⵧGITHUB, SOCIAL_LINKⵧINSTAGRAM, SOCIAL_LINKⵧPRODUCTHUNT, SOCIAL_LINKⵧREDDIT, SOCIAL_LINKⵧTWITTER],
}
const THING: Thing = {
	description: 'The Boring RPG',
	author: AUTHOR,
	since‿y: 2016,
}
const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: 'https://www.online-adventur.es/apps/the-boring-rpg/',
	...(AUTHOR.urlsⵧsocial && {urlsⵧsocial: AUTHOR.urlsⵧsocial}),
}
/////////////////////////////////////////////////
// May NOT be a website!!
// could be a store on amazon, a post on social media...
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,

	contact: 'https://github.com/Offirmo/offirmo-monorepo/issues',
}
*/

// for crediting. Rationale = one day, we may know which artist was used in the training data
// We are not re-using Author, those are not "authors"
interface AIModel {
	name: string
	version: SemVer | "unknown"
}

interface Asset extends Thing {
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

	co_authors?: Array<Author>

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

export { type Asset }
