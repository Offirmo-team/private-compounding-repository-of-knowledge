/////////////////////////////////////////////////

const local_url = new URL("original.png?as=webp&width=1920", import.meta.url).href

const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://www.offirmo.net/open-source/adventurers/index.html", // TODO broken
}

const THING: Thing = {
	caption: "Adventurers fantasy illustration",
	creator: CREATOR,
	since‿y: 2021,
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
	alt: "Fantasy adventurers party departing for epic adventures",
	ai_involvement: "none",
}
registerꓽasset_usageⵧload(ASSET)

/////////////////////////////////////////////////

export const BG: Background = {
	asset: ASSET,
	width: 1920,
	height: 1080,
	focusesⵧhorizontal: [0.38, 0.87],
	focusesⵧvertical: [0.01, 0.99],
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
import CREATOR from "@monorepo-private/credits/authors/AlbertWeand"
