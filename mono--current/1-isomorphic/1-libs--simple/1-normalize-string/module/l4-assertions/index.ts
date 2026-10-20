/////////////////////////////////////////////////

export function assertꓽstringⵧnormalized(s: string): void {
	assert(s === normalize_unicode(s), `String is not unicode normalized: "${s}"!`)
}

export function assertꓽstringⵧnormalized_and_trimmed(s: string): void {
	assertꓽstringⵧnormalized(s)

	assert(s === trim(s), `String is not trimmed: "${s}"!`)
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"

import { normalize_unicode, trim } from "../l3-normalizers/1-base/index.ts"
