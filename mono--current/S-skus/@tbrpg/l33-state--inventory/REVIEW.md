# REVIEW — @tbrpg/state--inventory

Backpack/equipment-slot inventory state: capacity-limited unslotted item list plus armor/weapon equip slots, with
auto-sorting and swap-on-equip logic.

## Findings

- **G11-P14-01** (Minor) — `package.json` lists `@monorepo-private/assert` as a dependency, but it is not imported or
  used anywhere in `module/src/**` — same recurring unused-dependency pattern flagged across `l22-logic--monsters`,
  `l24-logic--adventures`, `l25-logic--adventure--resolved`, `l26-logic--shop`, `l30-state--energy`,
  `l31-state--achievements`, `l32-state--wallet`.
- **G11-P14-02** (Nit) — `state.ts:17`, `create()`'s body is wrapped in `getꓽSXC(SXC).xTry("rename", () => {...})` — the
  operation label passed to `xTry` is `"rename"`, not `"create"`. This looks like a copy/paste leftover (the identical
  mislabeling recurs in `l34-state--character/module/src/state.ts:63`'s actual `rename()` function, suggesting
  `create()`'s block here was copied from there without updating the label) — cosmetic (only affects logging/tracing
  context), but worth fixing since it would misattribute errors/traces during `create()` to a "rename" operation.
- **G11-P14-03** (Nit) — `selectors.ts` has a large commented-out dead function, `get_typed_item_in_slot()` (lines
  50-61), superseded by `get_slotted_armor`/`get_slotted_weapon`. Could be removed now that the typed replacements
  exist.
- **G11-P14-04** (Nit) — `state.tests.ts:211-218`'s `describe("⬇ item unequipping", ...)` block contains three pending
  (uncalled) `it(...)` tests for an "unequip" feature, annotated `// removed, useless (for now)`. No `unequip_item()`
  function exists in `state.ts` — the comment suggests this is intentionally deferred/removed rather than a coverage
  gap, but the dead pending tests could be deleted rather than left as permanently-skipped scaffolding.
- **G11-P14-05** (Nit) — `types.ts` has `// todo rename equipped / backpack ?` next to
  `unslotted_capacity`/`unslotted`/`slotted` naming — an open naming-clarity question left unresolved in the shipped
  types.

## State-transition correctness

This package is well-guarded: `add_item()` checks `is_full()` before appending and throws clearly rather than silently
dropping/overflowing capacity; `_internal_remove_item_from_unslotted()` throws if the target uuid isn't found (rather
than silently no-op'ing) — both correct fail-fast behaviors for state mutations. `equip_item()` correctly handles the
"slot was already occupied" swap case by re-inserting the displaced item back into `unslotted` and re-running
`_auto_sort()`, verified by a dedicated test. All reducers are pure (return new objects via spread, no mutation of the
input `state` or its nested arrays — `[...state.unslotted, item]` rather than `.push()`). No negative-count/overflow
surface exists here since there's no numeric "amount" field, only array length checked against a fixed capacity.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions.
`compare.ts`'s `compareꓽitemsⵧby_slot_then_strength` cleanly delegates to sibling packages'
`compare_armors_by_potential`/`compare_weapons_by_potential` with a defensive `Number.isInteger(sort)` sanity check on
each — a nice guard against silently broken comparator contracts.

## Tests

Uses legacy mocha + chai (expected/fine for existing code) plus the standard migration-spec tests (blank + active
state). Coverage is solid: `create()` defaults, add/remove/equip nominal and error paths (not-found, full-inventory,
slot-swap), auto-sort behavior, and the `iterables_unslotted()` generator are all covered. The three pending "unequip"
tests (G11-P14-04) are explicitly marked as deferred rather than a real gap. No `~~tosort` folder present in this
package.
