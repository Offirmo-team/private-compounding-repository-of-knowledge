/////////////////////////////////////////////////

const local_url = new URL("642502781_18071243444564673_4924519196731415003_n.jpg?as=webp", import.meta.url).href

/////////////////////////////////////////////////

const THING: Thing = {
	description: "Where Silence Orbits the Infinite",
	author: neon_dimensionss,
	since‿y: 2026,
}
const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://www.instagram.com/neon.dimensionss/p/DVdCM0_EpsG/",
}
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,
}
const ASSET: Asset = {
	...THINGⵧONLINE,

	type: "imageⵧillustration",
	url: local_url,
	alt: "Suspended in the quiet between galaxies, this colossal ringed citadel drifts like a crown forged for the cosmos. A towering central spire pierces the void, surrounded by rotating orbital corridors glowing in electric violet and deep cyan",

	ai_involvement: {
		generators: ["unknown_model"],
		level: "major",
	},
}

registerꓽasset_usageⵧload(ASSET)

/////////////////////////////////////////////////

export const BG: Background = {
	asset: ASSET,

	width: 1080,
	height: 1440,

	//focusesⵧhorizontal: [0.38, 0.87],
	//focusesⵧvertical: [0.01, 0.99],
}
export default BG

/////////////////////////////////////////////////

import { type Author, registerꓽasset_usageⵧload, type Url‿str } from "@monorepo-private/credits"
import type { Thing, WithOnlinePresence, ThingWithOnlinePresence, Asset } from "@monorepo-private/credits"
import neon_dimensionss from "@monorepo-private/credits/authors/neon.dimensionss"

import type { Background } from "../../../types.ts"
