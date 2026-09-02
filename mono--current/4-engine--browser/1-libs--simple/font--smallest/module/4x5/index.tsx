import {
	Thing,
	WithOnlinePresence,
	ThingWithOnlinePresence,
	Asset,
	Url‿str,
	registerꓽasset_usageⵧload,
} from "@monorepo-private/credits"
import AUTHOR from "@monorepo-private/credits/src/authors/vyznev/index.ts"

import "./index.css"

/////////////////////////////////////////////////

const FONT_FAMILY = "CG pixel 4x5"
const CSS_CLASS = "omr⋄font⁚CG-pixel--4x5"

/////////////////////////////////////////////////

// https://parceljs.org/recipes/image/#image-formats
const local_url: Url‿str = new URL("regular.ttf", import.meta.url).href

const THING: Thing = {
	description: "CG pixel 4x5 font",
	author: AUTHOR,
	since‿y: 2017,
}
const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://fontstruct.com/fontstructions/show/1404171/cg-pixel-4x5",
}
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,
}
const ASSET: Asset = {
	...THINGⵧONLINE,
	type: "font",
	local_url,
}

registerꓽasset_usageⵧload(ASSET)

/////////////////////////////////////////////////

export { FONT_FAMILY, CSS_CLASS }
