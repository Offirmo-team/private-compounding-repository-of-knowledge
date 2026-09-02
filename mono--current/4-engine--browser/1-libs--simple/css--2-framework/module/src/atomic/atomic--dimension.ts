import style_once from "@monorepo-private/style-once"

//console.log('Hello from atomic--dimension.ts!')

function adjust_css() {
	const referer = new URLSearchParams(window.location.search).get("ref")
	if (referer !== "webmanifest") return

	console.log(
		"Hello from @monorepo-private/css--framework / atomic--dimension.tsx: dynamically tweaking some CSS: o⋄full-viewport for iOs pinned app...",
	)
	style_once({
		id: "pinned-webapp-adjustments--viewport",
		css: `
:root {
	/* see @monorepo-private/css--framework/src/atomic/atomic--dimension.css#L28
	 * pinned apps on iOs: dv* are not full screen
	 */
	--o⋄full-viewport__width: 100lvw;
	--o⋄full-viewport__height: 100lvh;
}
`,
	})
}
adjust_css()
