/////////////////////////////////////////////////
// technical

import * as Core from "@tracer-bullet--web-app/web-core" // fake, for deps

const ROOT_PAGE: WebPage = {
	...LANDING_PAGE,

	content: {
		html: ["Loading..."], // opt out of default content
		js: [
			`
import { start } from '@tracer-bullet--web-app/web-core'
start()
`,
		],
	},
	features: [
		// appearance
		"cssⳇbox-layout--natural",
		"cssⳇviewport--full",
		//"cssⳇframework--offirmo", no need, core will import it

		// technical
		"normalize-url-trailing-slash",
	],

	/////// PWA
	wantsꓽinstall: "promotion-capable",
	hasꓽown_navigation: true,
	supportsꓽscreensⵧwith_shape: true,
	canꓽuse_window_controls_overlay: true,
	usesꓽpull_to_refresh: false, // TODO 1D because it's cool
}

/////////////////////////////////////////////////
// specific to hosting

export const SPECⵧprod: WebPropertySpec = {
	...THINGⵧONLINE,
	...ROOT_PAGE,

	host: "github-pages",
	env: "production",

	/////// META
}

export const SPECⵧpreprod: WebPropertySpec = {
	...SPECⵧprod,
	urlⵧcanonical: "TODO",

	host: "github-pages",
	env: "production",

	/////// META
	isꓽpublic: false,
	isꓽdebug: false,
}

export const SPECⵧnightly: WebPropertySpec = {
	...SPECⵧprod,
	urlⵧcanonical: "https://offirmo-team.github.io/private-compounding-repository-of-knowledge/@tracer-bullet--web-app/nightly/",

	host: "github-pages",
	env: "development",

	/////// META
	isꓽpublic: false,
	isꓽdebug: true,
}

/////////////////////////////////////////////////

import * as path from "node:path"
import { fileURLToPath } from "node:url"
const __dirname = path.dirname(fileURLToPath(import.meta.url)) // TODO favicon

import { LANDING_PAGE, THINGⵧONLINE } from "@tracer-bullet--web-app/marketing"
import type { WebPage, WebPropertySpec } from "@web-property-outfitter/spec"
