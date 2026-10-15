////////////////////////////////////////////////////////////////////////////////////

export function create(): State {
	return {
		config: {
			root_title: "Stories",
			decorators: [],
		},
		first_encountered_story‿uid: undefined,
		tree: createꓽfilesystem<StoryEntry, StoryFolder>(),
		annotations: {},
		view: get_default_state_view(),
	}
}

export function setꓽconfig(state: State, config: Immutable<Config> | undefined): State {
	return {
		...state,
		config: {
			...state.config,
			...(config as any), // break the Immutable, but we promise not to touch it!
		},
	}
}

/////////////////////////////////////////////////
// setup

export function registerꓽstory(state: State, story: StoryEntry, path: PathⳇRelative): State {
	const uid = insertꓽfile(state.tree, path, story)
	assert(uid === story.uid, `uid should be as expected! "${story.uid}" vs. "${uid}"`)

	if (!state.first_encountered_story‿uid) {
		state = {
			...state,
			first_encountered_story‿uid: state.first_encountered_story‿uid || uid,
		}
	}

	return state
}

// request:story = the user request to display the given story
// REMINDER other states have a similar reducer and functionality is split across those reducers
export function requestꓽstory(state: State, uid: StoryUId): State {
	//assert(getꓽstoryⵧby_uid(state, uid), `story should exist! "${uid}"`)

	// uid is ignored by this state (see the url one)

	state = {
		...state,
		//last_explicitly_activated_story‿uid: uid,

		// reset view state
		view: get_default_state_view(),
	}

	return state
}

/////////////////////////////////////////////////

export function addꓽannotation(state: State, key: string, value: JSONPrimitiveType): State {
	//console.warn("addꓽannotation", { key, value })
	return {
		...state,
		annotations: {
			...state.annotations,
			[key]: value,
		},
	}
}

// expand the tree all the way to the target
// id can be story or folder, don't mind
function folderⵧexpand(state: State, uid: StoryUId): State {
	console.warn("TODO folderⵧexpand")
	return state
}

function get_default_state_view(): State["view"] {
	return {
		manager: {
			sidebar: {},
		},
		story_area: {},
	}
}

/////////////////////////////////////////////////
import { assert_from, assert } from "@monorepo-private/assert"
import { createꓽfilesystem, insertꓽfile } from "@monorepo-private/data-structures"
import type { Immutable, JSONPrimitiveType, PathⳇRelative } from "@monorepo-private/ts--types"

import type { Config } from "../../../l0-types/l2-config/index.ts"
import type { StoryUId, StoryEntry, StoryFolder } from "../types.ts"

import type { State } from "./types.ts"
