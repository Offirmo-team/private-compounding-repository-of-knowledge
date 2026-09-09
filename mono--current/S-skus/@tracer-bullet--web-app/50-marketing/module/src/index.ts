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
	urlⵧcanonical: "https://todo.example/", // TODO
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
		// not the place
	},
	features: [
		// appearance
		"cssⳇbox-layout--natural",
		"cssⳇviewport--full",
		"cssⳇframework--offirmo",
		// technical
		"normalize-url-trailing-slash",
	],

	/////// SOCIAL

	/////// PWA
	app_categories: ["entertainment", "utilities"],
	wantsꓽinstall: "promotion-capable",
	titleⵧapp: "My Cool App",
	captionⵧapp: "(Pinnable App Demo)",
	hasꓽown_navigation: true,
	supportsꓽscreensⵧwith_shape: true,
	canꓽuse_window_controls_overlay: true,
	usesꓽpull_to_refresh: false, // TODO 1D because it's cool

	/////// POLISH
	colorⵧbackground: "hsl(337, 16%, 28%)",
	colorⵧforeground: "hsl(42, 100%, 87%)",
	colorⵧtheme: "hsl(248,  9%, 17%)",
}

/////////////////////////////////////////////////
import type { WebPage, ThingWithOnlinePresence } from "@web-property-outfitter/spec"

import { CREATOR } from "@monorepo-private/marketing--creator"
