# Review: @monorepo-private/state-utils (offirmo-state)

Base types, type-guards, selectors, comparators and generic migration helpers for "Offirmo style" application states
(U-state / T-state / bundles / root state), used as a foundation by many consumer packages (e.g. `@oh-my-rpg/state--*`,
`@tbrpg/l3*-state--*`).

Note: this package contains a `module/~~tosort/2024/` folder (`comparators--unclear.ts`, `comparators--unclear_spec.ts`)
holding unsorted/legacy code slated for removal — not reviewed here, per instructions.

## Findings

- **G3-P13-01** [Minor] `README.md` is essentially a scratchpad of open design questions ("XXX purely experimental",
  CRDT links to review, etc.) and does not document the actual current public API (selectors, type-guards, comparators,
  migration helpers, `utils.ts` reducer helpers). Anyone onboarding to this package gets no real usage guidance.

- **G3-P13-02** [Minor] `module/src/utils.ts` (lines ~190-222) contains a large commented-out dead function
  `finalize_action_if_needed(...)`. Dead code should either be removed or actually wired in; leaving ~30 commented lines
  in source is confusing and will rot silently.

- **G3-P13-03** [Minor] The `isꓽUState` / `isꓽTState` type guards in `module/src/type-guards.ts` distinguish the two
  shapes _only_ by the presence of a `timestamp_ms` field (`isꓽUState = isꓽBaseState(s) && !isꓽWithTimestamp(s)`). Any
  legitimate UState that happens to contain an unrelated integer field named `timestamp_ms` would silently misclassify
  as a TState (and vice-versa) — there is no explicit discriminant. This propagates into `getꓽrevision`,
  `migrate_toꓽlatestⵧgeneric`, and `complete_or_cancel_eager_mutation_propagating_possible_child_mutation`, all of which
  branch on these guards.

- **G3-P13-04** [Minor] Test coverage gaps:
  - `comparators--fluid.tests.ts` only tests `hasꓽhigher_investment_than()`; `hasꓽsame_schema_version_than`,
    `hasꓽhigher_or_equal_schema_version_than`, `hasꓽhigher_schema_version_than`, and
    `getꓽdebug_infos_about_comparison_with` are entirely untested, and `hasꓽvaluable_difference_with` has an empty stub
    (`describe(..., function () {})`) with no `it(...)`.
  - `type-guards.tests.ts` does not directly test `isꓽWithSchemaVersion`, `isꓽWithRevision`, `isꓽWithTimestamp`,
    `isꓽWithLastUserInvestmentTimestamp`, `hasꓽversioned_schema`, `is_revisioned`, `is_time_stamped` (only exercised
    indirectly through composite guards).
  - `utils.tests.ts` has two pending/empty test titles ("should cancel the mutation -- if the sub-states had changes but
    no semantic") with no body — effectively a documented-but-unimplemented test case, appearing twice.

- **G3-P13-05** [Nit] `migration.ts`'s `migrate_toꓽlatestⵧgeneric` mixes raw `console.groupCollapsed(...)` /
  `console.groupEnd()` calls with the injected `SXC`/`logger` abstraction used everywhere else in the same function.
  Inconsistent logging strategy (bypasses whatever transport/level filtering the SoftExecutionContext logger provides).

- **G3-P13-06** [Nit] `migration.ts` declares an `export interface Libs {}` (empty) plus `const LIBS: Libs = {}`,
  threaded through the whole migration pipeline, annotated with `// TODO review: useful?`. Either finish this extension
  point or remove the indirection.

- **G3-P13-07** [Nit] `vitest` is listed as a devDependency but the package has zero vitest test files — all
  `*.tests.ts` still use mocha + chai. Not a bug (existing mocha/chai tests are fine per project policy), just noting
  the dependency is currently unused.

No unnecessary OOP/class usage found — the package is consistently written as plain interfaces/types + pure functions,
in line with the project's functional style guidance. No security concerns identified (no I/O, no external input parsing
beyond in-memory objects). No outdated/vulnerable dependencies stood out (icepick, jsondiffpatch, memoize-one,
typescript-string-enums are all pinned via the workspace catalog).
