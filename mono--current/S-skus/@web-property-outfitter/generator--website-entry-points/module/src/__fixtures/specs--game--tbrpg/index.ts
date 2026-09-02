import * as path from "node:path"
import { fileURLToPath } from "node:url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))

import { AUTHOR } from "@monorepo-private/marketing--creator"
import type {
	Thing,
	SocialNetworkLink,
	WithOnlinePresence,
	ThingWithOnlinePresence,
} from "@monorepo-private/ts--types--hypermedia"

import type { WebPage, WebPropertySpec } from "../.."

/////////////////////////////////////////////////
/*
WebPropertySpec
⇲ WebPage
	⇲ ThingWithOnlinePresence
		⇲ WithOnlinePresence
		⇲ Thing
			↳ Author
*/
/////////////////////////////////////////////////

const THING: Thing = {
	lang: "en",
	description: "(Browser game) The simplest RPG ever! (indie game, free to play, no account needed)",
	author: AUTHOR,
	since‿y: 2016,
}

const SOCIAL_LINKⵧREDDIT: SocialNetworkLink = {
	network: "reddit",
	handle: "r/boringrpg",
	url: "https://www.reddit.com/r/boringrpg/",
} satisfies SocialNetworkLink

const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://www.online-adventur.es/apps/the-boring-rpg/",
	urlsⵧsocial: [SOCIAL_LINKⵧREDDIT],
}
/*
license: 'UNLICENSED', // the source is open but the game itself is not
version: '0.69.1',
changelog: 'https://github.com/Offirmo/offirmo-monorepo/blob/main/stack--current/C-apps--clients/the-boring-rpg/client--browser/CHANGELOG.md',
source: 'https://github.com/Offirmo/offirmo-monorepo/tree/main/stack--current/C-apps--clients/the-boring-rpg/client--browser',
 */

/////////////////////////////////////////////////
// May NOT be a website!!
// could be a store on amazon, a post on social media...
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,

	contact: "https://github.com/Offirmo/offirmo-monorepo/issues",
}

/////////////////////////////////////////////////
// Ok now we're having a website

const WEBSITE: WebPage = {
	...THINGⵧONLINE,

	title: "The Boring RPG",
	icon: {
		emoji: "⚔️",
		svg: path.join(__dirname, "./icon--rpg.svg"),
	},
	keywords: ["game", "incremental", "fantasy", "rpg", "free", "indie"],
	content: {},
	features: [
		"cssⳇbox-layout--natural",
		"cssⳇviewport--full",
		"normalize-url-trailing-slash",
		"cssⳇframework--offirmo",
		"htmlⳇreact-root",
		"page-loader--offirmo",
		"analytics--google",
		//'site-verification--google',
	],

	/////// SOCIAL
	// TODO

	/////// POLISH
	colorⵧbackground: "hsl(337, 16%, 28%)",
	colorⵧforeground: "hsl(42, 100%, 87%)",
	colorⵧtheme: "hsl(248,  9%, 17%)",
}

/////////////////////////////////////////////////
const SPEC: WebPropertySpec = {
	...WEBSITE,
	...PRESETꘌappⵧimmersive,

	/////// PWA
	wantsꓽinstall: "promotion-capable",
	hasꓽown_navigation: true,
	supportsꓽscreensⵧwith_shape: true,
	canꓽuse_window_controls_overlay: true,
	usesꓽpull_to_refresh: false,

	/////// SRC
	// TODO refine

	/////// META
	isꓽpublic: false, // TODO
	isꓽdebug: true,
}

/////////////////////////////////////////////////

export { SPEC }
