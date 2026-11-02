/////////////////////////////////////////////////

// compares UTF-16 code units = fast + deterministic (same result on every machine)
// NOT locale-aware ex. "B" < "a", "10" < "9", "é" > "z"
// = good enough for technical identifiers: paths, package names…
// (use Intl.Collator if a "human" order is needed)
export function compareꓽstringsⵧfast_good_enough(a: string, b: string): number {
	if (a === b) return 0

	return a < b ? -1 : 1
}
