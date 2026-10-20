/////////////////////////////////////////////////

export function combineꓽnormalizers(...normalizers: StringNormalizer[]): StringNormalizer {
	return (s) =>
		normalizers.reduce((acc: string, normalizer: StringNormalizer): string => {
			const out = normalizer(acc)
			//console.log(`combined normalization: "${acc}" -> "${out}"`)
			return out
		}, s)
}

export function normalize(s: string, ...normalizers: StringNormalizer[]): string {
	return combineꓽnormalizers(...normalizers)(s)
}

export function default_to(def = ""): StringNormalizer {
	return (s: string): string => s || def // || important to coerce empty string
}

export function normalizeꓽarray(a: ReadonlyArray<string>, ...normalizers: StringNormalizer[]): string[] {
	const normalize = combineꓽnormalizers(...normalizers)
	return a.map(normalize)
}

/////////////////////////////////////////////////

import type { StringNormalizer } from "../l1-types/types.ts"
