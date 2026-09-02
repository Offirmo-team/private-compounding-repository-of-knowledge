# REVIEW — @tbrpg/logic--monsters

Monster type/state generation for the tbrpg game — random rank/level/name/emoji picking sourced from Unicode "monster"
taxonomy data plus a small hardcoded extra list (drop bear, dahu, etc.).

## Findings

- **G11-P7-01** (Minor) — `module/src/state.ts:34` — the thrown error message is
  `"OMR Monster create: can't find a monster corresponding to hint..."`. `OMR` doesn't match this package's own naming
  (no `LIB` const like weapons/armors use, e.g. `@tbrpg/logic--weapons: ...`), and grepping the monorepo shows
  `OMR`/`OMRSoftExecutionContext` only appears elsewhere in `l10-definitions/module/~~tosort/2024/...` legacy code —
  this looks like a leftover reference to an older project name/acronym that got copy-pasted into otherwise-unrelated
  new code. Should be replaced with something reflecting the current package (e.g. `@tbrpg/logic--monsters: ...`).
- **G11-P7-02** (Minor) — `package.json` lists `@monorepo-private/assert` as a dependency, but it is not imported or
  used anywhere in `module/src/**` (confirmed via grep — only match is the unrelated identifier `_assert_shape` in the
  test file, not the `assert` package). This looks like an unused/stale dependency.
- **G11-P7-03** (Nit) — `module/src/examples.ts`'s `generate_random_demo_monster()` takes no `rng` parameter and always
  creates its own `getꓽengine.good_enough()` internally, whereas the equivalent sibling functions in
  `@tbrpg/logic--weapons`/`@tbrpg/logic--armors`
  (`generate_random_demo_weapon(rng?)`/`generate_random_demo_armor(rng?)`) accept an optional `rng` for
  testability/determinism. Minor API inconsistency across sibling packages.
- **G11-P7-04** (Nit) — `module/src/data/index.ts:12` has a redundant non-null assertion:
  `.filter((charDetails) => charDetails!.taxonomy.includes("monster"))` — `charDetails` is already guaranteed non-null
  by the preceding `.map((key) => UNICODE_CHARS[key]!)`, so the `!` inside the filter callback is dead/unnecessary.
- **G11-P7-05** (Nit) — `Monster.possible_emoji` is a singular string field (always exactly one emoji, per
  `_assert_shape`'s `lengthOf(2)` check in the test), so the name "possible_emoji" reads as if it could hold several
  candidates or an optional value. A name like `emoji` would better match its actual (always-present, single) usage.
- **G11-P7-06** (Nit) — `data/index.tests.ts` asserts `ENTRIES` has an exact `lengthOf(76)`, which is a hard-coded count
  sourced indirectly from `@monorepo-private/unicode-data`'s taxonomy plus 7 hardcoded extras. Any future update to the
  shared `unicode-data` package's "monster" taxonomy will break this test even though nothing in this package changed —
  a coupling worth being aware of, though not a bug today.

## State-transition correctness

`create()` is a pure function producing a new `Monster` object each call; no mutation of inputs. Level "wiggle" logic
(`Math.max(1, Math.min(MAX_LEVEL, ...))`) correctly clamps to `[MIN_LEVEL via 1, MAX_LEVEL]` bounds, avoiding
overflow/negative-level edge cases. `pick_random_rank`'s probability table (1/10 boss, 2/10 elite, 7/10 common) is
internally consistent (sums to 10). No mutable/state-reducer surface beyond `create()` — this package has no
`enhance()`-style transition, so there's less transition-correctness surface than weapons/armors.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions.

## Tests

Uses legacy mocha + chai (expected/fine for existing code). Coverage is reasonable given the small logic surface: random
creation (asserting exact RNG draw counts), partially-hinted creation (name + level wiggle), and a sanity check on the
size of the generated entries table. No pending/skipped tests found.
