import type { StringNormalizer } from "../l1-types/types.ts"

/////////////////////////////////////////////////

function combineꓽnormalizers(...normalizers: StringNormalizer[]): StringNormalizer {
	return (s) =>
		normalizers.reduce((acc: string, normalizer: StringNormalizer): string => {
			const out = normalizer(acc)
			//console.log(`combined normalization: "${acc}" -> "${out}"`)
			return out
		}, s)
}

function normalize(s: string, ...normalizers: StringNormalizer[]): string {
	return combineꓽnormalizers(...normalizers)(s)
}

function default_to(def = ""): StringNormalizer {
	return (s: string): string => s || def // || important to coerce empty string
}

function normalizeꓽarray(a: ReadonlyArray<string>, ...normalizers: StringNormalizer[]): string[] {
	const normalize = combineꓽnormalizers(...normalizers)
	return a.map(normalize)
}

/////////////////////////////////////////////////

export { combineꓽnormalizers, normalize, default_to, normalizeꓽarray }
