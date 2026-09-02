/* PROMPT
 */

import { assert_from, assert } from "@monorepo-private/assert"
import type { Url‿str } from "@monorepo-private/ts--types"

import { type StoryUId, RenderMode, isꓽrender_mode } from "../types.ts"

import { QUERYPARAMS } from "./consts.ts"
import { serializeꓽstory_uid, unserializeꓽstory_uid } from "./serialization.ts"

/////////////////////////////////////////////////

function _getꓽcurrent_urlⵧup_to_pathname‿str(): string {
	const location = document.location
	return location.origin + location.pathname
}

function _getꓽcurrent_url__search_params(): URLSearchParams {
	const url‿obj = new URL(window.location.href)
	return url‿obj.searchParams
}

function getꓽmain_frame_url‿obj(uid?: StoryUId): URL {
	const url = new URL(_getꓽcurrent_urlⵧup_to_pathname‿str())

	if (uid) {
		url.searchParams.set(QUERYPARAMS.story_path, serializeꓽstory_uid(uid))
	}

	url.searchParams.sort()

	return url
}

/** Return the normalized, state-enriched URL loading this storypad with the given activated story + misc */
function getꓽmain_frame_url(uid?: StoryUId): Url‿str {
	return getꓽmain_frame_url‿obj(uid).href
}

function getꓽstory_frame_url(uid?: StoryUId): Url‿str {
	const url = getꓽmain_frame_url‿obj(uid)

	// let's be explicit
	url.searchParams.set(QUERYPARAMS.render_mode, "story")
	url.searchParams.sort()

	return url.href
}

function getꓽexplicit_render_mode(): RenderMode | undefined {
	const url‿obj = new URL(window.location.href)

	const candidate = url‿obj.searchParams.get(QUERYPARAMS.render_mode)
	if (isꓽrender_mode(candidate)) return candidate

	return undefined
}

function getꓽexplicit_story_uid(): StoryUId | undefined {
	const search_params = _getꓽcurrent_url__search_params()

	let candidate_raw = search_params.get(QUERYPARAMS.story_path)
	//console.log('candidate_raw', candidate_raw)
	let candidate = unserializeꓽstory_uid(candidate_raw)
	if (candidate) return candidate

	candidate_raw = search_params.get(QUERYPARAMS.story_uid)
	//console.log('candidate_raw', candidate_raw)
	candidate = unserializeꓽstory_uid(candidate_raw)
	if (candidate) return candidate

	return undefined
}

/////////////////////////////////////////////////

export {
	getꓽmain_frame_url,
	getꓽstory_frame_url,
	getꓽexplicit_render_mode,
	getꓽexplicit_story_uid,

	// for debug
	_getꓽcurrent_url__search_params,
}
