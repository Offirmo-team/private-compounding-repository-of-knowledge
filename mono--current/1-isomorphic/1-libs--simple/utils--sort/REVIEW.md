# Review: @monorepo-private/utils--sort

Tiny isomorphic helper exposing a `Score` type (array-of-numbers comparison, lexicographic, lower-is-better) and a
`compareꓽscores` comparator function, presumably for use as an `Array.prototype.sort` comparator.

## Findings

### G2-P16-01 (Major) — No tests at all, and the comparator has real edge-case bugs that tests would have caught

There is not a single test file in this package (no `*.tests.ts`), despite `chai`/`mocha`/`sinon`/`vitest` all being
listed in `devDependencies`. Given the migration to vitest, a fresh test file should use vitest. Concretely, testing
would have surfaced:

- **Different-length scores are not handled**: the reduce loop iterates up to
  `Math.max(score_a.length, score_b.length)`, but when index `i` is out of bounds for one array, `score_a[index]` /
  `score_b[index]` is `undefined`, and the `ǃ.assert(typeof score_unit_a === "number", …)` guard will throw at that
  index instead of treating "no element" as a meaningful tiebreak (e.g. shorter array = better/worse). Comparing `[1]`
  vs `[1, 2]` throws instead of returning a deterministic order. Since `Score` is typed as `Array<number>` with no
  documented invariant that both arrays must share the same length, this is a live footgun for any caller whose scores
  don't all have identical dimensionality.
- Zero-length arrays are explicitly disallowed by an `ǃ.assert`, but this is unverified by any test.

### G2-P16-02 (Minor) — Import placed after usage, at the bottom of the file

`import { assert_from } from "@monorepo-private/assert"` sits at line 48, after the function that uses it (line 8). This
works at runtime/type-check time because ES module imports are hoisted, but it's an unusual style that hurts readability
(reader must scroll to the bottom to discover where `assert_from` comes from). Minor stylistic nit only, consistent
inconsistency across the package (only one file to be consistent with).

### G2-P16-03 (Minor) — No README, no usage docs

Not required for a package this size, but there's no docstring/comment near `compareꓽscores` explaining what "lower is
better" or the `null = not eligible` semantics mean for a caller sorting an array — a one-line usage example would help,
especially given the very-unusual failure mode above.

### G2-P16-04 (Nit) — Debug `console.error`/`console.log` left in production path

Lines 35-37 log `score_a`/`score_b` to the console on any error inside the reduce callback. This is presumably meant as
a debugging aid for the (currently untested) crash case above, but it's unconditional (no `DEBUG` flag guard as seen in
sibling packages like `utils--error`), so it will spam stdout/stderr in production if the edge case above is ever hit.

## Summary

Small package, single exported function, no OOP misuse. The main substantive issue is the untested and likely-buggy
handling of differently-sized `Score` arrays (G2-P16-01), plus a complete lack of test coverage.
