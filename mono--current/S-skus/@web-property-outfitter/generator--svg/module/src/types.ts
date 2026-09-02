// https://developer.mozilla.org/en-US/docs/Web/SVG

/////////////////////////////////////////////////

export type SvgⳇId = string // TODO 1D refine

// TODO better https://developer.mozilla.org/en-US/docs/Web/SVG/Content_type#length
export type LengthUnit = "px" | "em"
export type PercentageString = `${number}%`
//type Length = number | `${number}${LengthUnit}` | PercentageString
export type Length = string

export interface Withꓽcoordinates {
	x?: Length
	y?: Length
}

export type WithLayerId = {
	layer_id: string
}
export type WithId = {
	id: SvgⳇId
}

/////////////////////////////////////////////////

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element#svg_elements_by_category
export interface SvgⳇElement {}

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element#container_elements
export interface SvgⳇContainerElement extends SvgⳇElement {
	desc?: string // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/desc
}

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g
export interface SvgⳇGroupElement extends SvgⳇContainerElement {
	id?: SvgⳇId

	attributes: {
		[k: string]: string
	}

	// order is important
	content: Array<SvgⳇElement | SVG | string>
}

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element#graphics_elements
export interface SvgⳇGraphicElement extends SvgⳇElement {
	desc?: string // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/desc
}

// one can nest SVG elements
// https://www.sarasoueidan.com/blog/mimic-relative-positioning-in-svg/
// TODO special handling?

export interface SVG extends SvgⳇContainerElement {
	/////////////////////////////////////////////////
	// Overall properties

	// language of text / writings
	lang?: IETFLanguageType

	// viewport
	// NOT recommended to specify this
	// ideally the USER of the SVG should set this as wished
	width?: number
	height?: number

	// https://www.sarasoueidan.com/blog/svg-coordinate-systems/
	// = canvas where the SVG is drawn
	// = user coordinate system
	viewBox: SVGViewBox

	// +++ https://alistapart.com/article/practical-svg/#section2
	// +++ https://www.sarasoueidan.com/demos/interactive-svg-coordinate-system/index.html
	// recommended default `xMidYMid meet`
	preserveAspectRatio?: `x${"Min" | "Mid" | "Max"}Y${"Min" | "Mid" | "Max"} ${"meet" | "slice"}`

	metadata: {
		// TODO
	}

	xml_namespaces: {
		[NamespaceId: string]: Url‿str
	}

	// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/style
	styles: {
		// TODO
		// TODO currentColor?
	}

	// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/script
	// WARNING for security purposes those scripts are often disabled cf. https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_as_an_Image#restrictions
	scripts: {
		// TODO
	}

	/////////////////////////////////////////////////
	// Building blocks

	// reusable elements https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs
	// see also https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use
	defs: {
		[id: SvgⳇId]: SvgⳇElement
		// TODO patterns https://developer.mozilla.org/en-US/docs/Web/SVG/Element/pattern
	}
	// TODO defs vs Symbols??
	// https://stackoverflow.com/questions/71180423/in-svg-whats-the-difference-between-using-symbol-versus-using-an-object-defi
	symbols: {
		// TODO
	}

	// reusable links
	links: {
		[id: string]: never // TODO
	}

	// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter
	filters: {
		// TODO
	}

	/////////////////////////////////////////////////
	// output

	// CONVENIENCE for setting an overall background color
	// - good semantic
	// - helps when composing
	// - helps when rasterizing (cf. options of https://github.com/yisibl/resvg-js#nodejs-1)
	background_color?: CssⳇColor‿str

	// order is important
	contentⵧpre: SvgⳇGroupElement["content"]
	layers: SvgⳇGroupElement[]

	// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/view
	// A view is a defined way to view the image, like a zoom level or a detail view.
	// = it's an alternative viewbox
	// can be used for a "sprite-like" svg
	// see also https://caniuse.com/svg-fragment
	views: {
		[id: SvgⳇId]: SVGViewBox
	}
}

/////////////////////////////////////////////////

import type { IETFLanguageType } from "@monorepo-private/ts--types"
import type { SvgⳇViewBox, Url‿str, CssⳇColor‿str } from "@monorepo-private/ts--types--hypermedia"
