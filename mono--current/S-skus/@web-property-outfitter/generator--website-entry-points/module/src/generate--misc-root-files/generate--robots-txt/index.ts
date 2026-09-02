import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import { isꓽpublic } from "../../selectors/index.ts"
import type { WebPropertySpec } from "../../types.ts"

/////////////////////////////////////////////////

function generate(spec: Immutable<WebPropertySpec>): string {
	// TODO only allowed from the top!!
	// TODO Sitemap: http://www.example.com/sitemap.xml

	return `
## www.robotstxt.org/
## https://en.wikipedia.org/wiki/Robots_exclusion_standard
## https://support.google.com/webmasters/answer/6062596
User-agent: *
${isꓽpublic(spec) ? "Allow" : "Disallow"}: /
`.trimStart()
}

/////////////////////////////////////////////////

export default generate
export { generate }
