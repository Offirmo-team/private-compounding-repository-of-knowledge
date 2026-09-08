/////////////////////////////////////////////////

const built_at‿tms = getꓽUTC_timestamp‿ms()

/////////////////////////////////////////////////

await generateꓽwebᝍproperty(
	{
		...SPECⵧprod,
		built_at‿tms,
	},
	NodePath.resolve(NodePath.dirname(fileURLToPath(import.meta.url)), "../../../../90-final--web-app/module/src/"),
	{ rm: true },
)

/////////////////////////////////////////////////

await generateꓽwebᝍproperty(
	{
		...SPECⵧprod,
		built_at‿tms,
	},
	NodePath.resolve(NodePath.dirname(fileURLToPath(import.meta.url)), "~~output--prod"),
	{ rm: true },
)
/*
await generateꓽwebᝍproperty(
	{
		...SPECⵧpreprod,
		built_at‿tms,
	},
	NodePath.resolve(NodePath.dirname(fileURLToPath(import.meta.url)), "~~output--preprod"),
	{ rm: true },
)
*/
await generateꓽwebᝍproperty(
	{
		...SPECⵧnightly,
		built_at‿tms,
	},
	NodePath.resolve(NodePath.dirname(fileURLToPath(import.meta.url)), "~~output--nightly"),
	{ rm: true },
)

/////////////////////////////////////////////////

import * as NodePath from "node:path"
import { fileURLToPath } from "node:url"

import { generateꓽwebᝍproperty } from "@web-property-outfitter/generator--website-entry-points"

import { getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"

import { SPECⵧprod, SPECⵧpreprod, SPECⵧnightly } from "../index.ts"
