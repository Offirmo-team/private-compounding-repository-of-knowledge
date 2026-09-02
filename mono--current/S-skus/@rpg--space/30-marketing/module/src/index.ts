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

export { AUTHOR } from "@monorepo-private/marketing--creator"

const THING: Thing = {
	lang: "en",
	description: "Some Space RPG",
	author: AUTHOR,
	since‿y: 2026,
}
/*
const SOCIAL_LINKⵧGITHUB: SocialNetworkLink = {
	network: "github",
	url: "https://github.com/Yvem/minisite--dev-mental-models",
}
 */
const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://www.offirmo.net/minisite--github-pages-sandbox/",
	urlsⵧsocial: [],
}

/////////////////////////////////////////////////
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,
}

/////////////////////////////////////////////////
// Ok now we're having a website

export const WEBSITE: WebPage = {
	...THINGⵧONLINE,

	title: "Space RPG",
	icon: {
		emoji: "🌌",
	},
	keywords: ["game", "rpg"],
	content: {},

	/////// SOCIAL
	// TODO

	/////// POLISH
	colorⵧbackground: "black",
	colorⵧforeground: "white",
	colorⵧtheme: "#e5d8bd",
}

/////////////////////////////////////////////////

import type { WebPage } from "@web-property-outfitter/generator--website-entry-points"

import { AUTHOR } from "@monorepo-private/marketing--creator"
import type {
	SocialNetworkLink,
	Thing,
	WithOnlinePresence,
	ThingWithOnlinePresence,
} from "@monorepo-private/ts--types--hypermedia"
