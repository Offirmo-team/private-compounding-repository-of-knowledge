# Review: uuid

Small package generating string-based "UUID-like" identifiers (nanoid-backed, optionally seedable via a custom RNG) plus
a `WithUUID` type and a `xxx_test_unrandomize_element()` test helper used across several other packages (`@tbrpg/*`,
`state--prng`) to make snapshot/deep-equal tests deterministic.

Note: this package contains a `module/~~tosort` folder (`module/~~tosort/cheatsheet.js`) holding unsorted/legacy code
slated for removal — not reviewed here.

## Findings

- **[Minor] G2-P23-01** — README code sample imports `UUID` as a value:
  `import { UUID, generate_uuid } from "@monorepo-private/uuid"` (README.md:22), but `UUID` (`module/src/types.ts:3`) is
  a type-only alias (`type UUID = string`). This would fail to compile as a value import (or silently do nothing useful)
  under normal `isolatedModules`/`verbatimModuleSyntax` settings — should be `import type { UUID }`.

- **[Minor] G2-P23-02** — `xxx_test_unrandomize_element()` (`module/src/utils.ts:5`) hardcodes the replacement value
  `"uu1~test~test~test~test~"` (24 chars) while `generate_uuid()`'s default output is `UUID_LENGTH` =
  `"uu1".length + 21` = 24 chars too — so it happens to match today, but nothing enforces this: if
  `NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES` in `generate.ts` changes, the hardcoded stand-in silently stops matching
  the real format and any consumer test asserting on length/shape could break confusingly. Consider deriving the
  placeholder from `UUID_LENGTH`/`UUID_RADIX` instead of a magic string.

- **[Minor] G2-P23-03** — The `xxx_` prefix convention (used to mark "test-only, shouldn't be in production code" per
  the naming pattern seen elsewhere in the monorepo) is applied to a function that is exported from the package's main
  index and consumed as a normal production dependency by `@tbrpg/l10-definitions` (which re-exports it for convenience)
  and directly by `state--prng`. Since it's designed to be used in test files only (by convention, not by tooling),
  there's no compile-time or lint-time enforcement stopping accidental use in production code paths. Worth either moving
  it to a dedicated `/testing` subpath export or adding a lint rule, if not already covered elsewhere in the monorepo.

- **[Nit] G2-P23-04** — `generate.ts`'s commented-out dead code (lines 28-29, the `//const result...`/`//for` loop)
  predates the `Uint8Array(size).map(...)` one-liner it was replaced by; harmless but could be removed since the working
  version is already in place.

- **[Nit] G2-P23-05** — `notes.md` and `README.md` contain long-standing TODOs ("remove the monstrous dependency on
  crypto! or NOT USE nanoid!!", "1D https://github.com/ulid/spec", "crypto.randomUUID()") signaling the author considers
  the current nanoid-based approach a stopgap. Not a bug, just flagging as a known, self-acknowledged design debt item
  (the README even argues against using UUIDs at all, favoring ULID-style sortable IDs) — worth prioritizing if `uuid`
  sees much wider adoption.

No critical or major issues found. Test coverage for `generate_uuid()` and `xxx_test_unrandomize_element()` is present
and adequate (mocha/chai, pre-existing legacy style — fine per migration policy). No unnecessary OOP/classes.
