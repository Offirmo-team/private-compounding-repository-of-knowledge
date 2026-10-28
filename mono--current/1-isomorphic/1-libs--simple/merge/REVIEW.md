- **G2-P3-01** (Major) — `mergeⵧarrays` calls `result.sort()` with no comparator, i.e. JavaScript's default
  lexicographic/string-based sort. For arrays of numbers this produces incorrect ordering, e.g.
  `mergeⵧdeep([1, 2, 3], [10, 20])` sorts to `[1, 10, 2, 20, 3]` instead of numeric order `[1, 2, 3, 10, 20]` (verified:
  `[1,10,2,20,3].sort()` → `[1, 10, 2, 20, 3]`). The comment justifying this
  (`// since we're treating arrays as a set, why not sorting?`) doesn't account for element type — a set semantic
  doesn't imply a _correct_ sort is optional, and the current behavior actively reorders numeric data incorrectly. No
  test currently exercises multi-digit numbers or mixed-magnitude values, so this ships silently. Either use a
  type-aware comparator (e.g. numeric compare for numbers, `localeCompare`/code-unit compare for strings, or default to
  insertion order — i.e. drop the `.sort()` call entirely and simply preserve first-seen order) or explicitly
  document/restrict this function to string arrays. `module/src/index.ts:49`

- **G2-P3-02** (Minor) — `mergeⵧarrays`'s `.sort()` is also applied unconditionally to arrays of objects/functions/mixed
  types, where the default sort falls back to `String(x)` comparison (e.g. all plain objects stringify to
  `"[object Object]"`, giving an effectively meaningless/arbitrary — though stable — order). Combined with G2-P3-01,
  this suggests the sort step needs to be type-aware or removed rather than blanket-applied. `module/src/index.ts:49`

- **G2-P3-06** (Nit) — `// TODO review if we should prevent mismatched primitive types` is a legitimate open design
  question (e.g. `mergeⵧdeep<any>(42, "foo")` silently returns `"foo"` with no type check) but has no linked
  issue/tracking — low risk since the function is intentionally loosely-typed via generics/`any` at call sites, but
  worth flagging since silent type-mismatches in a "deep merge" utility used for e.g. config merging could hide bugs
  upstream. `module/src/index.ts:22`
