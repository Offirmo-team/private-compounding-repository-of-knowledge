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

export const THINGⵧONLINE: ThingWithOnlinePresence = {
	title: "Offirmo - Creator",
	caption: "Offirmo’s personal blog about tech, software and gamedev…",
	creator: CREATOR,
	since‿y: 2016,

	// personal website = using same urls as crator
	urlⵧcanonical: WEBSITE,
	...(CREATOR.urlsⵧsocial && { urlsⵧsocial: CREATOR.urlsⵧsocial }),

	// more specific than creator's one
	contact: "https://github.com/Offirmo/offirmo.github.io/issues",
}

export const WEBPAGE: WebPage = {
	...THINGⵧONLINE,

	icon: { emoji: "👨‍💻" },
	keywords: ["creator", "engineer", "software", "fullstack", "developer", "open-source", "indie"],
	content: {
		// TODO
	},
	features: ["cssⳇbox-layout--natural", "normalize-url-trailing-slash", "cssⳇframework--offirmo"],

	/////// SOCIAL
	// TODO full open graph type
	// TODO move to dedicated type
	//titleⵧsocial?: string;
	//descriptionⵧsocial?: string;

	/////// PWA
	// (not a PWA)

	/////// POLISH
	colorⵧbackground: "hsl(337, 16%, 28%)",
	colorⵧforeground: "hsl(42, 100%, 87%)",
	colorⵧtheme: "hsl(248,  9%, 17%)",
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// specific to hosting

export const SPECⵧprod: WebPropertySpec = {
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

/////////////////////////////////////////////////
import type { FeatureSnippets } from "@web-property-outfitter/generator--html"
import { type WebPage, type WebPropertySpec } from "@web-property-outfitter/generator--website-entry-points"

import { CREATOR, WEBSITE } from "@monorepo-private/marketing--creator"
import type {
	ThingWithOnlinePresence,
	Contentⳇweb,
	ContentⳇTitle,
	ContentⳇCaption,
	CssⳇColor‿str,
} from "@monorepo-private/ts--types--hypermedia"

import type { IconSet, WebAppCategory } from "../../types.ts"
