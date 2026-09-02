#!/usr/bin/env ts-node
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import generateꓽwebsiteᝍentryᝍpoints from "@web-property-outfitter/generator--website-entry-points"

import { SPEC } from "../../src/__fixtures/specs--game--tbrpg/index.ts"

/////////////////////////////////////////////////

await generateꓽwebsiteᝍentryᝍpoints(
	{
		...SPEC,
		host: "netlify",
		generatesꓽjsⵧscaffold: "offirmo--react",
	},
	path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output"),
	{ rm: true },
)
