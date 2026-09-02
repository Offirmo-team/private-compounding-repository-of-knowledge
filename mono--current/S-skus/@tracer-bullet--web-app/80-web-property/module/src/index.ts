import * as path from "node:path"
import { fileURLToPath } from "node:url"
const __dirname = path.dirname(fileURLToPath(import.meta.url)) // TODO favicon?

import { WEBSITE } from "@tracer-bullet--web-app/marketing"
import {
	type Contentⳇweb,
	PRESETꘌblog,
	type WebPropertySpec,
} from "@web-property-outfitter/generator--website-entry-points"

/////////////////////////////////////////////////
const SPEC: WebPropertySpec = {
	...WEBSITE,
	//...PRESETꘌblog,

	/////// content
	content: {
		html: ["Loading..."], // opt out of default content
		js: [
			`
import { start } from '@tracer-bullet--web-app/web-core'
start()
`,
		],
	},

	/////// SPA
	isꓽcatching_all_routes: true,

	/////// PWA

	/////// SRC
	host: "cloudflare--workers",

	/////// META
	env: "prod",
	isꓽpublic: true,
	isꓽdebug: false,
}

/////////////////////////////////////////////////

export { SPEC }
