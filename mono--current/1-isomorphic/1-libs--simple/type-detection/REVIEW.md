# Review: `@monorepo-private/type-detection`

Purpose: runtime type-detection helpers (primitive guards, container/emptiness checks, thenable detection, a "shape"
structural matcher/asserter, and a couple of DOM guards) used as type-guards/assertions across the monorepo.

## Findings

- **[Major] G2-P11-01** — `module/01-primitives/index.ts`, `isꓽstringified_integer("0")` incorrectly returns `false`.
  The leading-zero-stripping `reduce` (lines 38-41) strips _every_ leading `"0"` character including the sole digit of
  `"0"` itself, turning the internal `s` into `""`; `Number("")` is `0` (not `NaN`), so the function reaches
  `String(0) === ""` which is `false`. So the single most basic integer string, `"0"`, is rejected, while `"00"` is
  likewise rejected. Fix: special-case a fully-zero-stripped result back to `"0"` before the final comparison (or check
  `original !== "0" && original.startsWith("0")` for the leading-zero-rejection instead of stripping down to empty).
  This function has **no test file at all** exercising it (only `isꓽobjectⵧliteral`, `isꓽnegative_zero`, and
  `isꓽexact_stringified_number` are tested in `01-primitives/index.tests.ts`), which is presumably how this slipped
  through.

- **[Minor] G2-P11-02** — `README.md:5` shows `import { isꓽthenable } from "@monorepo-private/type-detection"`, but the
  actual exported symbol (from `module/03-thenable/index.ts:16`) is `isꓽThenable` (capital `T`). Copy-pasting the README
  example as written will fail with an import error / undefined binding. Either fix the README casing or rename the
  export to match — pick one source of truth.

- **[Minor] G2-P11-03** — `module/01-primitives/index.ts` exports `hasꓽemoji` and `isꓽobjectⵧkv` with no corresponding
  test cases in `01-primitives/index.tests.ts` (only 3 of the 6 exported functions from this file are tested —
  `isꓽstringified_integer` is the 4th, per G2-P11-01 above). `isꓽobjectⵧkv` in particular is a building block used by
  `isꓽobjectⵧliteral` and `10-shape/index.ts`'s `assertꓽshape`, so it's load-bearing despite lacking direct tests.

- **[Minor] G2-P11-04** — `module/dom/index.ts` (`isꓽEventTarget`) has no `.tests.ts` file at all — the only sub-folder
  in this package without any test coverage.

- **[Nit] G2-P11-05** — `module/01-primitives/index.ts:63-65` has a commented-out `isꓽprimitive_object_wrapper` stub
  function ("use case: to avoid it! (why? Which issue?)") — dead code with an open question in the comment; either
  resolve/track it or remove it.

- **[Nit] G2-P11-06** — `module/10-shape/index.ts` places its `import` statements at the _bottom_ of the file (lines
  130-133), after all the functions that use them (`assert_from`, `isꓽobjectⵧkv`, `isꓽThenable`). This works because ESM
  imports are hoisted, but it's inconsistent with every other file in this package and the rest of the monorepo, which
  place imports at the top — likely worth moving up for readability/consistency, though functionally harmless.

- **[Nit] G2-P11-07** — `10-shape/index.tests.ts:110-119` contains a test explicitly titled
  `"[BUG] should report the actual extra key in the error message when allow_extra_props=false"`. Reading the
  implementation (`10-shape/index.ts:89-91`), the error message actually does use `Array.from(extra.keys())[0]` (the
  real extra key, e.g. `"gloups"`), and the test asserts exactly that and passes — so the "[BUG]" tag in the test title
  looks like a stale marker from a since-fixed regression. Worth removing the "[BUG]" prefix now that the behavior is
  correct, so future readers don't think there's a live known bug.

No `~~tosort` folder present in this package.

The "shape" matcher (`assertꓽshape`/`hasꓽshape` in `10-shape/index.ts`) is a nicely designed configurable
structural-match assertion built on `Set` operations (`intersection`/`isDisjointFrom`/`isSupersetOf`/`difference`) and
is thoroughly tested across all its option combinations (`match_reference_props`, `allow_extra_props`, `type_match`).
`getꓽtypeofⵧimproved` (also in `10-shape/index.ts`) is a good small utility distinguishing `array`/`null`/`thenable`
from generic `object`, though it is only exercised indirectly through `assertꓽshape`'s tests, never directly. No
OOP/class usage — pure functions and type guards throughout, consistent with the project's functional-programming
guidance. Tests use the legacy mocha+chai stack, consistent with "existing tests are fine" guidance. `vitest` is a
declared devDependency but unused, same as other packages reviewed so far. The package correctly depends on the shared
`@monorepo-private/ts--types` package (for `Immutable<T>`) rather than reimplementing it, in contrast to `random`'s
embedded-deps duplication noted in that package's review.
