import type { StringNormalizer } from "../../l1-types/types.ts"
import { normalizeꓽarray } from "../../l2-core/normalize.ts"
import { ensure_string, trim, normalize_unicode } from "../1-base/index.ts"

/////////////////////////////////////////////////

// light, obvious normalization + options
// includes: unicode, trim
function normalizeꓽarrayⵧof_strings(
	a: ReadonlyArray<string | undefined | null> | undefined | null = [],
	{ filter_out_empty = true, deduplicate = false, sort = false, extra_normalizers = [] as StringNormalizer[] } = {},
): string[] {
	let result = normalizeꓽarray((a || []).map(ensure_string), normalize_unicode, trim, ...extra_normalizers)

	if (filter_out_empty) {
		result = result.filter((s) => !!s)
	}

	if (deduplicate) {
		const set = new Set(result)
		result = Array.from(set)
	}

	if (sort) {
		result.sort()
	}

	return result
}

/////////////////////////////////////////////////

export { normalizeꓽarrayⵧof_strings }
