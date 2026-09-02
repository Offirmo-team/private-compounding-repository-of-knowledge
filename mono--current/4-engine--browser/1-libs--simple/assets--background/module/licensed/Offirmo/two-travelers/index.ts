/////////////////////////////////////////////////

const local_url = new URL("original.png?as=webp", import.meta.url).href

/////////////////////////////////////////////////

const THING: Thing = {
	description: "Two Travelers",
	author: Offirmo,
	since‿y: 2026,
}
const ASSET: Asset = {
	...THING,

	type: "imageⵧillustration",
	url: local_url,
	alt: "Two fantasy travelers looking at a city in the distance",

	co_authors: [liuzishan],

	ai_involvement: {
		level: "major",
		generators: [
			{
				name: "ChatGPT",
				version: "2026-07-12",
				// 646a97f02eb7d2d43b235a46f615e1ccec9f0a23adfd196f2011898f9ca9b2e9
			},
		],
	},
}

registerꓽasset_usageⵧload(ASSET)

/////////////////////////////////////////////////

export const BG: Background = {
	asset: ASSET,

	width: 1817,
	height: 866,

	focusesⵧhorizontal: [0.37, 0.83],
	//focusesⵧvertical: [],
}
export default BG

/////////////////////////////////////////////////

import { registerꓽasset_usageⵧload } from "@monorepo-private/credits"
import type { Thing, Asset } from "@monorepo-private/credits"
import liuzishan from "@monorepo-private/credits/authors/liuzishan"
import Offirmo from "@monorepo-private/credits/authors/Offirmo"

import { type Background } from "../../../types.ts"
