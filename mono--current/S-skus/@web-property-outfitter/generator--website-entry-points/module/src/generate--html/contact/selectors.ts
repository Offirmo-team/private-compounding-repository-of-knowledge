import { type HtmlFileSpec } from "@web-property-outfitter/generator--html"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, IETFLanguageType } from "@monorepo-private/ts--types"
import type { Contentⳇweb } from "@monorepo-private/ts--types--hypermedia"

import { LIB } from "../../consts.ts"
import {
	prefersꓽorientation,
	getꓽfeatures,
	getꓽlang,
	getꓽcolorⵧtheme,
	getꓽcharset,
	isꓽuser_scalable,
	supportsꓽscreensⵧwith_shape,
	wantsꓽinstall,
} from "../../selectors/index.ts"
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
			title: "Contact",
			js: [],
			html: [`<h1>Contact</h1>`, `<p>TODO...</p>`],
		},
	}
	return result
}

/////////////////////////////////////////////////

export { getꓽhtml_doc_spec }
