/////////////////////////////////////////////////

const built_at‿tms = TEST_TIMESTAMP_MS

await writeꓽwebᝍpropertyᝍfiles(
	getꓽwebᝍpropertyᝍbundle({
		...SPECⵧprod,
		built_at‿tms,
	}),
	path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output--prod"),
)

await writeꓽwebᝍpropertyᝍfiles(
	getꓽwebᝍpropertyᝍbundle({
		...SPECⵧnightly,
		built_at‿tms,
	}),
	path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output--nightly"),
)

/////////////////////////////////////////////////

import * as path from "node:path"
import { fileURLToPath } from "node:url"

import {
	getꓽwebᝍpropertyᝍbundle,
	writeꓽwebᝍpropertyᝍfiles,
} from "@web-property-outfitter/generator--website-entry-points"

import { TEST_TIMESTAMP_MS } from "@monorepo-private/timestamps"

import { SPECⵧprod, SPECⵧpreprod, SPECⵧnightly } from "../../src/__fixtures/specs--blog--personal/index.ts"
