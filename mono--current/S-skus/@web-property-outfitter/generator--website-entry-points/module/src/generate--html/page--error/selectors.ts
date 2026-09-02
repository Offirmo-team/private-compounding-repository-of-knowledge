import { type HtmlFileSpec } from "@web-property-outfitter/generator--html"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, IETFLanguageType } from "@monorepo-private/ts--types"

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
			.filter((f) => f !== "normalize-url-trailing-slash") // we don't want extra redirects! It could be the cause of the error itself
			.filter((f) => f !== "cssⳇviewport--full" && f !== "page-loader--offirmo"), // no fancies
		content: {
			...base.content,
			title: "Error",
			js: [],
			html: [`<h1>Error</h1>`, `<p>An error happened.</p>`],
		},
	}
	return result
}

/////////////////////////////////////////////////

export { getꓽhtml_doc_spec }
