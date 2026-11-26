/////////////////////////////////////////////////

const local_url = new URL("original.png?as=webp&width=1920", import.meta.url).href

const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://digitalmoons.itch.io/parallax-forest-background",
}

const THING: Thing = {
	caption: "Forest Background (Seamless Parallax)",
	creator: CREATOR,
	since‿y: 2020,
	urlⵧcanonical: ONLINE_PRESENCE.urlⵧcanonical,
}

const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,
}
const ASSET: Asset = {
	...THINGⵧONLINE,
	type: "imageⵧillustration",
	url: local_url,
	alt: "Misty blue forest trees",
	ai_involvement: "none",
}
registerꓽasset_usageⵧload(ASSET)

/////////////////////////////////////////////////

export const BG: Background = {
	asset: ASSET,
	width: 1920,
	height: 1080,
	//focusesⵧhorizontal: [ .38, .87 ], TODO
	//focusesⵧvertical: [ .01, .99 ],
}
export default BG

/////////////////////////////////////////////////

import { type Background } from "@monorepo-private/assets--background"
import {
	type Thing,
	type WithOnlinePresence,
	type ThingWithOnlinePresence,
	type Asset,
	registerꓽasset_usageⵧload,
} from "@monorepo-private/credits"
import CREATOR from "@monorepo-private/credits/authors/DigitalMoons"
