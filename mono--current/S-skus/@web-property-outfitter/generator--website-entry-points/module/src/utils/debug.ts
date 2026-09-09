/////////////////////////////////////////////////

export function ifꓽdebug(spec: Immutable<WebPropertySpec>) {
	return {
		prefixꓽwith(prefix: string, str: string): string {
			return `${isꓽdebug(spec) ? prefix : ""}${str}`
		},
	}
}

/////////////////////////////////////////////////

import { isꓽdebug } from "@web-property-outfitter/spec"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { WebPropertySpec } from "../types.ts"
