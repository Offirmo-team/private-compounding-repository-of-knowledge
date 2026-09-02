/////////////////////////////////////////////////

const local_url = new URL("original.png?as=webp&width=1920", import.meta.url).href

export const BG: Background = {
	url: local_url,
	width: 1920,
	height: 1080,
	focusesⵧhorizontal: [0.38, 0.87],
	focusesⵧvertical: [0.01, 0.99],
}
export default BG

/////////////////////////////////////////////////

const THING: Thing = {
	description: "Adventurers fantasy illustration",
	author: AUTHOR,
	since‿y: 2021,
}
const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://www.offirmo.net/open-source/adventurers/index.html", // TODO broken
}
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,
}
const ASSET: Asset = {
	...THINGⵧONLINE,
	type: "background",
	local_url,
}

registerꓽasset_usageⵧload(ASSET)

/////////////////////////////////////////////////

import {
	type Thing,
	type WithOnlinePresence,
	type ThingWithOnlinePresence,
	type Asset,
	registerꓽasset_usageⵧload,
} from "@monorepo-private/credits"
import AUTHOR from "@monorepo-private/credits/authors/AlbertWeand"

import { type Background } from "../../../types.ts"
