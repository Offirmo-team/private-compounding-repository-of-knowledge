import type { WebPage } from "@web-property-outfitter/generator--website-entry-points"

import { AUTHOR } from "@monorepo-private/marketing--creator"
import type {
	Author,
	SocialNetworkLink,
	Url‿str,
	Thing,
	WithOnlinePresence,
	ThingWithOnlinePresence,
} from "@monorepo-private/ts--types--hypermedia"

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
	description: "Senior Dev Mental Models",
	author: AUTHOR,
	since‿y: 2026,
}

const SOCIAL_LINKⵧGITHUB: SocialNetworkLink = {
	network: "github",
	url: "https://github.com/Yvem/minisite--dev-mental-models",
}

const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://yvem.github.io/minisite--dev-mental-models/",
	urlsⵧsocial: [SOCIAL_LINKⵧGITHUB],
}

/////////////////////////////////////////////////
// May NOT be a website!!
// could be a store on amazon, a post on social media...
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,

	contact: "https://github.com/Yvem/minisite--dev-mental-models/issues",
}

/////////////////////////////////////////////////
// Ok now we're having a website

const WEBSITE: WebPage = {
	...THINGⵧONLINE,

	title: "Mental Models Dev",
	icon: {
		emoji: "💡",
		//svg: path.join(__dirname, './icon--rpg.svg'),
	},
	keywords: ["documentation"],
	content: {},
	features: [
		"cssⳇbox-layout--natural",
		//'cssⳇviewport--full',
		"normalize-url-trailing-slash",
		//'cssⳇframework--offirmo',
		"htmlⳇreact-root",
		//'page-loader--offirmo',
		//'analytics--google',
		//'site-verification--google',
	],

	/////// SOCIAL
	// TODO

	/////// POLISH
	colorⵧbackground: "white",
	colorⵧforeground: "black",
	colorⵧtheme: "#e5d8bd",
}

/////////////////////////////////////////////////

export { AUTHOR, WEBSITE }
