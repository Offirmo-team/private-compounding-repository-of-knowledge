# REVIEW — @tbrpg/logic--weapons

Weapon item types, procedural generation (random base/qualifiers/quality), damage-interval computation, enhancement,
comparison, and i18n for the tbrpg game.

## Findings

- **G11-P5-01** (Major) — `module/src/data/i18n_en.ts:16-18` has a copy-paste/off-by-one translation bug in the
  `weapon.base` messages:
  ```
  mace: "scythe",
  scythe: "spear",
  spear: "spear",
  ```
  `mace` incorrectly translates to "scythe" and `scythe` incorrectly translates to "spear". Every other base entry
  (axe→"axe", bow→"bow", etc.) is an identity mapping, confirming this is a shifted-by-one bug rather than an
  intentional aliasing. This is user-facing text and will display the wrong weapon name in-game for maces and scythes.
- **G11-P5-02** (Minor) — `module/src/data/entries.ts:1` — the interface is named `RawArmorEntry` but is used to
  describe weapon part entries (`base`/`qualifier1`/`qualifier2` for weapons). This looks like a copy/paste artifact
  from the sibling `l21-logic--armors` package and should be renamed to `RawWeaponEntry` for clarity — currently
  misleading to anyone reading this file in isolation.
- **G11-P5-03** (Minor) — `module/src/state.ts:57-61` uses `hints.base_hid || pick_random_base(rng)` and similar `||`
  fallbacks for `base_strength`/`enhancement_level`. Since these are numeric/string hint fields where a legitimate value
  could coincidentally be falsy in future changes (e.g. `base_strength: 0` if that were ever valid, or an empty string),
  prefer nullish coalescing (`??`) over `||` to avoid silently overriding an explicitly-provided falsy value with a
  random pick. Not currently exploitable since `MIN_ENHANCEMENT_LEVEL` is `0` (so the enhancement_level case degenerates
  to the same result), but it's a latent footgun if the valid range ever includes 0/empty-string as meaningful hint
  values.
- **G11-P5-04** (Minor) — `module/src/selectors.ts:98` `matches()` throws `if (!weapon)`, but
  `weapon: Immutable<Weapon>` is typed as always defined — this check is unreachable under the type contract and mixes
  runtime-defensive code with strict typing elsewhere in the package. Either the parameter should legitimately allow
  `undefined` (and the type updated) or this check should be dropped in favor of trusting the type system, consistent
  with the rest of the codebase's style.
- **G11-P5-05** (Nit) — `types.ts:11-12` has two `// TODO` comments (`check extends (own state?)`,
  `full fledged state with revision and schema version`) describing real modeling gaps (schema versioning) rather than
  trivial deferred work — same schema-version gap noted in `@tbrpg/definitions`' `Element` type (see `l10-definitions`
  review). Worth tracking as a real issue rather than an inline TODO given it recurs across packages.
- **G11-P5-06** (Nit) — `consts.ts:5` has a commented-out `//const SCHEMA_VERSION: number = 2` — dead/commented code
  that should either be reinstated (if schema versioning work is starting) or removed.
- **G11-P5-07** (Nit) — `compare.tests.ts:28-33` has two pending/unimplemented test cases
  (`it("should take into account the quality")`, `it("should fallback to uuid")` — no callback, so they're auto-pending
  in mocha). These describe real tie-breaking logic that exists in `compare.ts:19`
  (`compareꓽitemsⵧby_quality(a, b) || a.uuid.localeCompare(b.uuid)`) but is currently untested. Consider implementing
  these pending tests given the logic already exists and is non-trivial to get right (tie-break ordering).

## State-transition correctness

`create()` validates `base_strength` is within the quality's base-strength interval and throws if not (state.ts:64-67) —
good defensive check on the boundary. `enhance()` correctly guards against exceeding `MAX_ENHANCEMENT_LEVEL`
(state.ts:73-74) and returns a new object rather than mutating (state.ts:76-79), consistent with immutability
conventions. No negative-resource or overflow issues found in the enhancement/damage math itself; `selectors.ts`'s
interval math is well-guarded with startup assertions (`consts.ts`/`selectors.ts` throw if `Object.keys(...).length`
mismatches `Enum.keys(ItemQuality).length`, and if `base_min >= base_max`).

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions.

## Tests

Uses legacy mocha + chai (expected/fine for existing code). Coverage is solid: state creation (both random and hinted),
enhancement (success + max-level failure), selectors (damage interval, medium/ultimate damage, matches with
positive/negative/throwing cases), and compare (potential-based sort). The two pending tests noted above (G11-P5-07) are
the only coverage gap of note.
