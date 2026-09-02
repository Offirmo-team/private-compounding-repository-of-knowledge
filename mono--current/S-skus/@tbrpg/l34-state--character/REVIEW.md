# REVIEW — @tbrpg/state--character

Player character state: name, class, and a fixed set of RPG attributes
(level/health/mana/strength/agility/charisma/wisdom/luck), with rename/switch_class/increase_stat reducers.

## Findings

- **G11-P15-01** (Info) — `module/src/~~tosort/cheatsheet.js` exists. Per review scope, its contents were not reviewed —
  flagging presence only.
- **G11-P15-02** (Minor) — `package.json` lists `@monorepo-private/assert` as a dependency, but it is not imported or
  used anywhere in `module/src/**` — same recurring unused-dependency pattern flagged across most sibling `l3x-state--*`
  and `l2x-logic--*` packages in this batch (`l22`, `l24`, `l25`, `l26`, `l30`, `l31`, `l32`, `l33`).
- **G11-P15-03** (Minor) — `rename()` and `switch_class()` have zero test coverage — `state.tests.ts` only tests
  `create()` and `increase_stat()`. `switch_class()` in particular has a real validation branch
  (`Enum.isType(CharacterClass, klass)`) that's completely unexercised.
- **G11-P15-04** (Nit) — `state.ts:63`, `rename()`'s body is wrapped in `getꓽSXC(SXC).xTry("rename", ...)`. This one is
  correctly labeled, but cross-referencing `l33-state--inventory/module/src/state.ts:17` (whose unrelated `create()`
  function is mislabeled `"rename"`, see that package's G11-P14-02) suggests `l33`'s `create()` block was copy-pasted
  from this file's `rename()` without updating the label — noting the likely source of that cross-package copy/paste.
- **G11-P15-05** (Nit) — `increase_stat()` has an open `// TODO stats caps?` — no upper bound exists on any attribute,
  and `state.tests.ts:100` has a matching pending test `it("should cap")`, confirming a cap was intended but never
  implemented (same "intended-but-missing cap" pattern as `l32-state--wallet`'s G11-P13-02).
- **G11-P15-06** (Nit) — `types.ts`'s `State` interface has `// TODO inventory here? equipped inventory?` — an open
  modeling question about whether this package should own equipped-item references (today that's owned entirely by
  `l33-state--inventory`).
- **G11-P15-07** (Nit) — No `selectors.ts` exists in this package (unlike `l31`/`l33`'s state packages, which each have
  one) — all attribute/name/class reads are just direct property access on `State`, which is fine given the flat shape,
  but worth noting as an intentional omission rather than a missing file.

## State-transition correctness

Reducers are well-guarded: `rename()` rejects falsy names and no-ops (returns the same reference) if the name is
unchanged; `switch_class()` no-ops on an unchanged class and validates the target class via `Enum.isType()` before
accepting it; `increase_stat()` rejects `amount <= 0` (correctly blocking both zero and negative deltas, verified by a
dedicated test for both cases). All are pure, spread-based, non-mutating. The one real gap is the missing stat cap
(G11-P15-05) — an attribute can be increased without bound, and unlike `l30-state--energy`/`l33-state--inventory`'s
capacity-checked reducers, nothing here would catch an accidentally huge `amount`.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions. The
`CharacterClass`/`CharacterAttribute` enums are well-organized with source-material comments (DnD/WoW/GW2 references)
documenting the game-design rationale.

## Tests

Uses legacy mocha + chai (expected/fine for existing code) plus the standard migration-spec tests (blank + active
state). `create()` and `increase_stat()` (including its invalid-amount rejection) are covered; `rename()` and
`switch_class()` have no tests at all (G11-P15-03). One pending test (`"should cap"`, G11-P15-05).
