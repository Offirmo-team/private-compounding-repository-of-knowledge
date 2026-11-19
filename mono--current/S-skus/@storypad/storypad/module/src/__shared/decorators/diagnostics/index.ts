/////////////////////////////////////////////////
// TODO 1D make it a toggable integrated feature

export function decorateWithCSSDiagnostics(story: any) {
	import("@monorepo-private/css--utils--diagnostics")
	return story
}
export default decorateWithCSSDiagnostics

/////////////////////////////////////////////////
