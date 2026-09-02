import * as RichTextExamples from "@monorepo-private/rich-text-format/examples"
import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad/types"

import { RichText } from "./index.tsx"

/////////////////////////////////////////////////

export default {
	component: RichText,
	decorators: [
		(stuff: any) => {
			import("@monorepo-private/css--framework")
			return stuff
		},
	],
} satisfies Meta‿v3

export const Doc = {
	args: {
		$doc: RichTextExamples.$EXAMPLE__DOC__WITH_H_LEVELS,
	},
} satisfies Story‿v3
