/////////////////////////////////////////////////

// https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
let has_seenꓽkey_usageⵧtab = false // so far

const DEBUG = false

/////////////////////

window.addEventListener("keydown", function onꓽkeydown(evt) {
	if (evt.keyCode === 9) {
		// tab => "I am a keyboard user"
		if (DEBUG) console.info(`[@monorepo-private/css--framework] Keyboard usage detected! (tab key)`)

		has_seenꓽkey_usageⵧtab = true
		document.body.classList.add("user-is-tabbing")

		window.removeEventListener("keydown", onꓽkeydown)
	}
})
