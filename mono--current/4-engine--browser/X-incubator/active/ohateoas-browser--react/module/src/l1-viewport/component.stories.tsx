import { DOC_DEMO_RPG_03 } from "@monorepo-private/rich-text-format/examples"
import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"

import { ᄆComponent } from "./component.tsx"

/////////////////////////////////////////////////

export default {
	component: ᄆComponent,
} satisfies Meta‿v3

/////////////////////////////////////////////////

export const Default: Story‿v3 = {
	args: {
		$doc: DOC_DEMO_RPG_03,
	},
}
