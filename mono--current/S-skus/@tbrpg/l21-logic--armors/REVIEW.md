# REVIEW — @tbrpg/logic--armors

Armor item types, procedural generation (random base/qualifiers/quality), damage-reduction-interval computation,
enhancement, comparison, and i18n for the tbrpg game — structurally parallel to `@tbrpg/logic--weapons`.

## Findings

- **G11-P6-01** (Major) — `module/src/data/i18n_en.ts` `armor.qualifier1`/`armor.qualifier2` objects contain many
  orphaned translation keys with no corresponding entry in `data/entries.ts`'s `ENTRIES` array: qualifier1 has 19
  orphaned keys (`admirable`, `arcanic`, `bestial`, `complex`, `cruel`, `cunning`, `forbidden`, `forgotten`, `ghost`,
  `heroic`, `inflexible`, `living`, `lost`, `overrated`, `raging`, `savage`, `sinister`, `whirling`, `adjudicator`) and
  qualifier2 has 8 (`ambassador`, `assaulting`, `executioner`, `hunter`, `pirate`, `ranger`, `traveler`, `woodsman`).
  Every one of these orphaned keys is also a real qualifier1/qualifier2 hid in the sibling `@tbrpg/logic--weapons`
  package, strongly suggesting `i18n_en.ts` was copy-pasted from weapons and never fully pruned down to armor's actual
  entry list. `adjudicator` is additionally placed out of the otherwise-alphabetical order at the very end of the
  `qualifier1` object (line 85), consistent with being a later, incomplete edit. Dead i18n entries aren't harmful at
  runtime, but they're a maintenance hazard (easy to think a hid is supported when it isn't) and indicate the data file
  may be out of sync with the actual generation table.
- **G11-P6-02** (Minor) — `module/src/data/i18n_en.ts:11` has a translation for base hid `cape`, but `cape` does not
  exist in `data/entries.ts`'s `ENTRIES` array for `type: "base"` (confirmed: entries.ts has 20 base hids, i18n has 21,
  the only extra being `cape`). Either `cape` was meant to be a valid armor base and the entries.ts row was dropped, or
  the i18n key is leftover cruft — worth resolving since `Armor` (`InventorySlot.armor`) has no `armor.base.cape`
  variant in the actual generator despite the translation existing.
- **G11-P6-03** (Minor) — `module/src/selectors.ts` `matches(armor, elements)` throws when
  `armor.slot !== InventorySlot.armor` (`"can't match a non-armor slot"`), while the structurally identical function in
  `@tbrpg/logic--weapons`'s `selectors.ts` simply `return false` for the equivalent case
  (`weapon.slot !== InventorySlot.weapon`). Two sibling packages implementing the same logical operation behave
  differently for the same scenario (throw vs. silently-false) — this inconsistency should be reconciled one way or the
  other, since callers that expect one behavior in weapons might be surprised when the equivalent armor code throws
  instead.
- **G11-P6-04** (Nit) — `module/src/selectors.ts` exports `ATTACK_VS_DEFENSE_RATIO = 1`, used to multiply every bound in
  `OVERALL_STRENGTH_INTERVAL_BY_QUALITY`. Since the value is currently `1`, this is a no-op multiplier not present in
  weapons' equivalent file — looks like a placeholder for future attack/defense balance tuning. Harmless, but worth a
  comment noting intent, or removing until it's actually used.
- **G11-P6-05** (Nit) — `module/src/selectors.ts` contains commented-out debug statements
  (`//console.log('matches', ...)`, `//console.log('mismatched', ...)`) inside `matches()`, not present in weapons'
  version — dead code that should be removed.
- **G11-P6-06** (Nit) — Naming convention inconsistency with sibling package: `state.ts`'s private helpers are
  underscore-prefixed here (`_pick_random_quality`, `_pick_random_base`, `_pick_random_qualifier1`,
  `_pick_random_qualifier2`, `_pick_random_base_strength`), whereas weapons' equivalents have no underscore prefix. Not
  a bug, but the two sibling packages should probably agree on one convention.
- **G11-P6-07** (Nit) — API usage inconsistency with sibling package: `_pick_random_base_strength` calls
  `getꓽrandom.generator_of.integer.in_interval(BASE_STRENGTH_INTERVAL_BY_QUALITY[quality]!)(rng)`, while weapons'
  equivalent calls `getꓽrandom.generator_of.integer.between(...BASE_STRENGTH_INTERVAL_BY_QUALITY[quality]!)(rng)`. Both
  presumably produce the same result via the same underlying `@monorepo-private/random` API, but the two call styles
  differ across sibling packages for identical semantics — worth standardizing on one.
- **G11-P6-08** (Nit) — `state.ts`'s `enhance()` throws `"can't enhance a armor above the maximal enhancement level!"` —
  grammar: should be "an armor".
- **G11-P6-09** (Nit) — `consts.ts` has a commented-out `//const SCHEMA_VERSION: number = 2`, same dead-code pattern
  already flagged in weapons (see l20-logic--weapons review, G11-P5-06).
- **G11-P6-10** (Nit) — `types.ts` has the same recurring `// TODO full fledged state with revision and schema version`
  gap already flagged across `@tbrpg/definitions` and `@tbrpg/logic--weapons`.
- **G11-P6-11** (Nit) — `compare.tests.ts:28,31` has the same two pending/unimplemented test cases
  (`it("should take into account the quality")`, `it("should fallback to uuid")`) as weapons' equivalent file,
  describing tie-break logic that already exists in `compare.ts`.

## State-transition correctness

Same well-guarded pattern as weapons: `create()` validates `base_strength` against the quality's interval and throws on
violation, `enhance()` guards `MAX_ENHANCEMENT_LEVEL` and returns a new object without mutation. `state.tests.ts` even
improves on weapons' test in this respect — it uses immutable spread (`armor = { ...armor, enhancement_level: 0 }`) to
set up the max-enhancement test case, rather than weapons' test which directly mutates the local variable
(`weapon.enhancement_level = 0`); worth backporting this pattern to weapons' tests for consistency (see
l20-logic--weapons review). No negative-resource or overflow issues found; startup assertions in `selectors.ts` mirror
weapons' safety checks.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions.

## Tests

Uses legacy mocha + chai (expected/fine for existing code). Coverage is solid and mirrors weapons': state creation
(random + hinted), enhancement (success + max-level failure), selectors (damage-reduction interval, medium/ultimate
damage reduction, matches with positive/negative/throwing cases — including a test explicitly asserting the
throw-on-non-armor-slot behavior, confirming G11-P6-03 is intentional current behavior, not a typo), and compare
(potential-based sort). The two pending tests noted in G11-P6-11 are the only coverage gap.
