/////////////////////////////////////////////////

export function getꓽhtml_doc_spec(spec: Immutable<WebPropertySpec>): HtmlFileSpec {
	const base = _getꓽhtml_doc_spec(spec)
	const result: HtmlFileSpec = {
		...base,

		// TODO if the site itself is an "about", should redirect to root

		features: (base.features ?? [])
			.filter((f) => f !== "htmlⳇreact-root")
			.filter((f) => f !== "cssⳇviewport--full" && f !== "page-loader--offirmo"), // no fancies
		content: {
			...base.content,
			title: base.content.title + " - About",
			js: [],
			html: [`<h1>About ${base.content.title}</h1>`, `<p>TODO...</p>`],
		},
	}
	return result
}

/////////////////////////////////////////////////

import { type HtmlFileSpec } from "@web-property-outfitter/generator--html"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, IETFLanguageType } from "@monorepo-private/ts--types"

import type { WebPropertySpec } from "../../types.ts"
import { getꓽhtml_doc_spec as _getꓽhtml_doc_spec } from "../pages--common/selectors.ts"
