import {
	type WebPage,
	type WebPropertySpec,
	//PRESETꘌblog,
} from "@web-property-outfitter/generator--website-entry-points"

import { AUTHOR } from "@monorepo-private/marketing--creator"
import type { Thing, WithOnlinePresence, ThingWithOnlinePresence } from "@monorepo-private/ts--types--hypermedia"

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
	description: "Offirmo’s personal blog about tech, software and gamedev…",
	author: AUTHOR,
	since‿y: 2016,
}

const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: AUTHOR.urlⵧcanonical,
	...(AUTHOR.urlsⵧsocial && { urlsⵧsocial: AUTHOR.urlsⵧsocial }),
}

/////////////////////////////////////////////////
// May NOT be a website!!
// could be a store on amazon, a post on social media...
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,

	contact: "https://github.com/Offirmo/offirmo.github.io/issues",
}

/////////////////////////////////////////////////
// Ok now we're having a website

const WEBPAGE: WebPage = {
	...THINGⵧONLINE,

	title: "Offirmo - Fullstack Developer",
	icon: { emoji: "👨‍💻" },
	keywords: ["engineer", "software", "fullstack", "developer", "open-source", "indie"],
	content: {
		// TODO
	},
	features: ["cssⳇbox-layout--natural", "normalize-url-trailing-slash", "cssⳇframework--offirmo"],

	/////// SOCIAL
	// TODO

	/////// PWA
	// (not a PWA)

	/////// POLISH
	colorⵧbackground: "hsl(337, 16%, 28%)",
	colorⵧforeground: "hsl(42, 100%, 87%)",
	colorⵧtheme: "hsl(248,  9%, 17%)",
}

/////////////////////////////////////////////////
const SPEC: WebPropertySpec = {
	...WEBPAGE,

	/////// SRC
	// TODO refine

	/////// META
	isꓽpublic: false, // XXX
	isꓽdebug: true,
}

/////////////////////////////////////////////////

export { SPEC }
