import { assert_from, assert } from "@monorepo-private/assert"
import { normalizeꓽIETFLanguageType, normalizeꓽtextⵧsentence } from "@monorepo-private/normalize-string"
import type { Immutable, IETFLanguageType, Charset } from "@monorepo-private/ts--types"

import type { WithLang, WithCharset, WithTitle } from "./types.ts"

/////////////////////////////////////////////////

function getꓽlang(spec: undefined | Immutable<WithLang>): IETFLanguageType {
	return normalizeꓽIETFLanguageType(spec?.lang ?? "")
}

const CHARSETⵧDEFAULT: Charset = "utf-8"
function getꓽcharset(spec: undefined | Immutable<WithCharset>): Charset {
	return CHARSETⵧDEFAULT
}

function getꓽtitle(spec: undefined | Immutable<WithTitle>): string | undefined {
	if (!spec) return undefined

	const candidate = normalizeꓽtextⵧsentence(spec.title ?? "")
	return candidate ? candidate : undefined
}

/////////////////////////////////////////////////

export { getꓽlang, getꓽcharset, getꓽtitle }
