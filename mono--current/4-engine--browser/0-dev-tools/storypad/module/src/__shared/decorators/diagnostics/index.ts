function decorateWithCSSDiagnostics(story: any) {
	// @ts-expect-error TODO fake TS
	import("@monorepo-private/css--utils--diagnostics")
	return story
}

/////////////////////////////////////////////////

export { decorateWithCSSDiagnostics }
export default decorateWithCSSDiagnostics
