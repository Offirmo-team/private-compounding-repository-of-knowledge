/** Use case: switching behavior (ex. storybook story vs. full app) Use case: reject being framed */

/////////////////////////////////////////////////

function isꓽframed(currentWindow = window): boolean {
	try {
		// https://stackoverflow.com/a/326076/587407
		return currentWindow.self !== currentWindow.top
	} catch {
		// Cross-origin iframes throw when accessing window.top
		return true
	}
}

/////////////////////////////////////////////////

export { isꓽframed }
