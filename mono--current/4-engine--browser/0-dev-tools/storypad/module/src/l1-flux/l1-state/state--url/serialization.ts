/* serialization/deserialization related to the state stored in url
 */

import { assert_from, assert } from "@monorepo-private/assert"

import { SEPⵧSEGMENTS, SEPⵧSTORY } from "../../../consts.ts"
import type { StoryUId } from "../types.ts"

/////////////////////////////////////////////////

function getꓽlast_segment(uid: StoryUId): string {
	const segments = uid.split(SEPⵧSEGMENTS)
	const story_name = segments.pop()
	assert(story_name, `serializeꓽstory_uid() expecting a final story basename! "${uid}"`)
	return story_name
}

function serializeꓽstory_uid(uid: StoryUId): string {
	const segments = uid.split(SEPⵧSEGMENTS)
	const story_name = segments.pop()
	assert(story_name, `serializeꓽstory_uid() expecting a final story basename! "${uid}"`)

	// NO! a simple story at the root of ./src may have no path, perfectly normal
	//assert(segments.length > 0, `serializeꓽstory_uid() expecting path segments! "${uid}"`)

	let path = segments.join(SEPⵧSEGMENTS)
	if (path === SEPⵧSEGMENTS) path = ""
	// follow Storybook
	// ex. seen =/story/section-header--default
	const result = path ? [path, story_name].join(SEPⵧSTORY) : story_name

	//console.debug(`serializeꓽstory_uid(${uid}) -> "${result}"`)

	return result
}

function unserializeꓽstory_uid(serialized_uid: string | undefined | null): StoryUId | undefined {
	if (!serialized_uid) return undefined

	try {
		const split = serialized_uid.split(SEPⵧSTORY)
		const story_name = split.pop()
		let path = split.join(SEPⵧSTORY) // rejoin in case the path used the story sep inside

		assert(story_name, `unserializeꓽstory_uid() expecting a final story basename! "${serialized_uid}"`)

		// NO! there may be no path if trivial story at the root
		//assert(path, `unserializeꓽstory_uid() expecting path! "${serialized_uid}"`)
		if (path === SEPⵧSEGMENTS) {
			// means there is no path (as explained in the previous comment)
			path = ""
		}

		const result = path ? [path, story_name].join(SEPⵧSEGMENTS) : story_name

		//console.debug(`unserializeꓽstory_uid(${serialized_uid}) -> "${result}"`)

		return result
	} catch (err: unknown) {
		// QParams = user input, notoriously unsafe
		// fallback to undef
		console.warn(`Error unserializing the story path:`, err)
		return undefined
	}
}
/////////////////////////////////////////////////

export { getꓽlast_segment, serializeꓽstory_uid, unserializeꓽstory_uid }
