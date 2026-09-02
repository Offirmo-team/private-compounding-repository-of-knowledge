// TODO how to merge deep sub-fields?

// content oriented
export const PRESETꘌblog: Partial<WebPropertySpec> = {
	icon: {
		emoji: "✍️",
	},
}

// webapp, uses full screen, no nav nor browser controls ex. game
export const PRESETꘌappⵧimmersive: Partial<WebPropertySpec> = {
	hasꓽown_navigation: true,
	features: ["cssⳇviewport--full" as FeatureSnippets],
}

// "rebound" page trying to promote the real content with a CTA: buy, install app... https://growth.design/case-studies/landing-page-ux-psychology
export const PRESETꘌlanding: Partial<WebPropertySpec> = {}

// TODO more on-demand
// homepage?

/////////////////////////////////////////////////

import { FeatureSnippets } from "@web-property-outfitter/generator--html"

import type { WebPropertySpec } from "./types.ts"
