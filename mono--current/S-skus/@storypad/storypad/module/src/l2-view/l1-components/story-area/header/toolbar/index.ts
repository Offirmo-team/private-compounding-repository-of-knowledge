/////////////////////////////////////////////////
// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

import { getꓽfirst_message_from_iframe_seen } from "../../../../l0-services/frame-messaging.ts"

export default function renderꓽtoolbar(state: ObservableState): HTMLElement {
	const root = document.createElement("div")
	root.classList.add("storypad⋄ui-element", "storypad⋄header⋄toolbar")

	//import("./index.css")

	// reload
	root.appendChild(
		(function getReloadButton() {
			const button = document.createElement("button")
			button.innerText = "🔄"
			button.title = "reload"
			//button.disabled = true

			button.onclick = () => {
				console.clear()
				console.log("Reloading the story iframe(s)...")
				getꓽstory_iframes().reduce((p, iframe_elt) => {
					iframe_elt.contentWindow?.location.reload()
					return getꓽfirst_message_from_iframe_seen(iframe_elt)
				}, Promise.resolve())
			}
			return button
		})(),
	)

	// debug CSS
	root.appendChild(
		(() => {
			const button = document.createElement("button")

			function renderꓽbutton(is_active: boolean): void {
				button.innerText = is_active ? "ᴏɴ  🪲" : "🐛 ᴏꜰꜰ"
				wireUp(button, is_active ? "tonal-off" : "tonal-on")
			}

			button.title = "debug assistance"
			renderꓽbutton(false)

			//button.disabled = true
			button.onclick = () => {
				console.log("Toggling debug assistance...")
				const is_active = toggleꓽstylesheet(getꓽstory_documents(), DIAGNOSTICS_CSS_URL)
				renderꓽbutton(is_active)
			}

			return button
		})(),
	)
	load("tonal-on")
	load("tonal-off")

	// viewport
	root.appendChild(
		(() => {
			const button = document.createElement("button")
			let status: "full" | "mobile" = "full"

			function renderꓽbutton(): void {
				button.innerText = "🔲"
			}

			button.title = "viewport"
			renderꓽbutton()

			//button.disabled = true
			button.onclick = () => {
				console.log("Toggling viewport...")

				getꓽstory_iframes().forEach((iframe) => {
					iframe.style.width = "320px"
					iframe.style.height = "568px"
				})
			}

			return button
		})(),
	)

	return root
}

/////////////////////////////////////////////////

// the DOM is the single source of truth: "active" = the <link> is present in the story document
// (hence auto-deactivated on iframe reload / story change)
// returns the new state = whether the stylesheet is now active
function toggleꓽstylesheet(docs: Document[], href: string): boolean {
	if (docs.length === 0) {
		console.warn(`[${LIB}] No story document to toggle the stylesheet in!`, { href })
		return false
	}

	const should_activate = !docs.some((doc) => getꓽstylesheet_links(doc, href).length > 0)

	docs.forEach((doc) => {
		if (should_activate) {
			const link_elt = doc.createElement("link")
			link_elt.rel = "stylesheet"
			link_elt.href = href
			doc.head.appendChild(link_elt)
		} else {
			getꓽstylesheet_links(doc, href).forEach((link_elt) => link_elt.remove())
		}
	})

	return should_activate
}

// NOT checking doc.styleSheets: a <link> still loading has no sheet yet => a fast double click would inject twice
function getꓽstylesheet_links(doc: Document, href: string): HTMLLinkElement[] {
	const href‿abs = new URL(href, doc.baseURI).href
	return Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"]')).filter(
		(link_elt) => link_elt.href === href‿abs,
	)
}

function getꓽstory_documents(): Document[] {
	return getꓽstory_iframes()
		.map((iframe_elt) => iframe_elt.contentDocument)
		.filter((doc): doc is Document => {
			if (!doc) {
				console.warn(
					`[${LIB}] Story iframe without an accessible document, skipping (not loaded? not same-origin?)`,
				)
				return false
			}
			return true
		})
}

function getꓽstory_iframes(): HTMLIFrameElement[] {
	return Array.from(document.getElementsByClassName(IFRAME_CLASS)).filter((elt): elt is HTMLIFrameElement => {
		if (!(elt instanceof HTMLIFrameElement)) {
			console.error(`[${LIB}] Unexpected element with class "${IFRAME_CLASS}" not being an iframe!`, {
				elt,
			})
			return false
		}
		return true
	})
}

/////////////////////////////////////////////////

import { wireUp, load } from "button-sounds"

import { styles‿urlstr as DIAGNOSTICS_CSS_URL } from "@monorepo-private/css--utils--diagnostics/styles_url"

import { DEBUG, LIB } from "../../../../../consts.ts"
import { type ObservableState } from "../../../../../l1-flux/l2-observable/index.ts"
import { IFRAME_CLASS } from "../../consts.ts"
