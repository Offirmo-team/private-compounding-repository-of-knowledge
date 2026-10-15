/////////////////////////////////////////////////
// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

export default function renderꓽtoolbar(state: ObservableState): HTMLElement {
	const root = document.createElement("div")
	root.classList.add("storypad⋄ui-element", "storypad⋄header⋄toolbar")

	//import("./index.css")

	// reload
	root.appendChild(
		(function getReloadButton() {
			const button = document.createElement("button")
			button.innerText = "🔄"
			//button.disabled = true

			button.onclick = () => {
				console.clear()
				console.log("Reloading the story iframe(s)...")
				Array.from(document.getElementsByClassName(IFRAME_CLASS))
					.filter((elt): elt is HTMLIFrameElement => {
						if (!(elt instanceof HTMLIFrameElement)) {
							console.error(`[${LIB}] Unexpected element with class "${IFRAME_CLASS}" not being an iframe!`, {
								elt,
							})
							return false
						}
						return true
					})
					.forEach((iframe_elt) => iframe_elt.contentWindow?.location.reload())
			}
			return button
		})(),
	)

	// debug CSS
	root.appendChild(
		(() => {
			const button = document.createElement("button")
			button.innerText = "🪲"
			button.disabled = true
			return button
		})(),
	)

	// viewport
	root.appendChild(
		(() => {
			const button = document.createElement("button")
			button.innerText = "🔲"
			button.disabled = true
			return button
		})(),
	)

	return root
}

/////////////////////////////////////////////////

import { DEBUG, LIB } from "../../../../../consts.ts"
import { type ObservableState } from "../../../../../l1-flux/l2-observable/index.ts"
import { IFRAME_CLASS } from "../../consts.ts"
