# REVIEW — @tbrpg/definitions

Shared low-level type/enum/constant definitions (item quality, inventory slots, element base type, SXC injections)
consumed by nearly all other `@tbrpg` packages to avoid dependency loops.

## Findings

- **G11-P4-02** (Minor) — `element.ts:9` and several other spots use default-parameter side effects
  (`{ uuid = generate_uuid() }: Readonly<Partial<WithUUID>> = {}`) which is fine functionally, but note
  `generate_uuid()` runs as the default _every time_ `createꓽelementⵧbase` is called without an explicit uuid — correct
  behavior here, just worth double-checking test coverage exists for the "uuid provided" path since only the
  auto-generated path seems implicitly exercised via `item.tests.ts`.
- **G11-P4-04** (Nit) — `consts.ts:42` sets `ITEM_SLOTS_TO_INT[InventorySlot.none] = NaN` with comment "impossible, for
  type only". This works given the `Number.isInteger` guard used at call sites in `item.ts`, but relying on `NaN` as a
  sentinel for "should never be compared" is a bit fragile/implicit — an explicit runtime assertion or a type that
  excludes `none` from the comparable slot union would make the invariant self-documenting instead of relying on NaN's
  `isInteger` failure.
- **G11-P4-05** (Nit) — `item.ts` compare functions throw plain `Error` on unhandled slot/quality rather than using the
  project's `@monorepo-private/assert` (already a dependency here, used in `consts.ts`). Prefer consistent use of
  `assert`/`assert_from` for invariant violations across the package rather than mixing `throw new Error(...)` and
  `assert(...)`.

## Style / functional-programming compliance

No unnecessary classes/OOP found — the package uses plain functions, enums via `typescript-string-enums`, and
interfaces. Consistent with project conventions.

## Tests

`consts.tests.ts` and `item.tests.ts` use legacy mocha + chai (expected/fine for existing code per migration policy —
new tests should use vitest). Coverage is reasonable for the small amount of actual logic (comparators, mapping
consistency assertions); `element.ts` and `lib-sxc.ts` have no dedicated tests but are trivial enough that this is low
priority.

No other issues found.
