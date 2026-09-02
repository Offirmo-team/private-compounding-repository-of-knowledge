/* Root render function
 */

import { isꓽframed } from "@monorepo-private/browser-features-detection/is-framed"

import { LIB } from "../../consts.ts"
import { RenderMode } from "../../l1-flux/l1-state/types.ts"
import type { ObservableState } from "../../l1-flux/l2-observable/index.ts"
import renderⵧmanager from "../l1-components/manager/index.ts"
import renderⵧstory from "../l1-components/preview/index.ts"
import renderꓽstoryᝍarea from "../l1-components/story-area/index.ts"

/////////////////////////////////////////////////

function renderꓽroot(state: ObservableState, container: HTMLElement = document.body) {
	console.group(`[${LIB}] ROOT RENDER [${isꓽframed() ? "SUB frame" : "TOP frame"}]`)

	const render_mode = state.getꓽrender_mode()
	console.log(`render_mode =`, render_mode)

	// to avoid triggering css--utils--diagnostics
	document.documentElement.setAttribute("lang", "en")
	const metaTag = document.createElement("meta")
	metaTag.setAttribute("charset", "utf-8")
	document.head.appendChild(metaTag)

	if (render_mode === RenderMode.story) {
		// we want to "pollute" the current window as few as possible
		void renderⵧstory(state, container)
	} else {
		// our stuff, we can be more free
		//import('@monorepo-private/css--framework/viewport.css')
		import("../index.css")

		const root = document.createElement("div")
		root.classList.add("o⋄full-viewport", "storypad⋄root")

		switch (render_mode) {
			case RenderMode.manager:
				root.appendChild(renderⵧmanager(state))
				break
			case RenderMode.story_full:
				root.appendChild(renderꓽstoryᝍarea(state))
				break
			default:
				console.error({ render_mode })
				throw new Error(`Unknown render mode!`)
		}

		container.appendChild(root)
	}

	console.groupEnd()
}

/////////////////////////////////////////////////

export default renderꓽroot
