import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"
import type { Dimensions2D } from "@monorepo-private/ts--types--hypermedia"

import { EOL, TAB } from "./consts.ts"
import { isꓽSVG, isꓽSVGGroupElement } from "./types-guards.ts"
import type { SVG, SvgⳇGroupElement, Svg‿str, WithId } from "./types.ts"

/////////////////////////////////////////////////

function getꓽviewbox__dimensions(svg: Immutable<SVG>): Dimensions2D {
	return {
		width: svg.viewBox[2],
		height: svg.viewBox[3],
	}
}

function getꓽlayer(svg: Immutable<SVG>, { id }: WithId): Immutable<SvgⳇGroupElement> {
	const layer = svg.layers.find((x) => x.id === id)
	assert(!!layer, `Layer ${id} not found!`)
	return layer
}

function getꓽsvg‿strⵧgroup(
	svg_group: Immutable<SvgⳇGroupElement>,
	options: {
		drop_g_if_possible?: boolean
		wantsꓽcompact?: boolean // if true, omit EOL, tabs and maybe pedantic stuff
	} = {},
): Svg‿str {
	const wantsꓽcompact = options.wantsꓽcompact ?? false
	const drop_g_if_possible = options.drop_g_if_possible ?? svg_group.id === "layer-auto"

	const svg__atributes‿str = [
		svg_group.id ? `id='${svg_group.id}'` : "",
		...Object.entries(svg_group.attributes).map(([k, v]) => `${k}="${v}"`),
	]
		.filter((a) => !!a.trim())
		.join(wantsꓽcompact ? " " : `${EOL}${TAB}`)
		.trim()

	const parts = [
		...svg_group.content.map((x): string => {
			if (typeof x === "string") return x

			if (isꓽSVG(x)) {
				// sub-svg
				return getꓽsvg‿str(x, options)
			}

			if (isꓽSVGGroupElement(x)) {
				return getꓽsvg‿strⵧgroup(x, options)
			}

			throw new Error(`Content unrecognized!`)
		}),
	]
		.map((x) => x.trim())
		.filter((x) => !!x)

	if (!drop_g_if_possible || svg__atributes‿str) {
		parts.unshift(`<g ${svg__atributes‿str}>`)
		parts.push(`</g>`)
	}

	return parts.join(wantsꓽcompact ? "" : `${EOL}${TAB}`).trim()
}

// Note that we use single quotes for embeddability in head / CSS
function getꓽsvg‿str(
	svg: Immutable<SVG>,
	options: {
		width?: number // default is auto
		height?: number // default is auto
		wantsꓽcompact?: boolean // if true, omit EOL, tabs and maybe pedantic stuff
		isꓽnested?: boolean // if true, omit the namespace
	} = {},
): Svg‿str {
	const wantsꓽcompact = options.wantsꓽcompact ?? false
	const isꓽnested = options.isꓽnested ?? false

	//console.log(`XXX rendering`, svg)

	const svg__atributes‿str = [
		isꓽnested ? "" : `xmlns='http://www.w3.org/2000/svg'`,

		options.width || svg.width ? `width='${options.width || svg.width}'` : "",
		options.height || svg.height ? `height='${options.height || svg.height}'` : "",

		`viewBox='${svg.viewBox.join(" ")}'`,

		...Object.entries(svg.xml_namespaces).map(([prefix, uri]) => `xmlns:${prefix}='${uri}'`),
	]
		.filter((a) => !!a)
		.join(wantsꓽcompact ? " " : `${EOL}${TAB}`)

	return [
		//<?xml version="1.0" encoding="utf-8"?>
		//<!-- Generator: xxx  -->
		//<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
		//<!-- License: ... -->

		`<svg ${svg__atributes‿str}>`,

		// https://stackoverflow.com/questions/11293026/default-background-color-of-svg-root-element
		// FYI other options: use a giant circle (but circle = computation heavy) any benefit?
		// TODO review: bleed a little bit the rectangle? Would that be useful?
		svg.background_color
			? `<rect id='background-color' fill='${svg.background_color}' x='${svg.viewBox[0]}' y='${svg.viewBox[1]}' width='${svg.viewBox[2]}' height='${svg.viewBox[3]}' />`
			: "",

		...svg.contentⵧpre.map((x): string => {
			if (typeof x === "string") return x

			if (isꓽSVG(x)) {
				// TODO type guard
				// sub-svg
				return getꓽsvg‿str(x, options)
			}

			throw new Error(`Not implemented!`)
		}),

		...svg.layers.map((x): string => {
			return getꓽsvg‿strⵧgroup(x, {
				...options,
				drop_g_if_possible: wantsꓽcompact && svg.layers.length === 1,
			})
		}),

		`</svg>`,
	]
		.map((x) => x.trim())
		.filter((x) => !!x)
		.join(wantsꓽcompact ? "" : `${EOL}${TAB}`)
		.trim()
}

/////////////////////////////////////////////////

export { getꓽviewbox__dimensions, getꓽlayer, getꓽsvg‿str }
