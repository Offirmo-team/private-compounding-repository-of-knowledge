import type { Immutable } from "@monorepo-private/ts--types"
import type { Html‿str } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

function generate({ titleⵧpage }: { titleⵧpage?: string }): Html‿str {
	return `
<main id="react-root">
		<!-- React will render here and replace this -->
		<section style="
			text-align: center;
			max-width: 60ch;
			margin: 0 auto;
			">
			<h1>${titleⵧpage || "Loading…"}</h1>
			<em>Loading…</em>
		</section>
	</main>
`
}

/////////////////////////////////////////////////

export default generate
