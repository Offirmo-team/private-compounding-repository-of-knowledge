import assert from 'tiny-invariant'
import type { Immutable } from '@monorepo-private/ts--types'

import {  } from './types.js'

/////////////////////////////////////////////////

type Callback = (tms: number, id?: string) => void

interface PulseOptions {
	visual: boolean // means that we don't need pulse if app is not visible
	cloud: boolean  // means that we don't need pulse if app is no network

	ideal_period‿ms: number // BEST EFFORT since will be sampled from requestAnimationFrame anyway
}

interface State {
	logger: Console

	max_fps: number

	subscriptions: {
		[id: string]: {
			options: PulseOptions
			callback: Callback
			last_call_tms: number
		}
	}

	_cache: {
		min_period_ms: number
	}

	// debug
	pulse_count: number
	last_activity‿tms: number
	last_activity_check‿tms: number
}


/////////////////////////////////////////////////

export {
	type Callback,
	type PulseOptions,
	type State,
}
