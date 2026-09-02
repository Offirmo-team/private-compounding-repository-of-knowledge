import { type UState } from "@tbrpg/state"

import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"

function getꓽrecap(u_state: Immutable<UState>): RichText.Document {
	const is_new_game = u_state.progress.statistics.good_play_count === 0
	if (is_new_game) {
		// TODO redo clearer!!!
		return RichText.fragmentⵧinline()
			.pushText("You are an ")
			.pushStrong("otherworlder")
			.pushText(", an adventurer from another world…⎨⎨br⎬⎬")
			.pushText("Congratulations, you were chosen to enter the unknown realm of ")
			.pushStrong("Jaema")
			.pushText("!⎨⎨br⎬⎬")
			.pushText("Maybe were you just more courageous, cunning and curious than your peers?⎨⎨br⎬⎬")
			.pushText("But for now, let’s go on an adventure, for glory ⚔ and loot 📦 💰 !")
			.done()
	}

	return RichText.fragmentⵧblock()
		.pushText("You are ")
		.pushInlineFragment(u_state.avatar.name, {
			id: "name",
			classes: ["avatar__name"],
		})
		.pushText(", the ")
		.pushInlineFragment(u_state.avatar.klass, {
			id: "class",
			classes: ["avatar__class"],
		})
		.pushText(" from another world.⎨⎨br⎬⎬")
		.pushText("You are adventuring in the mysterious world of ")
		.pushStrong("Jaema")
		.pushText("…⎨⎨br⎬⎬")
		.pushStrong("For glory ⚔  and loot 📦 💰 !")
		.done()
}

export { getꓽrecap }
