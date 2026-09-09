/////////////////////////////////////////////////

export function generate(spec: Immutable<WebPropertySpec>): string {
	return `
# https://securitytxt.org/

Please report any security issue or danger to the community to:
- ${getꓽcontactⵧsecurity(spec)}

Thanks for your contribution!
`.trimStart()
}
export default generate

/////////////////////////////////////////////////

import { getꓽcontactⵧsecurity } from "@web-property-outfitter/spec"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { WebPropertySpec } from "../../types.ts"
