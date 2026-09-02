#!/usr/bin/env ts-node
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { generateꓽwebᝍproperty } from "@web-property-outfitter/generator--website-entry-points"
import type { WebPage, WebPropertySpec } from "@web-property-outfitter/generator--website-entry-points"

import type {
	Author,
	Thing,
	WithOnlinePresence,
	ThingWithOnlinePresence,
} from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////
/*
 WebPropertySpec
 ⇲ ThingWithOnlinePresence
   ⇲ WithOnlinePresence
 ⇲ WebPage
   ⇲ Thing
     ↳ Author
*/

const AUTHOR: Author = {
	name: "anonymous",
	//urlⵧcanonical: "https://anonymous.invalid",
}

const THING: Thing = {
	author: AUTHOR,
	description: "demo",
}

/////////////////////////////////////////////////
// Ok now we're having a website

const WEBPAGE: WebPage = {
	...THING,

	/////// CONTENT
	content: {},

	/////// SOCIAL

	/////// POLISH
}

/////////////////////////////////////////////////

const ONLINE_PRESENCE: WithOnlinePresence = {
	urlⵧcanonical: "https://todo.invalid",
}

/////////////////////////////////////////////////
// May NOT be a website!!
// could be a store on amazon, a post on social media...
const THINGⵧONLINE: ThingWithOnlinePresence = {
	...THING,
	...ONLINE_PRESENCE,

	contact: "admin@anonymous.invalid",
}
const SPEC: WebPropertySpec = {
	...WEBPAGE,
	...THINGⵧONLINE,

	//host: "cloudflare--pages",
}

/////////////////////////////////////////////////

await generateꓽwebᝍproperty(SPEC, path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output"), {
	rm: true,
})
