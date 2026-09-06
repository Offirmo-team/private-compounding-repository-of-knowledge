#!/usr/bin/env ts-node
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { generateꓽwebᝍproperty } from "@web-property-outfitter/generator--website-entry-points"

import { SPEC } from "../../src/__fixtures/specs--blog--personal/index.ts"

/////////////////////////////////////////////////

await generateꓽwebᝍproperty(
	{
		...SPEC,
		host: "github-pages",
	},
	path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output"),
	{ rm: true },
)
