import type { NodeLike } from "@monorepo-private/rich-text-format"
import * as RichTextExamples from "@monorepo-private/rich-text-format/examples"
import type { Meta, Story } from "@monorepo-private/storypad/types"

import renderⵧto_react from "./render--to-react.tsx"

/////////////////////////////////////////////////

type Props = {
	$doc: NodeLike
}

function Component(props: Props) {
	return (
		Object.entries(RichTextExamples)
			//.slice(0, 3)
			.map(([key, $doc]) => {
				let result = (() => {
					try {
						return renderⵧto_react($doc)
					} catch (error: any) {
						console.error(`failed to render ${key}:`, error)
						debugger
						return <span style={{ color: "red" }}>{error?.message || "Error"}</span>
					}
				})()

				return (
					<details open key={key}>
						<summary>
							<code>{key}</code>
						</summary>
						{result}
					</details>
				)
			})
	)
}

/////////////////////////////////////////////////

export default {
	component: Component,
	decorators: [
		(stuff: any) => {
			import("@monorepo-private/css--framework")
			return stuff
		},
	],
} satisfies Meta

export const SharedExamples = {} satisfies Story
