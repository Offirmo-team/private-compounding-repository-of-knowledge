/////////////////////////////////////////////////

export const EMAIL: Email‿str = "offirmo.net@gmail.com"

export const WEBSITE: Url‿str = "https://www.offirmo.net/"

// prettier-ignore
const SOCIAL_LINKⵧARTSTATION: SocialNetworkLink  = { network: 'artstation',  handle: 'Offirmo',   url: 'https://www.artstation.com/offirmo'   } satisfies SocialNetworkLink
const SOCIAL_LINKⵧGITHUB: SocialNetworkLink = {
	network: "github",
	handle: "Offirmo",
	url: "https://github.com/Offirmo",
} satisfies SocialNetworkLink
const SOCIAL_LINKⵧINSTAGRAM: SocialNetworkLink = {
	network: "instagram",
	handle: "offirmo",
	url: "https://www.instagram.com/offirmo",
} satisfies SocialNetworkLink
const SOCIAL_LINKⵧPRODUCTHUNT: SocialNetworkLink = {
	network: "producthunt",
	handle: "@offirmo",
	url: "https://www.producthunt.com/@offirmo",
} satisfies SocialNetworkLink
const SOCIAL_LINKⵧREDDIT: SocialNetworkLink = {
	network: "reddit",
	handle: "u/Offirmo",
	url: "https://www.reddit.com/user/Offirmo",
} satisfies SocialNetworkLink
const SOCIAL_LINKⵧTWITTER: SocialNetworkLink = {
	network: "twitter",
	handle: "Offirmo",
	url: "https://twitter.com/Offirmo",
} satisfies SocialNetworkLink

export const CREATOR: Creator = {
	name: "Offirmo",
	intro: "software engineer, open-source developer & creator",
	email: EMAIL,
	contact: "https://github.com/Offirmo/ama/issues",

	urlⵧcanonical: WEBSITE,

	urlsⵧsocial: [
		SOCIAL_LINKⵧARTSTATION,
		SOCIAL_LINKⵧGITHUB,
		SOCIAL_LINKⵧINSTAGRAM,
		SOCIAL_LINKⵧPRODUCTHUNT,
		SOCIAL_LINKⵧREDDIT,
		SOCIAL_LINKⵧTWITTER,
	],
}

/////////////////////////////////////////////////

import type { Creator, Email‿str, SocialNetworkLink, Url‿str } from "@monorepo-private/ts--types--hypermedia"
