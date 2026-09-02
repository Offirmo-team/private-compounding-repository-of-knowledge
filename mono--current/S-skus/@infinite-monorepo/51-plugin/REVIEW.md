# Review: @infinite-monorepo/plugin

Defines the `Plugin` interface (the contract every infinite-monorepo plugin — pnpm, git, readme, etc. — implements): a
set of optional lifecycle hooks (`onꓽload`, `onꓽnodeⵧdiscoveredⵧfirst_time`, `onꓽnodeⵧdiscoveredⵧbfs`, `onꓽnodeⵧrefine`,
`onꓽapply`) that receive and return the shared immutable `State`.

## Findings

### G9-P51-01 (Minor) — Dead dependency: `@monorepo-private/assert` declared but unused

`package.json` lists `@monorepo-private/assert` as a runtime dependency, but `module/src/index.ts` (the package's only
source file — a pure type-only interface declaration) never imports it. This is a types-only package; it has no runtime
code path that would need an assertion library.

### G9-P51-02 (Nit) — Extensive, high-quality comments documenting plugin lifecycle ordering

Unlike most packages reviewed in this batch, `index.ts` has thorough inline comments explaining the intended call order
and semantics of each hook (e.g. explaining the two-pass discovery model for hybrid package managers). This is a
positive note, not a defect — flagged only because the reviewer instructions ask to verify comments match code: they do,
and they add real value here (non-trivial temporal/ordering contract that isn't obvious from the type signatures alone).

### G9-P51-03 (Nit) — No tests

There is nothing to unit-test here (a single exported interface with no runtime logic), so absence of tests is expected
and not a real gap.

No OOP/class usage — `Plugin` is a plain interface of optional pure-function fields, consistent with the monorepo's
functional style. No other issues found.
