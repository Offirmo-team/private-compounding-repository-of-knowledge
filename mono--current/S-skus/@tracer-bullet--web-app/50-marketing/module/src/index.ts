/////////////////////////////////////////////////
/*
 WebPropertySpec
 ⇲ ThingWithOnlinePresence
   ⇲ WithOnlinePresence
 ⇲ WebPage
   ⇲ Thing
     ↳ Creator
*/
/////////////////////////////////////////////////

export const THINGⵧONLINE: ThingWithOnlinePresence = {
	urlⵧcanonical: "https://todo.example/", // TODO offirmo.net something
	title: "My Cool PWA",
	caption: "(PWA demo)",
	creator: CREATOR,
	since‿y: 2026,

	urlsⵧsocial: [
		// TODO 1D
	],

	// more specific than creator's one
	contact: "https://github.com/Offirmo-team/private-compounding-repository-of-knowledge/issues",
}

export const LANDING_PAGE: WebPage = {
	...THINGⵧONLINE,

	icon: {
		emoji: "🛠️",
	},
	keywords: ["demo"],
	content: {
		// see @/web-property
	},
	features: [
		// see @/web-property
	],

	/////// SOCIAL
	// TODO

	/////// PWA
	app_categories: ["entertainment", "utilities"],
	titleⵧapp: "My Cool App",
	captionⵧapp: "(Pinnable App Demo)",
	// see @/web-property for technical options

	/////// POLISH
	colorⵧbackground: "hsl(337, 16%, 28%)",
	colorⵧforeground: "hsl(42, 100%, 87%)",
	colorⵧtheme: "hsl(248,  9%, 17%)",
}

/////////////////////////////////////////////////

import type { WebPage, ThingWithOnlinePresence } from "@web-property-outfitter/spec"

import { CREATOR } from "@monorepo-private/marketing--creator"
