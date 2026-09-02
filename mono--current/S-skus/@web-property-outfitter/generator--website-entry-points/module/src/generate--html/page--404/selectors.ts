/////////////////////////////////////////////////

export function getꓽhtml_doc_spec(spec: Immutable<WebPropertySpec>): HtmlFileSpec {
	const base = _getꓽhtml_doc_spec(spec)

	// if served under a path, e.g. GitHub Pages
	// "home" for this web property may not be /
	let home_path = new URL(getꓽurlⵧcanonical(spec)).pathname
	if (!home_path.endsWith("/")) home_path += "/"

	const result: HtmlFileSpec = {
		...base,

		features: (base.features ?? [])
			.filter((f) => f !== "htmlⳇreact-root") // no need, we'll provide content
			.filter((f) => f !== "normalize-url-trailing-slash") // we don't want extra redirects! It could be the cause of this 404!
			.filter((f) => f !== "cssⳇviewport--full" && f !== "page-loader--offirmo"), // no fancies

		content: {
			...base.content,
			title: "404 Not Found",
			jsⵧcritical: [
				...(spec.host === "github-pages" ? [`;(${String(snippetꓽjsⳇredirect_extensionless_known_pathes)})()`] : []),
				// no fancies, only this one (TODO review?)
			],
			js: [],
			html: [
				`
<h1>404 Not Found</h1>
<p>Sorry, the page you were looking for doesn't exist.</p>
<nav>
	<ul>
		<li><a href="${home_path}">Go home</a></li>
		<li><button onclick="history.back()">Navigate back</button></li>
	</ul>
</nav>
				`,
				// TODO auto-link to /support and /status
			],
		},
	}
	return result
}

/////////////////////////////////////////////////

import type { FeatureSnippets, HtmlFileSpec } from "@web-property-outfitter/generator--html"

import type { Immutable } from "@monorepo-private/ts--types"
import { getꓽurlⵧcanonical } from "@monorepo-private/ts--types--hypermedia"

import type { WebPropertySpec } from "../../types.ts"
import { getꓽhtml_doc_spec as _getꓽhtml_doc_spec } from "../pages--common/selectors.ts"
import snippetꓽjsⳇredirect_extensionless_known_pathes from "../snippets/js/snippet--github-pages--redirect-extensionless.ts"
