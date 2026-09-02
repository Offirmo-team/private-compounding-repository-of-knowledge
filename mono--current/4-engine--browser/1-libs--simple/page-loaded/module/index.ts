/* Expose the state of page load/readiness
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
 * loading -> interactive -> complete
 * Beware of using the correct one!
 * 1. loading
 * 2. interactive
 *    fired as soon as the page DOM has been loaded, without waiting for resources to finish loading.
 *    The document has finished loading and we can access DOM elements.
 *    Sub-resources such as scripts, images, stylesheets and frames are still loading.
 * 3. complete
 *    The whole page has loaded,
 *    including all dependent resources such as
 *    stylesheets, scripts, iframes, and images, except those that are loaded lazily.
 */

const DEBUG = false

/////////////////////////////////////////////////
// DOMContentLoaded
// https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
// use case: we need HTML to start attaching react for ex.

const ೱᐧDOMContent_loaded: Promise<void> = (() => {
	const { promise, resolve, reject } = Promise.withResolvers<void>()

	if (document.readyState === "loading") {
		// Loading hasn't finished yet
		DEBUG && console.log(`ೱᐧDOMContent_loaded: adding a listener… (readyState = ${document.readyState})`)
		// important: this event is on "document"
		document.addEventListener("DOMContentLoaded", () => {
			DEBUG && console.log(`ೱᐧDOMContent_loaded: ⚡️DOMContentLoaded`)
			DEBUG && console.log(`ೱᐧDOMContent_loaded: resolving…`)
			resolve()
		})
	} else {
		// `DOMContentLoaded` has already fired
		DEBUG && console.log(`ೱᐧDOMContent_loaded: already loaded ✅`)
		DEBUG && console.log(`ೱᐧpage_loaded: resolving…`)
		resolve()
	}

	promise.then(() => {
		DEBUG && console.log(`ೱᐧDOMContent_loaded: fulfilled ✅`)
	})

	return promise
})()

/////////////////////////////////////////////////
// page loaded
// https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
// use case: some viewport stuff is not fully resolved until page loaded

const ೱᐧpage_loaded: Promise<void> = (() => {
	const { promise, resolve, reject } = Promise.withResolvers<void>()

	if (document.readyState !== "complete") {
		DEBUG && console.log(`ೱᐧpage_loaded: adding a listener… (readyState = ${document.readyState})`)
		// important: this event is on "window"
		window.addEventListener("load", () => {
			DEBUG && console.log(`ೱᐧpage_loaded: ⚡️load`)
			// ensure the promises are resolved in the right order
			// even if the page is already loaded when this library is imported
			ೱᐧDOMContent_loaded.then(() => {
				DEBUG && console.log(`ೱᐧpage_loaded: resolving…`)
				resolve()
			})
		})
	} else {
		// already loaded
		DEBUG && console.log(`ೱᐧpage_loaded: already loaded ✅`)
		// ensure the promises are resolved in the right order
		// even if the page is already loaded when this library is imported
		ೱᐧDOMContent_loaded.then(() => {
			DEBUG && console.log(`ೱᐧpage_loaded: resolving…`)
			resolve()
		})
	}

	promise.then(() => {
		DEBUG && console.log(`ೱᐧpage_loaded: fulfilled ✅`)
	})

	return promise
})()

/////////////////////////////////////////////////

export { ೱᐧDOMContent_loaded, ೱᐧpage_loaded }
