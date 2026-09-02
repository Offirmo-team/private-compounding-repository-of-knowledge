/////////////////////////////////////////////////

// conservative
function is_browser_connected_to_a_network(): boolean {
	/* https://devdocs.io/dom/navigatoronline/online
	 * while you can assume that the browser is offline when [this] returns a false value,
	 * you cannot assume that a true value necessarily means that the browser can access the internet.
	 * You could be getting false positives
	 */
	if (globalThis.navigator?.onLine === false) return false

	return true
}

/////////////////////////////////////////////////

export { is_browser_connected_to_a_network }
