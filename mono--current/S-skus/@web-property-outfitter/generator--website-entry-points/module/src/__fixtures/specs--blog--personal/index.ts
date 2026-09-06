import type { FeatureSnippets } from "@web-property-outfitter/generator--html"
import {
	type WebPage,
	type WebPropertySpec,
	//PRESETꘌblog,
} from "@web-property-outfitter/generator--website-entry-points"

import { CREATOR, WEBSITE } from "@monorepo-private/marketing--creator"
import type { Basename } from "@monorepo-private/ts--types"
import type {
	Thing,
	WithOnlinePresence,
	ThingWithOnlinePresence,
	Contentⳇweb,
	ContentⳇTitle,
	ContentⳇCaption,
	CssⳇColor‿str,
} from "@monorepo-private/ts--types--hypermedia"

import type { IconSet, WebAppCategory } from "../../types.ts"

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
const THINGⵧONLINE: ThingWithOnlinePresence = {
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

const WEBPAGE: WebPage = {
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

const SPECⵧprod: WebPropertySpec = {
	...WEBPAGE,

	host: "github-pages",
	env: "production",

	/////// META
}

const SPECⵧpreprod: WebPropertySpec = {
	...SPECⵧprod,

	host: "github-pages",
	env: "production",

	/////// META
	isꓽpublic: false,
	isꓽdebug: false,
}

const SPECⵧnightly: WebPropertySpec = {
	...SPECⵧprod,

	host: "github-pages",
	env: "development",

	/////// META
	isꓽpublic: false,
	isꓽdebug: true,
}

/////////////////////////////////////////////////

export { SPECⵧprod, SPECⵧpreprod, SPECⵧnightly }
