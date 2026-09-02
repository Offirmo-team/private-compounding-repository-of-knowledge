import { requestIdleCallback } from "./ponyfills.ts"

/////////////////////////////////////////////////

type Callback<T> = () => T

const DELAY_UNTIL_NEXT_EVENT_LOOP_MS = 1 // for v8 = Chrome/nodejs, 1ms is the minimum
const BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS = 2 * DELAY_UNTIL_NEXT_EVENT_LOOP_MS // to account for outdated code using setTimeout(0)
const FRAME_DURATION_MS = Math.floor(1000 / 60) // 60 fps
const HUMAN_PERCEPTION_MS = 100 // https://developers.google.com/web/updates/2015/08/using-requestidlecallback
const MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS = Math.floor(HUMAN_PERCEPTION_MS / 2) // https://developers.google.com/web/updates/2015/08/using-requestidlecallback

// ALWAYS "not too far" bc we never want to wait forever!
function schedule_when_idle_but_not_too_far<T>(
	callback: Callback<T>,
	timeout_ms: number = MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS,
): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		requestIdleCallback(
			() => {
				try {
					resolve(callback())
				} catch (err) {
					// in case the callback throws synchronously
					reject(err)
				}
			},
			{ timeout: timeout_ms },
		)
	})
}

function schedule_when_idle_but_within_human_perception<T>(callback: Callback<T>): Promise<T> {
	// yes, same as above but semantically different
	// and timeout may be different
	return schedule_when_idle_but_not_too_far(callback, MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS)
}

function asap_but_not_synchronous<T>(callback: Callback<T>): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		queueMicrotask(() => {
			try {
				resolve(callback())
			} catch (err) {
				// in case the callback throws synchronously
				reject(err)
			}
		})
	})
}

function asap_but_out_of_immediate_execution<T>(callback: Callback<T>): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		setTimeout(() => {
			try {
				resolve(callback())
			} catch (err) {
				// in case the callback throws synchronously
				reject(err)
			}
		}, BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS)
	})
}
function asap_but_out_of_current_event_loop<T>(callback: Callback<T>): Promise<T> {
	// yes, same as above but semantically different
	return asap_but_out_of_immediate_execution(callback)
}

// TODO double requestAnimationFrame
// https://github.com/ryanve/draf
//function asap_after_animation_starts_properly()

/////////////////////////////////////////////////

// https://blog.izs.me/2013/08/designing-apis-for-asynchrony
function dezalgo(callback: Callback<void>): Callback<void> {
	return () => asap_but_not_synchronous(callback)
}

/////////////////////////////////////////////////

export {
	schedule_when_idle_but_not_too_far,
	schedule_when_idle_but_within_human_perception,
	asap_but_not_synchronous,
	asap_but_out_of_immediate_execution,
	asap_but_out_of_current_event_loop,
	dezalgo,
}
