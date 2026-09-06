import type { Css‿str } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

// complex CSS,
// This is a COPY
// keep it in sync with ../../../../../../3-advanced--browser/css--framework/src/atomic/atomic--dimension.css
const CSS: Css‿str = `
/* make this app use exactly the full viewport.
 * This is VERY TRICKY CSS,
 * see full explanation: https://github.com/Offirmo/offirmo-monorepo/blob/main/stack--current/3-advanced--browser/css--framework/src/atomic/atomic--dimension.css
 */
@layer temp-while-loading {
	*:has(.o⋄full-viewport) {
		margin: 0;
		padding: 0;
		border: initial;
	}
	o⋄full-viewport {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		width: 100lvw;
		height: 100lvh;
		max-width: initial;
	}
}
`

/////////////////////////////////////////////////

export default CSS
