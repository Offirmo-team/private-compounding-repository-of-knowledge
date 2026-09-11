/////////////////////////////////////////////////

const built_at‿tms = getꓽUTC_timestamp‿ms()

/////////////////////////////////////////////////

// TODO filter .map

const bundleⵧnightly = await getꓽwebᝍpropertyᝍbundle({
	...SPECⵧnightly,
	built_at‿tms,
})

await (async () => {
	const served_files = getꓽsubpath(bundleⵧnightly.files, bundleⵧnightly.meta.serve_me‿relpath)

	await ೱwriteꓽfile_map(
		served_files,
		nodeꓽpath.resolve(nodeꓽpath.dirname(fileURLToPath(import.meta.url)), "../../../../90-final--web-app/module/src/"),
		{ rm: true },
	)
})()

/////////////////////////////////////////////////
/*
await generateꓽwebᝍproperty(
	{
		...SPECⵧprod,
		built_at‿tms,
	},
	nodeꓽpath.resolve(nodeꓽpath.dirname(fileURLToPath(import.meta.url)), "~~output--prod"),
	{ rm: true },
)
/*
await generateꓽwebᝍproperty(
	{
		...SPECⵧpreprod,
		built_at‿tms,
	},
	nodeꓽpath.resolve(nodeꓽpath.dirname(fileURLToPath(import.meta.url)), "~~output--preprod"),
	{ rm: true },
)
*/ /*
await generateꓽwebᝍproperty(
	{
		...SPECⵧnightly,
		built_at‿tms,
	},
	nodeꓽpath.resolve(nodeꓽpath.dirname(fileURLToPath(import.meta.url)), "~~output--nightly"),
	{ rm: true },
)
*/

/////////////////////////////////////////////////

import * as nodeꓽpath from "node:path"
import { fileURLToPath } from "node:url"

import {
	ೱwriteꓽfile_map,
	getꓽwebᝍpropertyᝍbundle,
	getꓽsubpath,
} from "@web-property-outfitter/generator--website-entry-points"

import { getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"

import { SPECⵧprod, SPECⵧpreprod, SPECⵧnightly } from "../index.ts"
