import type { Css‿str } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

const CSS: Css‿str = `
/* apply a natural box layout model to all elements
 * https://www.paulirish.com/2012/box-sizing-border-box-ftw/
 * https://github.com/mike-engel/a11y-css-reset/pull/12#issuecomment-516582884
 */
:root                  { box-sizing: border-box; }
*, *::before, *::after { box-sizing: inherit; }
`

/////////////////////////////////////////////////

export default CSS
