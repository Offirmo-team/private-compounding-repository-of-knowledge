import { type IdleDeadline, requestIdleCallback } from "./ponyfills.ts"

/////////////////////////////////////////////////

async function next_microtask(): Promise<void> {
	return Promise.resolve() // promise resolution is in microtasks

	// XXX should it be return Promise.resolve().then(() => {}) ??
	// XXX or even await "anything" ??
}

async function end_of_current_event_loop(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, 0)
	})
}

async function elapsed_time_ms(duration_ms: number): Promise<void> {
	await new Promise((resolve) => {
		setTimeout(resolve, duration_ms)
	})
	await end_of_current_event_loop() // extra wait for stuff that would fire exactly at the limit
}

async function next_idle(): Promise<IdleDeadline> {
	return new Promise<IdleDeadline>((resolve) => {
		requestIdleCallback(resolve)
	})
}

// useful for tests
async function all_planned_idle_executed(): Promise<void> {
	let info: IdleDeadline | undefined
	let safety: number = 10
	//console.log({ safety, dt: info?.didTimeout ?? true})
	while (--safety && (info?.didTimeout ?? true)) {
		info = await next_idle()
		//console.log({ safety, dt: info?.didTimeout ?? true})
	}
}

/////////////////////////////////////////////////

export { next_microtask, end_of_current_event_loop, elapsed_time_ms, next_idle, all_planned_idle_executed }
