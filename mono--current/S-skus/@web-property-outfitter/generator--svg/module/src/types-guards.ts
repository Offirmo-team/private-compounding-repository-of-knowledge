import { type SVG, type SvgⳇContainerElement, type SvgⳇElement, type SvgⳇGroupElement } from "./types.ts"

/////////////////////////////////////////////////

function isꓽSVG(x: SvgⳇElement): x is SVG {
	return Object.hasOwn(x, "viewBox")
}
function isꓽSVGGroupElement(x: SvgⳇElement): x is SvgⳇGroupElement {
	return Object.hasOwn(x, "content")
}

/////////////////////////////////////////////////

export { isꓽSVG, isꓽSVGGroupElement }
