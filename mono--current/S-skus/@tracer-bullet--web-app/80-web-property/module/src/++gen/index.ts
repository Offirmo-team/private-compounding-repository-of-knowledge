#!/usr/bin/env ts-node
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import generateꓽwebsiteᝍentryᝍpoints from "@web-property-outfitter/generator--website-entry-points"

import { SPEC } from "../index.ts"

/////////////////////////////////////////////////

await generateꓽwebsiteᝍentryᝍpoints(
	SPEC,
	path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../99-web-app-final/module/src/"),
	{ rm: true },
)
