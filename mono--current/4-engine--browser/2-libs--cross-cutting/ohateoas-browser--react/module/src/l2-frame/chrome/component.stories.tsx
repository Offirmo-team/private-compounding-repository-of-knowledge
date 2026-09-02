import type { OHAHyper, OHALinkRelation, OHALinkTarget } from "@monorepo-private/ohateoas"
import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"
import type { Uri‿x } from "@monorepo-private/ts--types--hypermedia"

import { ᄆComponent } from "./component.tsx"

/////////////////////////////////////////////////

export default {
	component: ᄆComponent,
	args: {
		url: "/foo",
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta‿v3

/////////////////////////////////////////////////

export const Default: Story‿v3 = {}
