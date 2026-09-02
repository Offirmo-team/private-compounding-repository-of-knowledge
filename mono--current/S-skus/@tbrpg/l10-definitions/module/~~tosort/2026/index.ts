import chalk from 'chalk'

import { injectꓽlibꓽchalk, prettifyꓽjson } from '@monorepo-private/prettify-any'
import * as RichText from '@monorepo-private/rich-text-format'
import to_terminal from '@monorepo-private/rich-text-format--to-terminal'

import * as State from '@tbrpg/state'
import * as RRT from '@tbrpg/ui--rich-text'

import '../services/misc.js'

/////////////////////////////////////////////////

let state = State.create()
state = State.on_start_session(state)
state = State.update_to_now(state)

/////////////////////////////////////////////////
/*
console.log('/////////////////////////////////////////////////')
console.log(state)
*/
/*
console.log('/////////////////////////////////////////////////')
import { prettifyꓽjson } from '@monorepo-private/prettify-any'
console.log(prettifyꓽjson(state))
*/
/*
console.log('/////////////////////////////////////////////////')
import { renderꓽstateⵧprettified_text } from '../view/offirmo-state/generic--to-text.js'
console.log(renderꓽstateⵧprettified_text(state))
*/
/*
console.log('/////////////////////////////////////////////////')
import { renderꓽstateⵧrich_text } from '../view/offirmo-state/generic--to-rich-text.js'
const $doc = renderꓽstateⵧrich_text(state, {})
console.log(to_terminal($doc))
*/
/////////////////////////////////////////////////

function loop() {
	console.log('/////////////////////////////////////////////////')
	// always first
	const $doc = State.getꓽrecap(state.u_state) // TODO clarify recap/mode
	console.log(prettifyꓽjson($doc))
	console.log(to_terminal($doc))

	console.log('/////////////////////////////////////////////////')
	// achievements are sent through engagement
	while (State.getꓽoldest_pending_engagementⵧflow(state.u_state)) {
		const pef = State.getꓽoldest_pending_engagementⵧflow(state.u_state)!
		console.log('[PEF]', to_terminal(pef.$doc))
		state = State.acknowledge_engagement_msg_seen(state, pef.uid)
	}

	while (State.getꓽoldest_pending_engagementⵧnon_flow(state.u_state)) {
		const penf = State.getꓽoldest_pending_engagementⵧnon_flow(state.u_state)!
		console.log('[PENF]', to_terminal(penf.$doc))
		state = State.acknowledge_engagement_msg_seen(state, penf.uid)
	}

	console.log('/////////////////////////////////////////////////')
	// TODO should be part of recap?
	if (State.is_inventory_full(state.u_state)) {
		console.warn('[special message] Inventory is full!')
	}
	if(State.getꓽavailable_energy‿float(state.t_state) >= 1) {
		console.log('[special message] You can play now!')
	}

	console.log('/////////////////////////////////////////////////')
	console.log('Actions:', RichText.renderⵧto_actions($doc))
}

/////////////////////////////////////////////////

loop()
state = State.play(state)
loop()
