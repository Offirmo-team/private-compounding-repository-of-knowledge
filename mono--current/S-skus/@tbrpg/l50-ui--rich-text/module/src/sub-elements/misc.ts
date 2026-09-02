import { type State } from "@tbrpg/state"
import * as Energy from "@tbrpg/state--energy"

import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

function renderꓽstatus(state: Immutable<State>): RichText.Document {
	const max = state.u_state.energy.max_energy
	const current = Energy.getꓽavailable_energy‿int(state.t_state.energy)

	const energy = RichText.fragmentⵧblock()
		.pushSubNodes({ energy: `Energy: ${current}/${max}` })
		.pushText(" ⇒ ")
		.pushSubNodes({
			summary:
				current >= 1
					? "You can play right now!"
					: ` You can play in ${Energy.getꓽhuman_time_to_next(state.u_state.energy, state.t_state.energy)}.`,
		})
		.addHints({
			possible_emoji: "⚡",
		})
		.done()

	const $doc = RichText.fragmentⵧblock()
		.pushSubNodes({ energy })
		.pushSubNodes({
			progress: `you played ${state.u_state.progress.statistics.good_play_count + state.u_state.progress.statistics.bad_play_count} times so far.`,
		})
		.done()

	return $doc
}

/////////////////////////////////////////////////

export { renderꓽstatus }

//$builder = $builder.pushBlockFragment('You can play now!')
/*
if(AppState.getꓽavailable_energy‿float(state.t_state) >= 1) {
	$builder = $builder.pushBlockFragment('You can play now!')
}
else {
	$builder = $builder.pushBlockFragment('You can play again in ' + AppState.getꓽhuman_time_to_next_energy(state))
}*/
