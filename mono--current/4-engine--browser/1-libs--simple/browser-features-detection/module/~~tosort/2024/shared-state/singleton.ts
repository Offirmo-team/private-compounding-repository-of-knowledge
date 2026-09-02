import assert from '@monorepo-private/assert/v1'
import memoize_one from 'memoize-one'
import { Immutable } from '@monorepo-private/ts--types'

import EventEmitter from 'emittery'

import { State } from './types'
import {
	create,
	report_shared_state_change,
	log_anything,
} from './reducers'

////////////////////////////////////

const EMITTER_EVT = 'change'
const MAX_SUBSCRIBERS_COUNT = 5

export const get_singleton = memoize_one(function _create_shared_state_singleton() {
	let state = create()

	const emitter = new EventEmitter<{ [EMITTER_EVT]: string }>()

	return {
		get(): Immutable<State> { return state },
		subscribe(callback: () => void, debug_id?: string): () => void {
			//console.log(`shared state singleton subscribed: ${debug_id}`)
			const unbind = emitter.on(EMITTER_EVT, (src: string) => {
				callback()
			})
			assert(emitter.listenerCount() <= MAX_SUBSCRIBERS_COUNT, `shared state singleton: too many subscribes, is there a leak? (${debug_id})`)
			return () => {
				//console.log(`shared state singleton UNsubscribed: ${debug_id}`)
				unbind()
			}
		}
	}
})
