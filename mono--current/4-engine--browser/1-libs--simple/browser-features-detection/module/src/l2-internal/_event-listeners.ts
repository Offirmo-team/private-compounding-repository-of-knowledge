import { LIB, DEBUG } from "../consts.ts"
import { is_browser_connected_to_a_network } from "../l1-is-online/index"
import { is_browser_page_visible } from "../l1-is-page-visible/index"

if (DEBUG) console.info(`[${LIB}] Hello!`)

/////////////////////////////////////////////////

// https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
let has_seenꓽkey_usageⵧtab = false // so far

// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
let has_seenꓽtouch_usage = false // so far

// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
// tricky bc for ex. Safari iOs sends mouse event for compatibility
//let has_seen_credible_mouse_usage = false // so far

/////////////////////

function onꓽkeydown(evt: WindowEventMap["keydown"]) {
	if (evt.keyCode === 9) {
		// tab => "I am a keyboard user"
		if (DEBUG) console.info(`[${LIB}] Keyboard usage detected! (tab key)`)

		has_seenꓽkey_usageⵧtab = true
		document.body.classList.add("user-is-tabbing")

		window.removeEventListener("keydown", onꓽkeydown)
	}
}
window.addEventListener("keydown", onꓽkeydown)

/////////////////////

function onꓽtouch_start() {
	if (DEBUG) console.info(`[${LIB}] touch detected!`)

	has_seenꓽtouch_usage = true

	window.removeEventListener("touchstart", onꓽtouch_start)
}
window.addEventListener("touchstart", onꓽtouch_start)

/////////////////////

// https://developer.mozilla.org/en-US/docs/Web/Events/pointerover
function onꓽpointer_over(evt: WindowEventMap["pointerover"]) {
	if (DEBUG) console.info(`[${LIB}] pointer event`, { evt, type: evt.pointerType, pointerType: evt.pointerType })

	switch (evt.pointerType) {
		case "touch":
			if (DEBUG) console.info(`[${LIB}] seen touch usage!`)
			has_seenꓽtouch_usage = true
			break

		case "pen":
			break

		case "mouse":
			// not reliable, Safari iOs emulates mouse hover
			break

		default:
			break
	}

	window.removeEventListener("pointerover", onꓽpointer_over)
}
window.addEventListener("pointerover", onꓽpointer_over)

/////////////////////

/*
// https://devdocs.io/dom/navigatoronline/online_and_offline_events
window.addEventListener('offline', (event) => {
	state = report_shared_state_change(state, '[⚡️offline] network connectivity changed to: ' + is_browser_connected_to_a_network())
	emitter.emit(EMITTER_EVT, `offline`)
})
window.addEventListener('online', (event) => {
	state = report_shared_state_change(state, '[⚡️online] network connectivity changed to: ' + is_browser_connected_to_a_network())
	emitter.emit(EMITTER_EVT, `online`)
})

document.addEventListener('visibilitychange', () => {
	state = report_shared_state_change(state, '[⚡️visibilitychange] visibility changed to: ' + is_browser_page_visible())
	emitter.emit(EMITTER_EVT, `visibilitychange`)
})
*/

/////////////////////

/*
// https://web.dev/bfcache/#apis-to-observe-bfcache
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		state = log_anything(state, '[⚡️pageshow] un-persisted from bfcache')
	} else {
		state = log_anything(state, '[⚡️pageshow] normal')
	}
	emitter.emit(EMITTER_EVT, `pageshow`)
})
window.addEventListener('pagehide', (event) => {
	state = log_anything(state, `[⚡️pagehide] persisted = ${event.persisted}`)
})

window.addEventListener('beforeunload', (event) => {
	state = log_anything(state, `[⚡️beforeunload]`)
	// A function that returns `true` if the page has unsaved changes.
	/*if (pageHasUnsavedChanges()) {
		event.preventDefault();
		return event.returnValue = 'Are you sure you want to exit?';
	}*
}, {capture: true})

window.addEventListener('unload', (event) => {
	state = log_anything(state, `[⚡️unload]`)
})
*/

/////////////////////////////////////////////////

export { has_seenꓽkey_usageⵧtab, has_seenꓽtouch_usage }
