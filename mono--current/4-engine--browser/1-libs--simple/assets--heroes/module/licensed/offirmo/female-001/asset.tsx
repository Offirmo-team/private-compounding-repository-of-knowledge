import {
	Thing,
	WithOnlinePresence,
	ThingWithOnlinePresence,
	Asset,
	registerꓽasset_usageⵧload,
} from "@monorepo-private/credits"
import AUTHOR from "@monorepo-private/credits/src/authors/Offirmo"

/////////////////////////////////////////////////

// https://parceljs.org/recipes/image/#image-formats
const local_url = new URL("original.jpg", import.meta.url).href

/////////////////////////////////////////////////

const THING: Thing = {
	description: "Fantasy heroine illustration 001",
	author: AUTHOR,
	since‿y: 2024,
}
const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "TODO",
}
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,
}
const ASSET: Asset = {
	...THINGⵧONLINE,
	type: "illustration",
	local_url,
}

registerꓽasset_usageⵧload(ASSET)

/////////////////////////////////////////////////

export default ASSET
