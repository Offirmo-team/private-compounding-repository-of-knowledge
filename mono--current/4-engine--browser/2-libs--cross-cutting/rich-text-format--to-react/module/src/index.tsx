import type { Document } from "@monorepo-private/rich-text-format"

import renderⵧto_react from "./render--to-react.tsx"

type Props = {
	$doc: Document
}

function RichText(props: Props) {
	try {
		return renderⵧto_react(props.$doc)
	} catch (error: any) {
		console.error(`[@monorepo-private/rich-text-format--to-react] failed to render:`, error)
		return <span style={{ color: "red" }}>{error?.message || "Error"}</span>
	}
}

export { RichText, renderⵧto_react }
