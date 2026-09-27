import { Thing, WithOnlinePresence, ThingWithOnlinePresence, Asset, registerꓽasset_usageⵧload } from '@monorepo-private/credits'
import CREATOR from "@monorepo-private/credits/src/authors/MapleLeaf68/index.ts"

import './style.css'

const THING: Thing = {
	description: 'Sword cursor',
	creator: CREATOR,
	since‿y: 2015,
}
const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: 'http://www.rw-designer.com/cursor-detail/79261'
}
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,
}
const ASSET: Asset = {
	...THINGⵧONLINE,
	type: 'cursor',
}

registerꓽasset_usageⵧload(ASSET)
