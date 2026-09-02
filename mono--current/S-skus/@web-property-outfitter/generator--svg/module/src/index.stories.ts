import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad/types"
import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽcontentꘌcat } from "./__fixtures/examples"
import * as Reducers from "./reducers.ts"
import { getꓽsvg‿str } from "./selectors.ts"
import type { SVG, Svg‿str } from "./types.ts"

/////////////////////////////////////////////////

function _get_multi(svg: Immutable<SVG>, options: any = undefined): Svg‿str {
	return [
		getꓽsvg‿str(svg, {
			...options,
			height: 100,
		}),
		getꓽsvg‿str(svg, {
			...options,
			width: 100,
		}),
		getꓽsvg‿str(svg, {
			...options,
			height: 500,
		}),
	].join("\n")
}

/////////////////////////////////////////////////

export const EmojiCompact: Story‿v3 = {
	render: () => {
		const svg = Reducers.createꓽfrom_emoji("🦄")
		return _get_multi(svg, {
			wantsꓽcompact: true, // normal use case
		})
	},
}

export const Background: Story‿v3 = {
	render: () => {
		const svg = (() => {
			let svg = Reducers.createꓽempty()
			svg = Reducers.setꓽviewBox(svg, [0, 0, 100, 200])
			svg = Reducers.setꓽbackground_color(svg, "#123456")
			return svg
		})()

		return _get_multi(svg)
	},
}

export const ContentꘌNestedSVG: Story‿v3 = {
	render: () => {
		const svg = (() => {
			let svg = Reducers.createꓽempty()

			svg = Reducers.setꓽviewBox(svg, [0, 0, 160, 90])
			svg = Reducers.setꓽbackground_color(svg, "green")
			svg = Reducers.addꓽcontent(svg, getꓽcontentꘌcat())

			return svg
		})()

		return _get_multi(svg)
	},
}

export const ContentꘌforeignObject: Story‿v3 = {
	render: () => {
		const svg = (() => {
			let svg = Reducers.createꓽempty()

			svg = Reducers.setꓽviewBox(svg, [0, 0, 160, 90])
			svg = Reducers.setꓽbackground_color(svg, "beige")
			svg = Reducers.addꓽcontent(
				svg,
				`
<foreignObject x="0" y="0" width="160" height="90">
	<div xmlns="http://www.w3.org/1999/xhtml" style="height: 90px;overflow: scroll;">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis mollis
	mi ut ultricies. Nullam magna ipsum, porta vel dui convallis, rutrum
	imperdiet eros. Aliquam erat volutpat.
	</div>
</foreignObject>
			`,
			)

			return svg
		})()

		return _get_multi(svg)
	},
}

export const ContentꘌContour: Story‿v3 = {
	render: () => {
		const svg = (() => {
			let svg = Reducers.createꓽempty()

			svg = Reducers.setꓽviewBox(svg, [0, 0, 160, 90])
			//svg = Reducers.setꓽbackground_color(svg, 'green')
			svg = Reducers.addꓽcontent(svg, getꓽcontentꘌcat())
			svg = Reducers.addꓽcontentꘌcontour(svg)

			return svg
		})()

		return _get_multi(svg)
	},
}

export const XXXEmpty: Story‿v3 = {
	render: () => {
		const svg = Reducers.createꓽempty()

		return _get_multi(svg)
	},
}
