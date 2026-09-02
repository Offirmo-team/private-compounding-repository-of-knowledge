# REVIEW — @tbrpg/logic--adventure--resolved

Resolves an `AdventureArchetype` into a concrete `ResolvedAdventure` outcome (attribute/coin/item/enhancement gains,
monster encounter) given the current character/inventory/wallet state.

## Findings

- **G11-P9-01** (Critical) — `module/src/reducers/index.ts:144-149`:
  ```ts
  if (should_gain.improvementⵧarmor_or_weapon) {
    if (is_weapon_at_max_enhancement(InventoryState.get_slotted_weapon(inventory)!))
      should_gain.improvementⵧarmor = true
    else if (getꓽrandom.generator_of.bool()(rng)) should_gain.improvementⵧarmor = true
    else should_gain.improvementⵧweapon = true
  }
  ```
  `InventoryState.get_slotted_weapon(inventory)` is typed `Immutable<Weapon> | null` and legitimately returns `null`
  whenever no weapon is currently slotted (`l33-state--inventory/module/src/selectors.ts:47-48`:
  `return state.slotted[InventorySlot.weapon] || null`). The non-null assertion (`!`) here silences that, so as soon as
  an archetype with `outcome.improvementⵧarmor_or_weapon` resolves for a character with no weapon equipped,
  `is_at_max_enhancement(null)` is called, which does `weapon.enhancement_level >= MAX_ENHANCEMENT_LEVEL` and throws a
  `TypeError: Cannot read properties of null`. This is a realistic scenario (e.g. a fresh character before any weapon is
  looted/equipped) and directly crashes adventure resolution — should explicitly check for `null` and route to
  `improvementⵧweapon = true` (or armor) instead of asserting non-null.
- **G11-P9-02** (Major) — No test files exist anywhere in this package (`module/src/**` has zero `.tests.ts`/`.test.ts`
  files), despite `create()` in `reducers/index.ts` being the most complex piece of branching game-state logic reviewed
  so far in this batch (random-attribute selection, lowest-attribute selection, class-based attribute tables,
  armor-or-weapon branching, the bug in G11-P9-01, coin generation, monster encounter creation). This is a significant
  coverage gap relative to sibling packages (weapons/armors/monsters/adventures all have `.tests.ts` files covering
  their core logic).
- **G11-P9-03** (Minor) — `package.json` lists `@monorepo-private/assert` as a dependency, but it is never imported/used
  anywhere in `module/src/**` — unused dependency (same pattern flagged in `l22-logic--monsters`, G11-P7-02).
- **G11-P9-04** (Nit) — `reducers/index.ts` repeatedly casts through `as any` to dynamically set a property on
  `should_gain` by a computed key (`;(should_gain as any)[stat] = true`, `;(should_gain as any)[lowest_stat] = true`,
  appearing 3 times). This bypasses type safety at exactly the points where correctness matters most (which attribute
  gets incremented). A typed index signature or a small typed helper (`set_gain(should_gain, stat, true)`) would avoid
  the blanket `any` cast.
- **G11-P9-05** (Nit) — Two `// TODO` comments mark real, non-trivial gaps:
  `"TODO take into account the existing inventory?"` (line 140, armor-or-weapon choice is pure 50/50 regardless of
  what's already equipped) and `"TODO check multiple charac gain (should not happen)"` (line 155, no runtime assertion
  actually guards against an archetype outcome setting more than one attribute gain simultaneously — the comment notes
  the invariant but doesn't enforce it).

## State-transition correctness

Aside from the null-deref bug in G11-P9-01, `create()` is a pure function: it builds `should_gain` from a shallow copy
of `outcome` (`{ ...outcome }`) rather than mutating the archetype's outcome object, and returns a brand-new
`ResolvedAdventure` object without mutating `character`/`inventory`/`wallet` inputs. `generate_random_coin_gain_or_loss`
(from the sibling `l24-logic--adventures` package) is called with `current_wallet_amount: wallet.coin_count`, correctly
threading through the wallet-capping guard reviewed in that package. The
`PRIMARY_STATS_BY_CLASS`/`SECONDARY_STATS_BY_CLASS` completeness checks
(`if (Object.keys(...).length !== Enum.keys(CharacterClass).length) throw ...`) are a good defensive pattern, ensuring
the table can't silently drift out of sync with the `CharacterClass` enum.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout. The `as any` casts (G11-P9-04) are the main
type-safety blemish.

## Tests

None exist for this package (see G11-P9-02) — this is the most significant gap found so far in this batch, especially
given the presence of a confirmed crash bug (G11-P9-01) that tests would likely have caught.
