/////////////////////////////////////////////////

const local_url = new URL("original.png?as=webp", import.meta.url).href

/////////////////////////////////////////////////

const THING: Thing = {
	description: "Sunny Sky",
	author: LisadiKaprio,
	since‿y: 2020,
}
const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://lisadikaprio.itch.io/sunny-and-rainy-skies-2-backgrounds",
}
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,
}
const ASSET: Asset = {
	...THINGⵧONLINE,

	type: "imageⵧillustration",
	url: local_url,
	alt: "a blue sunny sky with clouds",

	ai_involvement: "none",
}

registerꓽasset_usageⵧload(ASSET)

/////////////////////////////////////////////////

export const BG: Background = {
	asset: ASSET,

	width: 1800,
	height: 1350,

	//focusesⵧhorizontal: [0.38, 0.87],
	//focusesⵧvertical: [0.01, 0.99],
}
export default BG

/////////////////////////////////////////////////

import { type Author, registerꓽasset_usageⵧload, type Url‿str } from "@monorepo-private/credits"
import type { Thing, WithOnlinePresence, ThingWithOnlinePresence, Asset } from "@monorepo-private/credits"
import LisadiKaprio from "@monorepo-private/credits/authors/LisadiKaprio"

import { type Background } from "../../../types.ts"
