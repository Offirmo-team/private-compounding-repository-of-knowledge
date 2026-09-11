//////////////////////////////////////////////////////////////////////////////////////////////////
/*
 WebPropertySpec
 ⇲ ThingWithOnlinePresence
   ⇲ WithOnlinePresence
 ⇲ WebPage
   ⇲ Thing
     ↳ Creator
*/

// reminder, we're going minimal in this example

const CREATOR: Creator = {
	name: "anonymous",

	email: "anonymous@anonymous.invalid", // because at least 1 point of contact is required (we could have used other fields)
	//urlⵧcanonical: "https://anonymous.invalid", // not required
}

/////////////////////////////////////////////////
// Ok now we're having a website

const THING: Thing = {
	creator: CREATOR,
	caption: "A demo Web Property",
}

const WEBPAGE: WebPage = {
	...THING,

	/////// CONTENT
	content: {},

	/////// SOCIAL

	/////// POLISH
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// specific to hosting

const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://todo.invalid",
}

/////////////////////////////////////////////////
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,

	//contact: "admin@anonymous.invalid",
}

const built_at‿tms = TEST_TIMESTAMP_MS

const SPEC: WebPropertySpec = {
	...WEBPAGE,
	...THINGⵧONLINE,
	built_at‿tms,
}

/////////////////////////////////////////////////

const bundle = getꓽwebᝍpropertyᝍbundle(SPEC)
await writeꓽwebᝍpropertyᝍfiles(bundle, path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output"))

/////////////////////////////////////////////////

import * as path from "node:path"
import { fileURLToPath } from "node:url"

import {
	getꓽwebᝍpropertyᝍbundle,
	writeꓽwebᝍpropertyᝍfiles,
} from "@web-property-outfitter/generator--website-entry-points"
import type { WebPage, WebPropertySpec } from "@web-property-outfitter/generator--website-entry-points"

import { TEST_TIMESTAMP_MS } from "@monorepo-private/timestamps"
import type {
	Creator,
	Thing,
	WithOnlinePresence,
	ThingWithOnlinePresence,
} from "@monorepo-private/ts--types--hypermedia"
