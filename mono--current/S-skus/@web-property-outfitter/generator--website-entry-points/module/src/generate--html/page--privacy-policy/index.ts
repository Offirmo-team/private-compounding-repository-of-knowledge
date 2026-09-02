// Reminder: code will be prettified, no need to indent or format it.
// put the comments in the code, it's up to the consumer to optimize or not

import { getꓽhtml‿str } from "@web-property-outfitter/generator--html"

import { assert_from, assert } from "@monorepo-private/assert"
import { normalize_unicode } from "@monorepo-private/normalize-string"
import type { Immutable } from "@monorepo-private/ts--types"
import type { Html‿str } from "@monorepo-private/ts--types--hypermedia"

import type { WebPropertySpec } from "../../types.ts"

import { getꓽhtml_doc_spec } from "./selectors.ts"
/////////////////////////////////////////////////

function generate(spec: Immutable<WebPropertySpec>): Html‿str {
	const doc_spec = getꓽhtml_doc_spec(spec)
	const result = getꓽhtml‿str(doc_spec)

	// TODO check IW10 <14k https://developers.google.com/speed/docs/insights/mobile#delivering-the-sub-one-second-rendering-experience
	return normalize_unicode(result)
}

/////////////////////////////////////////////////

export default generate
export { generate }
