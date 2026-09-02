# Review: ts--utils

Small collection of TypeScript runtime utilities: generic comparison/sort-order helpers (`comparison/`) and a
debug-friendly `toꓽstring()` stringifier (`stringify/`). Pure functions, no classes/OOP, consistent with the monorepo's
functional style.

## Findings

- **[Minor] G2-P22-01** — `README.md` is out of date: it shows
  `import { Comparator, compare as _compare } from "@monorepo-private/ts--utils"`, but no `Comparator` type is exported
  by this package — the actual exported type is `ComparisonOperator` (`module/comparison/index.ts:5`). The `Comparator`
  name appears to be stale from a prior refactor. Anyone copy-pasting the README example will get a compile error.

- **[Minor] G2-P22-02** — `getꓽcompareFnⵧcompose()` (`module/comparison/index.ts:48`) has no test coverage — only
  `compare()` and `getꓽcompareFnⵧby_string_key()` are exercised in `module/comparison/index.tests.ts`. It also carries a
  `// ???` comment suggesting even the author is unsure about its usefulness/correctness; worth validating with a test
  or removing if unused elsewhere in the monorepo (a repo-wide grep found no other usages).

- **[Nit] G2-P22-03** — `getꓽcompareFn()`'s returned comparator (`module/comparison/index.ts:34-45`) throws if
  `to_index()` returns `NaN`/non-number, but `getꓽcompareFnⵧcompose()`'s inline reduce (lines 48-59) duplicates similar
  index-extraction logic without the same guard/validation, and without reusing `getꓽcompareFn`. Minor duplication that
  could be collapsed into one helper (per the "extract if reused >2 times" guidance this is only 2 call sites, so not
  mandatory, but the inconsistency in validation is worth a note).

- **[Nit] G2-P22-04** — Uses legacy mocha+chai tests (`*.tests.ts` with `describe`/`chai`'s `expect`), consistent with
  "existing tests are fine" — noting per instructions, not flagging as a bug. Any new tests added to this package should
  use vitest.

No critical or major issues found. The code is small, correct as far as tested, and functional-style. Main actionable
item is fixing the stale README example.
