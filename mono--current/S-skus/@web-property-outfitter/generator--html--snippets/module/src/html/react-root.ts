import type { Immutable } from "@monorepo-private/ts--types"
import type { Html‿str } from "@monorepo-private/ts--types--hypermedia"

import { getꓽtitleⵧpage } from "../../selectors.ts"
import type { HtmlFileSpec } from "../../types.ts"

/////////////////////////////////////////////////

function generate(spec: Immutable<HtmlFileSpec>): Html‿str {
	return `
<main id="react-root">
		<!-- React will render here and replace this -->
		<section style="
			text-align: center;
			max-width: 60ch;
			margin: 0 auto;
			">
			<h1>${getꓽtitleⵧpage(spec, "Loading…")}</h1>
			<em>Loading…</em>
		</section>
	</main>
`
}

/////////////////////////////////////////////////

export default generate
