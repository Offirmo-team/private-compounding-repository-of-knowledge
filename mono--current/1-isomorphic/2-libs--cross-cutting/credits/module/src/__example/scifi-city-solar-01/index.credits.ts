import {
	type Url‿str,
	type Thing,
	type WithOnlinePresence,
	type ThingWithOnlinePresence,
	type Asset,
	registerꓽasset_usageⵧload,
	_getꓽurl_tobind,
	_getꓽpath_tobind,
} from "@monorepo-private/credits"
import AUTHOR from "@monorepo-private/credits/authors/neon.dimensionss"

/////////////////////////////////////////////////

// https://parceljs.org/recipes/image/#image-formats
const url: Url‿str = new URL(
	"original.jpg?as=webp", // TODO how to generate variants? ex. small / big?
	import.meta.url,
).href

/////////////////////////////////////////////////

const THING: Thing = {
	description: "An AI generated cityscape.",
	author: AUTHOR,
	since‿y: 2024,
}
const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://www.instagram.com/neon.dimensionss/p/DCqF6liJYN2/",
}
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,
}
const ASSET: Asset = {
	...THINGⵧONLINE,
	type: "imageⵧillustration",
	url,
	alt: "A bright futuristic cityscape with cliffs and greenery.",

	ai_involvement: {
		generators: ["unknown"],
		level: "major",
	},
}

registerꓽasset_usageⵧload(ASSET)

/////////////////////////////////////////////////

const getꓽurl = _getꓽurl_tobind.bind(ASSET)
const getꓽpath = _getꓽpath_tobind.bind(ASSET)

export { getꓽurl, getꓽpath }
