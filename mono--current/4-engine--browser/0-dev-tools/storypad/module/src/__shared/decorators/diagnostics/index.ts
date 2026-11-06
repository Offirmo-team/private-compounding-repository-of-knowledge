/////////////////////////////////////////////////
// TODO 1D make it a toggable integrated feature

export function decorateWithCSSDiagnostics(story: any) {
	// @ts-expect-error TODO fix CSS import typing
	import("../../../__vendor/@monorepo-private/css--utils--diagnostics/index.css")
	return story
}
export default decorateWithCSSDiagnostics

/////////////////////////////////////////////////
