# REVIEW — @tbrpg/logic--shop

Item appraisal (power score, sell value) for the shop buy/sell feature; the actual shop `create()`/state logic is
unimplemented.

## Findings

- **G11-P10-01** (Major) — `module/src/types.ts` (`interface Shop { // TODO one day }`) and `module/src/state.ts`
  (`function create(rng): void { // TODO one day }`, and `generate_random_demo_shop()` which calls `create(rng)` and
  `return`s its `void` result) are entirely unimplemented stubs. The package's core purpose per its README ("Shop
  buy/sell feature: types, logic and utilities") is not actually built yet — only the appraisal/pricing half
  (`selectors.ts`) exists. `generate_random_demo_shop()` returning `void` from a function itself typed to return `void`
  compiles but is a dead-end API that produces nothing usable; any consumer calling this today gets `undefined`.
- **G11-P10-02** (Minor) — `package.json` lists `@monorepo-private/assert` as a dependency but it's never imported/used
  in `module/src/**` — unused dependency (same pattern flagged in `l22-logic--monsters` G11-P7-02 and
  `l25-logic--adventure--resolved` G11-P9-03).
- **G11-P10-03** (Nit) — `selectors.ts`'s `appraise_power`, `appraise_power_normalized`, `appraise_armor_power`, and
  `appraise_weapon_power` all take a `potential: boolean` parameter, but none of them actually use it
  (`appraise_armor_power`/`appraise_weapon_power` ignore the parameter entirely; the callers just forward it downward).
  This looks like a placeholder for a "potential value if fully enhanced" feature that was never wired up — currently
  dead parameter surface across 4 functions.
- **G11-P10-04** (Nit) — `appraise_power_normalized`'s armor branch divides by `ATTACK_VS_DEFENSE_RATIO` (imported from
  `@tbrpg/logic--armors`, currently `1`, a no-op per G11-P6-04 in the armors review) — consistent with that constant
  being a not-yet-active balance knob, just noting the cross-package dependency on the same placeholder.
- **G11-P10-05** (Nit) — `appraise_sell_value`'s two branches throw `` `appraise_value(): no appraisal scheme...` `` —
  the function name in the error message (`appraise_value`) doesn't match the actual function name
  (`appraise_sell_value`), a small copy/paste leftover from an earlier rename.

## State-transition correctness

`appraise_power`/`appraise_power_normalized`/`appraise_sell_value` are pure functions with no mutation, deriving from
the item's existing damage/reduction selectors in the weapons/armors packages. No resource/state-transition surface
exists yet since `Shop`/`create()` are unimplemented (G11-P10-01) — nothing to check for negative-resource or overflow
bugs in this package as it stands today.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions.

## Tests

Uses legacy mocha + chai (expected/fine for existing code). `selectors.tests.ts` only covers `appraise_sell_value` for
one armor and one weapon example, asserting exact hardcoded prices — no coverage for
`appraise_power`/`appraise_power_normalized`, and no tests at all for `state.ts`/`types.ts` (unsurprising, since they're
stubs).
