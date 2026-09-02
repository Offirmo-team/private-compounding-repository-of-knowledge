async function init(): Promise<void> {
	// for stability
	// TODO 1D make it overridable? Or users can overwrite it with a decorator.
	document.documentElement.setAttribute("lang", "en")
}

/////////////////////////////////////////////////

export default init
