import React from "react"

import type { Uri‿str } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

interface Props {
	url: Uri‿str
}
function ᄆComponent({ url }: Props) {
	if (window.oᐧextra?.flagꓽdebug_render) console.log("🔄 Chrome/1")

	return (
		<div style={{ backgroundColor: "var(--o⋄color⁚bg--code)" }}>
			<button>🏠</button>
			<button>⏪</button>
			<button>⏩</button>
			<button>🔃</button>
			<code> {url}</code>
		</div>
	)
}

/////////////////////////////////////////////////

export { type Props, ᄆComponent }
