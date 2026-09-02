/////////////////////////////////////////////////

const SPEC: WebPropertySpec = {
	...WEBSITE,
	...PRESETꘌappⵧimmersive,

	content: {
		html: [""], // opt out of default content
		js: [`import './index.tsx'`],
	},
	features: [
		"cssⳇbox-layout--natural",
		"cssⳇviewport--full",
		"normalize-url-trailing-slash",
		"cssⳇframework--offirmo",
		"htmlⳇreact-root",
		//'page-loader--offirmo',
		//'analytics--google',
		//'site-verification--google',
	],

	/////// SPA
	//isꓽcatching_all_routes?: boolean // if true, we may NOT want a 404.html, ex. https://developers.cloudflare.com/pages/configuration/serving-pages/#single-page-application-spa-rendering

	/////// PWA
	app_categories: ["games"],
	wantsꓽinstall: "promotion-capable",
	//titleⵧapp?: Descriptionⳇtitle
	//descriptionⵧapp?: string
	//supportsꓽscreensⵧwith_shape?: boolean // https://drafts.csswg.org/css-round-display/
	//canꓽuse_window_controls_overlay?: boolean
	//usesꓽpull_to_refresh?: boolean
}

await generateꓽwebᝍproperty(
	{ ...SPEC, host: "github-pages", isꓽpublic: false, isꓽdebug: true },
	path.resolve(path.dirname(fileURLToPath(import.meta.url)), "~~output"),
	{
		rm: true,
	},
)

/////////////////////////////////////////////////

import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { WEBSITE } from "@rpg--space/marketing"
import {
	generateꓽwebᝍproperty,
	PRESETꘌappⵧimmersive,
	type WebPropertySpec,
} from "@web-property-outfitter/generator--website-entry-points"
