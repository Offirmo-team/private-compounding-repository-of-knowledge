import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import type { CssⳇColor‿str, Dimensions2DSpec, Emoji } from "@monorepo-private/ts--types--hypermedia"
import { getꓽdimensions2D } from "@monorepo-private/ts--types--hypermedia"

import { getꓽviewbox__dimensions, getꓽlayer } from "./selectors.ts"
import type { SVG, SvgⳇGroupElement, SvgⳇElement, SvgⳇId, SVGViewBox, Svg‿str, WithId, WithLayerId } from "./types.ts"

/////////////////////////////////////////////////

/////////////////////////////////////////////////

function createꓽgroup(
	options: Partial<WithId & Pick<SvgⳇGroupElement, "attributes">> = {},
): Immutable<SvgⳇGroupElement> {
	return {
		...(options.id && { id: options.id }),
		attributes: { ...options.attributes },
		content: [],
	}
}

function addꓽcontentⵧto_group(
	svg_group: Immutable<SvgⳇGroupElement>,
	content: Immutable<SvgⳇGroupElement["content"][0]>,
): Immutable<SvgⳇGroupElement> {
	return {
		...svg_group,
		content: [...svg_group.content, content],
	}
}

/////////////////////////////////////////////////

function createꓽempty(): Immutable<SVG> {
	return {
		/////////////////////////////////////////////////
		// Overall properties
		viewBox: [0, 0, 255, 255],
		preserveAspectRatio: `xMidYMid meet`,
		metadata: {},
		xml_namespaces: {},
		styles: {},
		scripts: {},

		/////////////////////////////////////////////////
		// Building blocks
		defs: {},
		symbols: {},
		links: {},
		filters: {},

		/////////////////////////////////////////////////
		// output
		contentⵧpre: [],
		layers: [],
		views: {},
	}
}

function setꓽviewBox(svg: Immutable<SVG>, viewBox: Immutable<SVGViewBox>): Immutable<SVG> {
	return {
		...svg,
		viewBox: [...viewBox],
	}
}

function setꓽbackground_color(svg: Immutable<SVG>, background_color: CssⳇColor‿str | "auto-theme"): Immutable<SVG> {
	if (background_color === "auto-theme") {
		throw new Error(`Not implemented!`)
	}

	return {
		...svg,
		background_color,
	}
}

function addꓽlayer(svg: Immutable<SVG>, layer: Immutable<SvgⳇGroupElement>): Immutable<SVG> {
	assert(layer.id, `Layer to add must have an id!`)

	return {
		...svg,
		layers: [...svg.layers, layer],
	}
}

function updateꓽlayer(svg: Immutable<SVG>, updated_layer: Immutable<SvgⳇGroupElement>): Immutable<SVG> {
	let found = false
	let has_change = false
	const layers = svg.layers.map((layer) => {
		if (layer.id === updated_layer.id) {
			found = true
			if (layer !== updated_layer) {
				has_change = true
				layer = updated_layer
			}
		}
		return layer
	})

	assert(found, `Layer to update "${updated_layer.id}" not found!`)
	if (!has_change) return svg

	return {
		...svg,
		layers,
	}
}

function addꓽcontent(
	svg: Immutable<SVG>,
	content: Immutable<SvgⳇGroupElement["content"][0]>,
	options: Partial<WithLayerId> = {},
): Immutable<SVG> {
	let layer: Immutable<SvgⳇGroupElement> = (() => {
		if (options.layer_id) {
			return getꓽlayer(svg, { id: options.layer_id })
		}

		if (svg.layers.length) return svg.layers.at(-1)!

		// no layers, let's add one
		const layer = createꓽgroup({ id: "layer-auto" })
		svg = addꓽlayer(svg, layer)
		return layer
	})()

	layer = addꓽcontentⵧto_group(layer, content)

	return updateꓽlayer(svg, layer)
}

function addꓽcontentꘌcontour(svg: Immutable<SVG>, border_width?: number): Immutable<SVG> {
	const { width, height } = getꓽviewbox__dimensions(svg)
	border_width = border_width || Math.min(width, height) / 100

	const stroke_width = border_width * 2

	// inkscape doesn't recognize `fill:transparent`
	return addꓽcontent(
		svg,
		`
<rect width="${width}" height="${height}" style="fill:none; stroke-width:${stroke_width}; stroke:black" />
	`,
	)
}

function addꓽcontentꘌmire(svg: Immutable<SVG>, border_width?: number): Immutable<SVG> {
	const [xmin, ymin, width, height] = svg.viewBox
	const stroke_width = border_width || Math.min(width, height) / 100

	let layer = createꓽgroup({
		id: "mire",
		attributes: {
			stroke: "blue",
			"stroke-linecap": "round",
		},
	})

	let content = `
<!-- X -->
<line x1="${xmin}" y1="${ymin}" x2="${xmin + width}" y2="${ymin + height}" style="stroke-width:${stroke_width};" />
<line x1="${xmin}" y1="${ymin + height}" x2="${xmin + width}" y2="${ymin}" style="stroke-width:${stroke_width};" />

<!-- # -->
<line x1="${xmin + (width * 1) / 3}" y1="${ymin}"        x2="${xmin + (width * 1) / 3}" y2="${ymin + height}" style="stroke-width:${stroke_width / 2};" />
<line x1="${xmin + (width * 2) / 3}" y1="${ymin + height}" x2="${xmin + (width * 2) / 3}" y2="${ymin}"        style="stroke-width:${stroke_width / 2};" />
<line x1="${xmin}" y1="${ymin + (width * 1) / 3}" x2="${xmin + width}" y2="${ymin + (width * 1) / 3}" style="stroke-width:${stroke_width};" />
<line x1="${xmin}" y1="${ymin + (width * 2) / 3}" x2="${xmin + width}" y2="${ymin + (width * 2) / 3}" style="stroke-width:${stroke_width};" />

<!-- ᄆ -->
<rect width="${width}" height="${height}" style="stroke-width:${stroke_width * 2 /* half of it will be out of the viewBox */}; fill:none;" />

<!-- gradations -->
	`

	function addHorzGrad(spacing: number): SvgⳇGroupElement {
		let stroke_width = spacing / 10
		let group = createꓽgroup({
			attributes: {
				"stroke-width": String(stroke_width),
			},
		})
		let content = ""
		let xmid = xmin + width / 2
		for (let i = 0; i <= width / 100 / 2; i++) {
			content += `
<line x1="${xmid + i * 100}" y1="${ymin}"          x2="${xmid + i * 100}" y2="${ymin + 100}"          />
<line x1="${xmid + i * 100}" y1="${ymin + height}" x2="${xmid + i * 100}" y2="${ymin + height - 100}" />
<line x1="${xmid - i * 100}" y1="${ymin}"          x2="${xmid - i * 100}" y2="${ymin + 100}"          />
<line x1="${xmid - i * 100}" y1="${ymin + height}" x2="${xmid - i * 100}" y2="${ymin + height - 100}" />
		`
		}
		group = addꓽcontentⵧto_group(group, content)
		layer = addꓽcontentⵧto_group(layer, group)
	}
	addHorzGrad(100)

	/*
	for (let i = 1; i <= width / 1000; i++) {
		content += `
<line x1="${xmin + i * 1000}" y1="${ymin}"        x2="${xmin + i * 1000}" y2="${ymin+1000 * 0.5}"          style="stroke-width:${100 * 0.5}; stroke:${stroke};" />
<line x1="${xmin + i * 1000}" y1="${ymin+height}" x2="${xmin + i * 1000}" y2="${ymin+height - 1000 * 0.5}" style="stroke-width:${100 * 0.5}; stroke:${stroke};" />
		`
	}*/

	layer = addꓽcontentⵧto_group(layer, content)
	return addꓽlayer(svg, layer)
}

/////////////////////////////////////////////////

function decorate_for_editors(svg: Immutable<SVG>): Immutable<SVG> {
	const layers = svg.layers.map((layer) => {
		layer = {
			...layer,
			attributes: {
				...layer.attributes,
				["class"]: "layer", // seen on https://svgedit.netlify.app not sure if useful
				"inkscape:groupmode": "layer", // seen on inkscape
			},
		}

		return layer
	})
	/*


 */
	return {
		...svg,
		contentⵧpre: [
			`
<sodipodi:namedview
id="namedview1"
pagecolor="#ffffff"
bordercolor="#ff0000"
borderopacity="1"
inkscape:showpageshadow="true"
inkscape:pageopacity="0.0"
inkscape:pagecheckerboard="true"
inkscape:deskcolor="#d1d1d1"
/>`,
		],
		layers,
		xml_namespaces: {
			...svg.xml_namespaces,
			// seen in inkscape output
			inkscape: "http://www.inkscape.org/namespaces/inkscape",
			sodipodi: "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd",
			svg: "http://www.w3.org/2000/svg", // cargo culting?
		},
	}
}

/////////////////////////////////////////////////

// Do NOT use
// you most likely want to set those on RENDER! @see getꓽsvg‿str()
function setꓽdimensions_ǃnot_recommended(svg: Immutable<SVG>, dimensions: Immutable<Dimensions2DSpec>): Immutable<SVG> {
	const { width, height } = getꓽdimensions2D(dimensions)

	return {
		...svg,
		width,
		height,
	}
}

/////////////////////////////////////////////////

// emoji favicon
// credits https://twitter.com/LeaVerou/status/1241619866475474946
// example:
// <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
// <text y='.9em' font-size='90'>🦄</text>
// </svg>
function createꓽfrom_emoji(emoji: Emoji): Immutable<SVG> {
	let svg = createꓽempty()
	svg = setꓽviewBox(svg, [0, 0, 100, 100])
	// no background color, looks better!
	svg = addꓽcontent(svg, `<text y='.9em' font-size='90'>${emoji}</text>`)

	return svg
}

function createꓽfrom_file(raw: Svg‿str): Immutable<SVG> {
	throw new Error("NIMP!")
}

/////////////////////////////////////////////////

export {
	createꓽempty,
	createꓽfrom_emoji,
	setꓽviewBox,
	setꓽbackground_color,
	addꓽlayer,
	updateꓽlayer,
	addꓽcontentꘌcontour,
	addꓽcontentꘌmire,
	decorate_for_editors,
	setꓽdimensions_ǃnot_recommended,

	////////////

	createꓽgroup,
	addꓽcontentⵧto_group,
}
