# Review: `@monorepo-private/set-deep-property`

Purpose: an opinionated, immutable deep-property setter/deleter for plain objects
(`setꓽpropertyⵧdeep(target, path, value)`), supporting a dot or pipe path separator and a `DELETE` sentinel value.

## Findings

- **[Minor] G2-P9-01** — `module/index.ts:1` imports `assert_from` from `@monorepo-private/assert` but never uses it
  (only `assert` is called, at line 18). Dead import.

- **[Minor] G2-P9-02** — Silent type coercion when a path segment collides with an existing non-object (primitive)
  value: e.g. `setꓽpropertyⵧdeep({ a: 5 }, "a.b.c", 1)` will do `current["a"] = { ...current["a"] }`, and spreading a
  number/string/boolean/null produces `{}` (or throws for `null`/`undefined`, since `Object.hasOwn`/spread on `null`
  throws). So writing a deep path through what used to be a scalar field silently discards that scalar and replaces it
  with `{}`, with no assertion/error surfaced — this could mask a typo'd path colliding with an unrelated existing
  field. Worth at least asserting that `current[segment]` is `undefined` or a plain object before spreading into it, so
  a caller with a wrong path gets a clear failure instead of silent data loss.

- **[Minor] G2-P9-03** — The generic signature `setꓽpropertyⵧdeep<V, T = any>(target: T, ...)` places no constraint on
  `T`, but the implementation (`{ ...target }`) assumes `target` is a plain object. Passing an array as `target`
  silently converts it to a plain object with numeric string keys (losing `Array.isArray()`-ness and `.length`), since
  arrays are never tested and the README's stated use case is package.json-style nested objects (e.g. `exports`), this
  is probably out of scope by design — but the type signature doesn't prevent misuse, and there's no runtime guard/test
  documenting that arrays are unsupported.

- **[Nit] G2-P9-04** — When the final result is "no change" (e.g. deleting an already-absent leaf, or setting an
  already-equal value), the function still eagerly creates/copies intermediate objects along the path into the discarded
  `result` before returning the original `target` unmodified (see the "should work -- missing paths (no change)" test,
  which creates `a` and `a.b` in `result` for nothing). Harmless (the copies are garbage-collected), but it's wasted
  work; could short-circuit earlier by checking existence of the full path first when deleting.

- **[Nit] G2-P9-05** — `package.json` declares `sinon`/`@types/sinon` as devDependencies but no file in the package uses
  `sinon` (confirmed via grep) — same copy-paste-template dead dependency pattern seen in sibling packages.

- **[Nit] G2-P9-06** — The `DELETE` sentinel is a plain exported string constant (`">DELETE<"`), so a caller
  legitimately wanting to _set_ a property to that exact string value would instead trigger a delete. Documented via the
  distinctive value chosen, and inherent to any sentinel-based API, so low risk — just noting the edge case.

No `~~tosort` folder present in this package.

The core algorithm was traced by hand against all 7 existing test cases (set: no-op, mutate, alternate `|` separator,
no-change-to-sibling-props, missing-path-creation; delete: existing key, already-absent key) and is correct and
consistent with expected immutability semantics (returns the original reference when nothing changed, a new
shallow-copied-along-the-path object when something did, and never touches sibling branches). No OOP/class usage —
implemented as a single pure-ish function (it never mutates its `target` input; the local `result`/`current` copies are
freshly created). README accurately describes the exported API. Tests use the legacy mocha+chai stack, consistent with
"existing tests are fine" guidance. `vitest` and `icepick`/`@types/icepick` are present as devDependencies and `icepick`
is actually used (in tests, for `freeze()`), unlike the sinon dependency above.

No other issues found.
