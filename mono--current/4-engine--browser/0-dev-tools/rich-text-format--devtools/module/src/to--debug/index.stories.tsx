import { $EXAMPLE_COMPLETE_NODE } from "@monorepo-private/rich-text-format/examples"

import { type BaseProps } from "../types.ts"

import { RichTextToDebug as Component } from "./index.tsx"

export default {
	component: Component,
}

export const Default = {
	args: {
		$doc: $EXAMPLE_COMPLETE_NODE,
	} as BaseProps,
}
