import { createꓽstore } from "@tbrpg/interfaces"
import type { State } from "@tbrpg/state"
// https://github.com/sindresorhus/emittery#isdebugenabled
import React, { useSyncExternalStore } from "react"

import { RichText } from "@monorepo-private/rich-text-format--to-react"
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"
import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"

import { renderꓽgame_info, renderꓽgame_header } from "./meta.ts"

/////////////////////////////////////////////////

const { subscribe, getSnapshot, dispatch } = createꓽstore()

/////////////////////////////////////////////////

export default {
	component: RichText,

	args: {
		_debug: true,
	},

	parameters: {
		//layout: "bare",
	},
} satisfies Meta‿v3

/////////////////////////////////////////////////

export const GameInfo: Story‿v3 = {
	args: {
		$doc: renderꓽgame_info({
			foo: "bar",
		}),
	},
}

export const GameHeader: Story‿v3 = {
	args: {
		$doc: renderꓽgame_header(),
	},
}

/////////////////////////////////////////////////
