import { init, reducer_bulk } from "@tbrpg/interfaces"
import type { State } from "@tbrpg/state"
// https://github.com/sindresorhus/emittery#isdebugenabled
import React, { useSyncExternalStore } from "react"

import { RichText } from "@monorepo-private/rich-text-format--to-react"
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"
import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"

import { renderꓽpanelꘌequipment } from "./index.ts"

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

export const Init: Story‿v3 = {
	args: {
		$doc: renderꓽpanelꘌequipment(init()),
	},
}

export const Later: Story‿v3 = {
	args: {
		$doc: renderꓽpanelꘌequipment(
			reducer_bulk(init(), [
				{ type: "play" },
				{ type: "play" },
				{ type: "play" },
				{ type: "play" },
				{ type: "play" },
				{ type: "play" },
				{ type: "play" },
			]),
		),
	},
}

/////////////////////////////////////////////////
