/////////////////////////////////////////////////

interface Params {
	id: string
	css?: string
	href?: string
	document?: Document
}

/**
 * Insert the specified CSS with the hinted "id". Returns either the newly created element, or the one that already
 * exists.
 *
 * @param {{ id: string; css?: string; href?: string; document?: Document }} options
 * @returns {HTMLElement}
 */
function style_once({ id, css, href, document = window.document }: Params): HTMLElement {
	const existing‿elt = document.getElementById(id)
	if (existing‿elt) return existing‿elt

	const element = (() => {
		if (css && href) throw new Error("style_once(): conflicting css & href!")

		if (css) {
			const style‿elt = document.createElement("style")
			style‿elt.setAttribute("id", id)
			style‿elt.innerHTML = css
			return style‿elt
		}

		if (href) {
			const link‿elt = document.createElement("link")
			link‿elt.setAttribute("id", id)
			link‿elt.rel = "stylesheet"
			link‿elt.href = href
			return link‿elt
		}

		throw new Error("style_once(): you must provide css or href!")
	})()

	document.head.appendChild(element)

	return element
}

/////////////////////////////////////////////////

export default style_once
