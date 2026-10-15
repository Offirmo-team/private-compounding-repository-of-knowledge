/////////////////////////////////////////////////
// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

export default function renderꓽtitlebar(state: ObservableState): HTMLElement {
	const root = document.createElement("div")
	root.classList.add("storypad⋄ui-element", "storypad⋄controlbar")

	import("./index.css")

	const storyEntry = state.getꓽstoryⵧcurrent()
	if (!storyEntry) {
		root.innerText = `[No current story]`
		return root
	}

	DEBUG &&
		console.log(`renderꓽcontrolbar()`, {
			storyEntry,
			href: state.getꓽstory_frame_url(storyEntry.uid),
		})

	const title = [storyEntry.meta?.title ?? "", storyEntry.story.name || getꓽlast_segment(storyEntry.uid)]
		.filter((s) => !!s)
		.join("/")

	root.innerHTML = `
<strong>${title}</strong>
<small><code>${storyEntry.uid}</code></small>
<div class="storypad⋄controlbar__filler"></div>
<a target="_blank" href="${state.getꓽstory_frame_url(storyEntry.uid)}">↗</a>
		`

	return root
}

/////////////////////////////////////////////////

import { DEBUG } from "../../../../../consts.ts"
import { getꓽlast_segment } from "../../../../../l1-flux/l1-state/state--url/serialization.ts"
import { type ObservableState } from "../../../../../l1-flux/l2-observable/index.ts"
