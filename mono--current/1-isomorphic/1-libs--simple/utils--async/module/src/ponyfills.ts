import { assert_from, assert } from "@monorepo-private/assert"

/////////////////////////////////////////////////

// XXX DO NOT USE XXX
// - queueMicrotask() SHOULD ALWAYS BE PREFERRED
// - node only so far, semantic changed in >=0.9.1
//
// Adds callback to the "next tick queue".
// This queue is fully drained after the current operation on the JavaScript stack runs to completion
// and before the event loop is allowed to continue.
// It's possible to create an infinite loop if one were to recursively call process.nextTick()
/** @deprecated Use queueMicrotask() instead */
const nextTick: (callback: Function, ...args: any[]) => void =
	(globalThis as any).process?.nextTick ||
	function nextTickPonyFill(callback: Function, ...args: any[]): void {
		// closest possible effect in browser
		queueMicrotask(() => callback(...args))
	}

// XXX DO NOT USE except for very special nodejs I/O cases
// This primitive is node-only so far >=0.9.1 and not on track to be standardized https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate
// Schedules the "immediate" execution of the callback after I/O events' callbacks.
// that could happen in current event loop or in the next one, depending on where we are
interface Immediate {
	// credits: node typings
	hasRef(): boolean
	ref(): this
	unref(): this
	_onImmediate: Function // to distinguish it from the Timeout class
}
const setImmediate: (callback: (...args: any[]) => void, ...args: any[]) => Immediate =
	(globalThis as any).setImmediate || // <any>: as of @type/node 11 setImmediate is not very well typed, my typing is better IMO
	function setImmediatePonyFill(callback: (...args: any[]) => void, ...args: any[]): any {
		// closest possible effect. We should also provide clearImmediate()
		return setTimeout(callback, 0, ...args)
	}

// Originally browser only + not supported on Safari
// "will schedule work when there is free time at the end of a frame, or when the user is inactive"
// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
// Strange semantic of being clamped to 50ms
// https://developers.google.com/web/updates/2015/08/using-requestidlecallback
const MIN_IDLE_TIMEOUT_MS = 2 // since <=1 is all the same
const MAX_IDLE_TIMEOUT_MS = 50 // according to https://developers.google.com/web/updates/2015/08/using-requestidlecallback
interface IdleDeadline {
	didTimeout: boolean
	timeRemaining: () => number // limited avail https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline/timeRemaining
}
type IdleCallbackId = any
const requestIdleCallback: (callback: (info: IdleDeadline) => void, options?: { timeout?: number }) => IdleCallbackId =
	(globalThis as any).requestIdleCallback?.bind(globalThis) || // yes, the bind is needed
	function requestIdleCallbackPonyFill(
		callback: (info: IdleDeadline) => void,
		{ timeout }: { timeout?: number } = {},
	): IdleCallbackId {
		// inspired from https://developers.google.com/web/updates/2015/08/using-requestidlecallback#checking_for_requestidlecallback

		if (timeout !== undefined) {
			assert(timeout >= MIN_IDLE_TIMEOUT_MS, "whats the point in requesting idle with a short timeout??")
			assert(timeout <= MAX_IDLE_TIMEOUT_MS, "must be an error requesting idle with a timeout of more than 50ms??") // unsure, cf. https://developer.chrome.com/blog/using-requestidlecallback
		}

		let startTime = Date.now()
		function timeRemaining() {
			// remaining in the idle period, NOT relative to timeout
			// 50 = doing the same as Google https://developer.chrome.com/blog/using-requestidlecallback#checking_for_requestidlecallback
			// TODO improve (if useful)
			return Math.max(0, (timeout || 50) - (Date.now() - startTime))
		}

		const simulated_idle_delay_ms = Math.min(
			timeout || Infinity,
			// There is no concept of "idle" in node.js see https://github.com/nodejs/node/issues/2543
			// So, when should we run this payload?
			// - not too quickly, since the semantic of this function is for "background" work
			// - but not too far either, cf. discussions in comments above, no more than 50ms
			//   according to Chrome, rIC replaces a direct invocation, so its default should be short
			// - we CAN'T use a random value bc subsequent calls to rIC() must be ordered
			// - interestingly, the semantic function asap_but_out_of_current_event_loop() settles on ~2ms
			//   so since this function is lower priority, we should use a delay ABOVE this one
			// = we should use 2 < n < 50
			// - also the semantic of this function is after rAF() and
			//   - 1 frame at 60fps is ~16ms "the most common refresh rate" according to MDN
			//   - 1 frame at 30fps is ~33ms
			//   - 1 frame at 24fps is ~42ms
			// we settle on 37ms = slightly above 1 frame @30fps + not being round + 1337 "leet" ;)
			37,
		)

		return setTimeout(() => {
			callback({
				didTimeout: false, // this is a shim https://developer.chrome.com/blog/using-requestidlecallback#checking_for_requestidlecallback
				timeRemaining,
			})
		}, simulated_idle_delay_ms)
	}

// TODO one day cancelIdleCallback (I don't need it)

/////////////////////////////////////////////////

export { nextTick, setImmediate, requestIdleCallback, type IdleCallbackId, type IdleDeadline }
