/////////////////////////////////////////////////

const built_at‿tms = TEST_TIMESTAMP_MS

await generateꓽwebᝍproperty(
	{
		...SPECⵧprod,
		built_at‿tms,
	},
	path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output--prod"),
	{ rm: true },
)
/*
await generateꓽwebᝍproperty(
	{
		...SPECⵧpreprod,
		built_at‿tms,
	},
	path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output--preprod"),
	{ rm: true },
)
*/
await generateꓽwebᝍproperty(
	{
		...SPECⵧnightly,
		built_at‿tms,
	},
	path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output--nightly"),
	{ rm: true },
)

/////////////////////////////////////////////////

import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { generateꓽwebᝍproperty } from "@web-property-outfitter/generator--website-entry-points"

import { TEST_TIMESTAMP_MS } from "@monorepo-private/timestamps"

import { SPECⵧprod, SPECⵧpreprod, SPECⵧnightly } from "../../src/__fixtures/specs--blog--personal/index.ts"
