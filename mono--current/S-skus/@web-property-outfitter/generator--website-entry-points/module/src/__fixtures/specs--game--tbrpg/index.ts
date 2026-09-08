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
// Ok the thing IS a website

const SOCIAL_LINKⵧREDDIT: SocialNetworkLink = {
	network: "reddit",
	handle: "r/boringrpg",
	url: "https://www.reddit.com/r/boringrpg/",
} satisfies SocialNetworkLink

export const THINGⵧONLINE: ThingWithOnlinePresence = {
	urlⵧcanonical: "https://www.online-adventur.es/apps/the-boring-rpg/",
	title: "The Boring RPG",
	caption: "(Browser game) The simplest RPG ever! (indie game, free to play, no account needed)",
	creator: CREATOR,
	since‿y: 2016,

	urlsⵧsocial: [SOCIAL_LINKⵧREDDIT],

	// more specific than creator's one
	contact: "https://github.com/Offirmo/offirmo-monorepo/issues",
}

/* TODO
license: 'UNLICENSED', // the source is open but the game itself is not
version: '0.69.1',
changelog: 'https://github.com/Offirmo/offirmo-monorepo/blob/main/stack--current/C-apps--clients/the-boring-rpg/client--browser/CHANGELOG.md',
source: 'https://github.com/Offirmo/offirmo-monorepo/tree/main/stack--current/C-apps--clients/the-boring-rpg/client--browser',
 */

export const WEBPAGE: WebPage = {
	...THINGⵧONLINE,

	icon: {
		emoji: "⚔️",
		svg: NodePath.join(__dirname, "./icon.svg"),
	},
	keywords: ["game", "incremental", "fantasy", "rpg", "free", "indie"],
	content: {
		// TODO
	},
	features: [
		"cssⳇbox-layout--natural",
		"cssⳇviewport--full", // this
		"normalize-url-trailing-slash",
		"cssⳇframework--offirmo",
		"htmlⳇreact-root",
		"page-loader--offirmo",
		"analytics--google",
		//'site-verification--google',
	],

	/////// SOCIAL
	// TODO full open graph type
	// TODO move to dedicated type
	//titleⵧsocial?: string;
	//descriptionⵧsocial?: string;

	/////// PWA
	app_categories: ["games"],
	wantsꓽinstall: "promotion-capable",
	titleⵧapp: "Boring RPG", // slightly smaller
	captionⵧapp: "The simplest RPG ever!",
	hasꓽown_navigation: true,
	supportsꓽscreensⵧwith_shape: true,
	canꓽuse_window_controls_overlay: true,
	usesꓽpull_to_refresh: false,

	/////// POLISH
	colorⵧbackground: "hsl(337, 16%, 28%)",
	colorⵧforeground: "hsl(42, 100%, 87%)",
	colorⵧtheme: "hsl(248,  9%, 17%)",
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// specific to hosting

export const SPECⵧprod: WebPropertySpec = {
	...THINGⵧONLINE, // for types
	...WEBPAGE,

	host: "github-pages",
	env: "production",

	/////// META
}

export const SPECⵧpreprod: WebPropertySpec = {
	...SPECⵧprod,

	host: "github-pages",
	env: "production",

	/////// META
	isꓽpublic: false,
	isꓽdebug: false,
}

export const SPECⵧnightly: WebPropertySpec = {
	...SPECⵧprod,

	host: "github-pages",
	env: "development",

	/////// META
	isꓽpublic: false,
	isꓽdebug: true,
}

import * as NodePath from "node:path"

/////////////////////////////////////////////////
import type { FeatureSnippets } from "@web-property-outfitter/generator--html"
import type {
	WebPage,
	WebPropertySpec,
	SocialNetworkLink,
} from "@web-property-outfitter/generator--website-entry-points"

import { CREATOR } from "@monorepo-private/marketing--creator"
import type {
	ThingWithOnlinePresence,
	Contentⳇweb,
	ContentⳇTitle,
	ContentⳇCaption,
	CssⳇColor‿str,
} from "@monorepo-private/ts--types--hypermedia"

import type { IconSet, WebAppCategory } from "../../types.ts"
