# Review: @monorepo-private/sync-store

Small library of generic reducer types/functions meant to back a store compatible with both React's
`useSyncExternalStore()` and `useReducer()` (used today by `@tbrpg/l40-interfaces`'s `createꓽstore`).

## Findings

- **G3-P14-01** [Major] **No test files exist anywhere in this package** — there is not a single `*.tests.ts` (confirmed
  via search across `module/**`). Both `types.ts` (pure type definitions, low risk) and `reducers.ts` (actual runtime
  logic: `reduceꓽnoop`, `reduceꓽset`, `reduceꓽhack`) are completely unverified by any automated test.

- **G3-P14-02** [Major] `package.json`'s `test` script is missing entirely — there's no `"test"` entry at all (compare
  to the sibling `offirmo-state` package, which defines a real mocha `"test"` script and wires
  `"check": "run-s test check:ts"`). Here `"check"` is just `"run-s check:ts"`. Since there are no test files either,
  `check` currently does nothing to verify runtime behavior, and even if tests were added, nothing would invoke them
  without first also adding a `test` script and updating `check`. When writing the first tests for this package, follow
  the project policy and use **vitest** (not mocha/chai).

- **G3-P14-03** [Major] `module/src/reducers.ts` imports ~16 symbols from `@monorepo-private/ts--types--hypermedia` and
  `@monorepo-private/assert`, but only 4 are actually used in the function bodies (`Immutable`, `ActionNoop`,
  `ActionSet_`, `ActionHack_`). The following imports are dead/unused: `assert`, `assert_from`, `ReducerMap`,
  `ReducerAction`, `Reducer`, `createꓽaction__base`, `createꓽaction`, `ACTION_TYPEꘌUPDATE_TO_NOW`, `ActionUpdateToNow`,
  `createꓽactionꘌupdate_to_now`, `ACTION_TYPEꘌNOOP`, `createꓽactionꘌnoop`, `ACTION_TYPEꘌHACK`, `createꓽactionꘌhack`,
  `ACTION_TYPEꘌSET`, `createꓽactionꘌset`. This isn't caught by `tsc` because the shared tsconfig disables
  `noUnusedLocals`/`noUnusedParameters`. The shape of the unused imports (action-creator + action-type pairs for
  `update_to_now`/`noop`/`hack`/`set`) strongly suggests this file was copy-pasted from
  `1-isomorphic/1-libs--simple/ts--types--hypermedia/module/60-ohateoas/reducers.ts` and trimmed down, but the leftover
  imports were never cleaned up. It also suggests a real functional gap: the file implements
  `reduceꓽnoop`/`reduceꓽset`/`reduceꓽhack` but — despite importing
  `ACTION_TYPEꘌUPDATE_TO_NOW`/`ActionUpdateToNow`/`createꓽactionꘌupdate_to_now` — never implements the corresponding
  `reduceꓽupdate_to_now`, which looks like an accidentally-dropped piece of functionality rather than a deliberate
  omission.

- **G3-P14-04** [Minor] There is no `README.md` for this package (the sibling `offirmo-state` at least has a stub).
  Nothing documents the intent of `SyncStoreFns`/`SyncReducerFns`/`AllStoreFns` or how a consumer is meant to wire
  `subscribe`/`getSnapshot`/`dispatch`/`init` together.

- **G3-P14-05** [Nit] Top of `module/src/reducers.ts` has a stray leftover comment that looks like an accidental
  AI-prompt artifact left in committed source:

  ```
  /* PROMPT
   * ’
   */
  ```

  Should be removed.

- **G3-P14-06** [Nit] `module/MANIFEST.json5` is an empty object (`{}`), whereas the sibling `offirmo-state` package
  populates `name`/`description`. Minor metadata inconsistency across the same directory level.

No unnecessary OOP/class usage found — the package is a small set of plain interfaces and pure reducer functions,
consistent with the project's functional style. No security concerns (no I/O). Dependencies (`@monorepo-private/assert`,
`@monorepo-private/ts--types--hypermedia`) are internal workspace packages, nothing externally outdated to flag.
