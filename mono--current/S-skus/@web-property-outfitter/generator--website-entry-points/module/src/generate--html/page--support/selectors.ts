import { type HtmlFileSpec } from "@web-property-outfitter/generator--html"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, IETFLanguageType } from "@monorepo-private/ts--types"
import type { Contentⳇweb } from "@monorepo-private/ts--types--hypermedia"

import { LIB } from "../../consts.ts"
import { getꓽcontactⵧhuman, getꓽcontactⵧsecurity, getꓽcontactⵧsupport } from "../../selectors/index.ts"
import type { WebPropertySpec } from "../../types.ts"
import { ifꓽdebug } from "../../utils/debug.ts"
import { getꓽhtml_doc_spec as _getꓽhtml_doc_spec } from "../pages--common/selectors.ts"

/////////////////////////////////////////////////

function getꓽhtml_doc_spec(spec: Immutable<WebPropertySpec>): HtmlFileSpec {
	const base = _getꓽhtml_doc_spec(spec)
	const result: HtmlFileSpec = {
		...base,

		features: (base.features ?? [])
			.filter((f) => f !== "htmlⳇreact-root")
			.filter((f) => f !== "cssⳇviewport--full" && f !== "page-loader--offirmo"), // no fancies
		content: {
			...base.content,
			title: base.content.title + " - Support",
			js: [],
			html: [
				`<h1>Support</h1>`,
				`<p>Should you need support, please visit:</p>`,
				`<ul>
					<li>Security issues: <code>${getꓽcontactⵧsecurity(spec)}</code></li>
					<li>Tech support: <code>${getꓽcontactⵧsupport(spec)}</code></li>
					<li>Anything else: <code>${getꓽcontactⵧhuman(spec)}</code></li>
				</ul>`,
				`<a href="/">⬅ Back to home</a>`,
			],
		},
	}
	return result
}

/////////////////////////////////////////////////

export { getꓽhtml_doc_spec }
