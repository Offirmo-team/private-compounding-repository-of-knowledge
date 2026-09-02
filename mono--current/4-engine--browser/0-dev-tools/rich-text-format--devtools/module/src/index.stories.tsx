import { $EXAMPLE_COMPLETE_NODE } from "@monorepo-private/rich-text-format/examples"
import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"

import { RichTextCombinedRender as Component } from "./index.tsx"
import { type BaseProps } from "./types.ts"

export default {
	component: Component,

	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
} satisfies Meta‿v3

export const Default: Story‿v3 = {
	args: {
		$doc: $EXAMPLE_COMPLETE_NODE,
	} as BaseProps,
}
