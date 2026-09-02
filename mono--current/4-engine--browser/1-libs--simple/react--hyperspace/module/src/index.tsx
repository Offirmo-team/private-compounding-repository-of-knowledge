import React, { use, useId, useEffect } from "react"

import { type Url‿str, type CssⳇFilterSpec, getꓽCssⳇfilter__value } from "@monorepo-private/ts--types--hypermedia"

import "./index.css"

/////////////////////////////////////////////////

interface HyperspaceEffectSpec {
	src_image: Url‿str
	filters: CssⳇFilterSpec
	//duration1
	//duration2
}

const PRESETS: { [k: string]: HyperspaceEffectSpec } = {
	original: {
		// original from https://codepen.io/noahblon/pen/DpNRyR
		// good with speed 12s
		src_image: new URL("PIA09959-1280x800.jpg", import.meta.url).href,
		filters: [],
	},

	classic: {
		// great "classic"
		// easy to derive with speed and filters
		src_image: new URL("STScI-01J4A04QJ47TX212EY5N7FN4BH-x.jpg", import.meta.url).href,
		filters: [["saturate", "150%"]],
	},

	reddish: {
		// great red bg
		src_image: new URL("STScI-01J5NSKG3DW0F4PP1DVZW20RF2-x.jpg", import.meta.url).href,
		filters: [],
	},

	hyper: {
		src_image: new URL("STScI-01J74E3HZAXK032XB1XKTR3D01-x.jpg", import.meta.url).href,
		filters: [
			//[ 'brightness', 1.5],
		],
	},
	stargate: {
		src_image: new URL("STScI-01J74E3HZAXK032XB1XKTR3D01-x3.jpg", import.meta.url).href,
		filters: [
			["brightness", 1.5],
			["blur", "2px"],
		],
	},

	purple: {
		// beautiful purple
		src_image: new URL("STScI-01HVSK7H1V5P40417HSA7TYY2P-x4.jpg", import.meta.url).href,
		filters: [],
	},

	fiery: {
		// nice fire effect
		src_image: new URL("STScI-01J7492J6AJFB5C8Z8P18T5C18-x.jpg", import.meta.url).href,
		filters: [],
	},

	test: {
		// currently under test
		src_image: new URL("STScI-01J7492J6AJFB5C8Z8P18T5C18-x.jpg", import.meta.url).href,
		filters: [],
	},
}

/////////////////////////////////////////////////

interface Props {
	preset?: keyof typeof PRESETS

	overrides?: Partial<HyperspaceEffectSpec>

	// appended, not overriding
	extra_filters?: CssⳇFilterSpec
}

function HyperSpace(props: Props = {}) {
	console.log(`🔄 <HyperSpace>`)
	const { preset = "classic", overrides = {}, extra_filters = [] } = props

	const effect_spec: HyperspaceEffectSpec = {
		...PRESETS["classic"],
		...PRESETS[preset]!,
		...overrides,
	}
	effect_spec.filters.push(...extra_filters)

	const filter__value = getꓽCssⳇfilter__value(effect_spec.filters)

	/*console.log(`XXX `, {
		props,
		effect_spec,
			filter__value,
	})*/

	return (
		<div
			className="o⋄fill-parent o⋄hyperspace-animation container"
			style={{
				"--o⋄hyperspace--imgurl": `url(${effect_spec.src_image})`,
				"--o⋄hyperspace--filter": filter__value,
			}}
		>
			<div className="scene">
				<div className="wrap">
					<div className="wall wall-right"></div>
					<div className="wall wall-left"></div>
					<div className="wall wall-top"></div>
					<div className="wall wall-bottom"></div>
					<div className="wall wall-back"></div>
				</div>
				<div className="wrap">
					<div className="wall wall-right"></div>
					<div className="wall wall-left"></div>
					<div className="wall wall-top"></div>
					<div className="wall wall-bottom"></div>
					<div className="wall wall-back"></div>
				</div>
			</div>
		</div>
	)
}

/////////////////////////////////////////////////

export { type Props, HyperSpace }
export default HyperSpace
