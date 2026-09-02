// useful to disable tooltips on touch-only device
// Tooltips are a nice addition but don't play well with touch, especially on iOs.

import { has_seenꓽtouch_usage } from "../l2-internal/_event-listeners.ts"
import { getꓽmedia_queriesⵧrelevant } from "../l2-internal/_media-queries.ts"

/////////////////////////////////////////////////

// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-hover
// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
function hasꓽhover(): boolean | undefined {
	// from more trustable to less trustable:

	const relevant_media_queries = getꓽmedia_queriesⵧrelevant()

	// if a MQ is true, it should be reliable
	if (relevant_media_queries["(any-hover: hover)"]) {
		return true
	}
	if (relevant_media_queries["(any-hover: none)"]) return false

	if (relevant_media_queries["(any-pointer: fine)"]) {
		// assume the user has a mouse, so can hover
		return true
	}
	if (relevant_media_queries["(any-pointer: none)"]) {
		// assume the user has no mouse
		return false
	}

	if ("ontouchstart" in window || has_seenꓽtouch_usage) {
		// assume touchscreen = no pointer = no hover
		return false
	}

	return undefined
}

/////////////////////////////////////////////////

export { hasꓽhover }
