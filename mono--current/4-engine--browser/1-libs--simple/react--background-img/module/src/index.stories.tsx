/////////////////////////////////////////////////

import BGSpaceStation from "../__fixtures/neon.dimensionss/index.ts"
import BGSunnySky from "../__fixtures/sunny-sky/index.ts"
import BGTwoTravellers from "../__fixtures/two-travelers/index.ts"

import { type Props, BackgroundImg } from "./index.tsx"

function Component(props: Props) {
	const props_for_debug = structuredClone(props)
	props_for_debug.bg.asset.author = "<deleted>"
	return (
		<div className="o⋄full-viewport isolate" style={{ position: "relative" }}>
			<BackgroundImg {...props} />
			<div className="o⋄usable-viewport" style={{ position: "relative" }}>
				<pre className="o⋄bg-colorꘌtransparent">{JSON.stringify(props_for_debug, null, 2)}</pre>
			</div>
		</div>
	)
}

export default {
	parameters: {
		layout: "fullscreen", // "centered" "padded" "bare",
	},
	component: Component,
	args: {
		_debug: true,
		bg: BGSunnySky,
	},
} satisfies Meta‿v3

/////////////////////////////////////////////////

export const Default: Story‿v3 = {}

export const FullyRandomFocus: Story‿v3 = {
	args: {
		bg: BGSunnySky,
	},
}

export const ExplicitSizing: Story‿v3 = {
	args: {
		view__dimension: { width: 300, aspect_ratio: 1 },
	},
}

export const MultipleFocusRandom: Story‿v3 = {
	args: {
		bg: BGTwoTravellers,
	},
}

export const MultipleFocusExplicit: Story‿v3 = {
	args: {
		bg: BGTwoTravellers,
		alt_alignment: 0,
	},
}

export const LowResolution: Story‿v3 = {
	args: {
		bg: BGSpaceStation,
	},
}

export const XErrorⳇBrokenLink: Story‿v3 = {
	args: {
		bg: {
			...BGSunnySky,
			asset: {
				...BGSunnySky.asset,
				url: "http://example.com/404",
			},
		},
	},
}

export const XErrorⳇBrokenFocus: Story‿v3 = {
	args: {
		bg: BGTwoTravellers,
		alt_alignment: 10,
	},
}

export const XErrorⳇStaleSize: Story‿v3 = {
	args: {
		bg: {
			...BGSunnySky,
			width: 100,
			height: 100,
		},
	},
}

/////////////////////////////////////////////////

import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"
