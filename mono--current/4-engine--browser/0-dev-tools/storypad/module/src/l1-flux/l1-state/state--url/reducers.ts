/* PROMPT
 */

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { StoryUId } from "../types.ts"

import { getꓽmain_frame_url } from "./selectors.ts"

/////////////////////////////////////////////////

function requestꓽstory(uid: StoryUId): void {
	const new_url = getꓽmain_frame_url(uid)

	//console.log('about to history.pushState()', new_url)

	history.pushState({}, "", new_url)
}

/////////////////////////////////////////////////

export { requestꓽstory }
