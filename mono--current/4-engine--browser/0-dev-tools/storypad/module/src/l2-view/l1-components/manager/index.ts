// https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

import { assert_from, assert } from "@monorepo-private/assert"
import type { Url‿str } from "@monorepo-private/ts--types"

import { LIB, DEBUG } from "../../../consts.ts"
import type { FolderUId, StoryUId } from "../../../l1-flux/l1-state/types.ts"
import { ObservableState } from "../../../l1-flux/l2-observable"
import renderⵧstory_area from "../story-area"

import renderⵧsidebar from "./sidebar"

/////////////////////////////////////////////////

function renderꓽmanager(state: ObservableState): HTMLElement {
	const root = document.createElement("div")
	root.classList.add("o⋄full-viewport", "storypad⋄manager")

	// render the full UI:
	import("../../../__vendor/@monorepo-private/css--foundation/index.css")
	import("../../../__vendor/@monorepo-private/css--framework/index.css")
	import("./index.css")

	// 1. side panel
	const sidebar_elt = renderⵧsidebar(state)
	root.appendChild(sidebar_elt)
	// 2. story screen
	let story_area_elt = renderⵧstory_area(state)
	root.appendChild(story_area_elt)

	// navigation
	sidebar_elt.addEventListener("click", function (e) {
		const target = (e as any).target

		DEBUG && console.log(`[${LIB}] Click!`)

		const href: Url‿str = target?.href
		if (href) {
			e.preventDefault()

			console.clear()
			DEBUG && console.log(`———————————— [${LIB}] NAVIGATION ————————————`)
			const story_uid: StoryUId = target.getAttribute("id")
			DEBUG && console.log({ target, story_uid, href })

			state.requestꓽstory(story_uid)
			root.removeChild(story_area_elt)
			story_area_elt = renderⵧstory_area(state)
			root.appendChild(story_area_elt)
			/*
			const iframe_elts = stories_elt.getElementsByClassName(IFRAME_CLASS)
			Array.from(iframe_elts).forEach(iframe_elt => {
				(iframe_elt as HTMLIFrameElement).src = href
			})*/
			target.classList.add("current")
			return
		}

		const folder_uid: FolderUId = target?.closest("details")?.dataset?.folderUid
		if (folder_uid) {
			console.log("———————————— [${LIB}] TREE ————————————")
			console.log("TODO auto fold/unfold!")
			return
		}

		// no target or not recognized = random click anywhere, ignore
	})

	return root
}

/////////////////////////////////////////////////

export default renderꓽmanager
