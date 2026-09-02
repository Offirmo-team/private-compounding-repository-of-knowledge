import { assert_from, assert } from "@monorepo-private/assert"
import { createꓽfilesystem, insertꓽfile } from "@monorepo-private/data-structures"
import type { Immutable, PathⳇRelative } from "@monorepo-private/ts--types"

import type { Config } from "../../../l0-types/l2-config/index.ts"
import type { StoryUId, StoryEntry, StoryFolder } from "../types.ts"

import type { State } from "./types.ts"

////////////////////////////////////////////////////////////////////////////////////

function get_default_state_view(): State["view"] {
	return {
		manager: {
			sidebar: {},
		},
		story_area: {
			drawer: {
				status_bar: {
					pills: {},
				},
			},
		},
	}
}

function create(): State {
	return {
		config: {
			root_title: "Stories",
			decorators: [],
		},
		first_encountered_story‿uid: undefined,
		tree: createꓽfilesystem<StoryEntry, StoryFolder>(),
		view: get_default_state_view(),
	}
}

function setꓽconfig(state: State, config: Immutable<Config> | undefined): State {
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

function registerꓽstory(state: State, story: StoryEntry, path: PathⳇRelative): State {
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

/////////////////////////////////////////////////

// TODO clarify
function requestꓽstory(state: State, uid: StoryUId): State {
	//assert(getꓽstoryⵧby_uid(state, uid), `story should exist! "${uid}"`)
	state = {
		...state,
		//last_explicitly_activated_story‿uid: uid,
		view: get_default_state_view(),
	}

	return state
}

function addꓽannotation(state: State, key: string, value: string): State {
	console.log(`TODO annotations!`, { key, value })

	return state
}

// expand the tree all the way to the target
// id can be story or folder, don't mind
function folderⵧexpand(state: State, uid: StoryUId): State {
	console.warn("TODO folderⵧexpand")
	return state
}

/////////////////////////////////////////////////

export { create, setꓽconfig, registerꓽstory, requestꓽstory, addꓽannotation }
