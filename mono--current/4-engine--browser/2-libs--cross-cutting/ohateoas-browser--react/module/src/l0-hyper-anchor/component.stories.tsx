import type { OHAHyper, OHALinkRelation, OHALinkTarget } from "@monorepo-private/ohateoas"
import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"
import type { Uri‿x } from "@monorepo-private/ts--types--hypermedia"

import { ᄆComponent } from "./component.tsx"

/////////////////////////////////////////////////

export default {
	component: ᄆComponent,
	args: {
		onꓽclick: (l) => console.log(`onꓽclick`, l),
	},
} satisfies Meta‿v3

/////////////////////////////////////////////////

export const SimpleNoCTA: Story‿v3 = {
	args: {
		href: { href: "/foo" },
	},
}

export const SimpleWithCTA: Story‿v3 = {
	args: {
		href: {
			href: "/foo",
			hints: {
				cta: "Foo!",
			},
		},
	},
}
