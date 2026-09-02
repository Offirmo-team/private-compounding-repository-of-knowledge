# Review — @infinite-monorepo/pkg-infos-resolver

Purpose: fetches and caches npm package metadata (`package.json`, including auto-discovery of the matching `@types/*`
package) to support version/typings resolution for other `@infinite-monorepo` tooling; exposes a stateful
`PkgInfosResolver` class wrapping an internal immutable-reducer state module.

## Findings

- **G9-P03-01 (Critical)** — `tsc --noEmit` fails with 8 errors in this package (verified by running it directly). This
  means `pnpm check`/`check:ts` is currently broken:
  - `module/src/state/selectors.ts:104-105` — duplicate `State` type import:
    `import type { Catalog, State } from "./types.ts"` immediately followed by
    `import type { PkgFQName, PackageJson, State } from "./types.ts"` (TS2300 "Duplicate identifier 'State'"). One of
    the two `State` imports must be removed.
  - `module/src/state/reducers.ts:125,128,131` — calls to `ǃ.for_param(...)` and `ǃ.for_value(...)`, but the
    `@monorepo-private/assert` v2 API actually exposes `forⵧparam` / `forⵧvalue` (with the special `ⵧ` separator
    character, not an underscore). This is a real typo/API-drift bug — `set()` (the function guarding "package already
    loaded" and "already loading" invariants) cannot currently compile, so those safety checks are dead/broken.
  - `module/src/state/reducers.ts:48,61` — `semver.clean(packageᐧjson.version)` is called with `version` typed as
    `string | undefined` (per `PackageJson.version?: SemVerⳇExact` in `types.ts`), but `semver.clean` requires a
    `string`. These are just log lines, but they don't type-check.
  - `module/src/state/reducers.ts:259` — `deriveꓽInspectablePromise(...)` return type conflicts with
    `exactOptionalPropertyTypes: true` (`reason` typed `unknown` vs required `never`), a type mismatch between this
    package's usage and `@monorepo-private/utils--async`'s `InspectablePromise` type.
- **G9-P03-02 (Major)** — Class/OOP usage against the repo's functional-programming convention. `module/src/index.ts`
  exports `PkgInfosResolver` as an ES class with private field `#state` and a large surface of methods that just
  delegate 1:1 to the pure `StateLib.*` reducers/selectors (e.g. `preload`, `declareꓽmonorepo_pkg`, `inject`,
  `add_catalog_entry`, `get_catalogꘌdefault`, etc.). The underlying `state/` module is already written in the desired
  functional style (pure `create`/reducers/selectors over `Immutable<State>`); the class is a thin, mutable-instance
  wrapper around it that reintroduces mutable OOP-style state (`this.#state = ...`) for no clear benefit — a factory
  function returning a small object of closures (or simply exporting `StateLib` and letting callers thread state
  themselves, consistent with the rest of the codebase, e.g. `50-state`) would fit the stated FP style better. Given
  `PkgInfosResolver` is instantiated with `new` in several call sites (`50-state/module/src/reducers.ts`,
  `50-state/module/src/types.ts`), this is a real, live design smell, not just theoretical.
- **G9-P03-03 (Minor)** — Dead code: `module/src/index.ts:57-103` contains a ~45-line commented-out block (an
  alternate/older version of `ǃgetꓽpackageᐧjson`, `ǃgetꓽversionⵧlatest`, `ǃgetꓽversionⵧfor_dep`) left inside the class
  body. This duplicates logic that now lives in `selectors.ts` (`ǃgetꓽversionⵧlatest_known`, `ǃgetꓽversionⵧfor_catalog`)
  and should just be deleted rather than kept as a comment.
- **G9-P03-04 (Minor)** — No tests exist for this package (no `*.test.ts`/`*.spec.ts` files under `module/`), despite
  the package containing non-trivial branching logic: pending-async resolution/rejection handling in
  `processꓽresolved_pending_async`, monorepo-namespace/package detection (`isꓽmonorepo_package`), types-package
  inference (`getꓽlikely_corresponding_types_pkg`, `hasꓽembedded_typescript_types` — which has several special-cased
  package names, e.g. `type-fest`, `strip-bom`, `typescript`), and catalog-version derivation
  (`ǃgetꓽversionⵧfor_catalog`). These are exactly the kind of pure, easily-unit-testable functions the FP style should
  make trivial to cover with vitest.
- **G9-P03-05 (Minor)** — Silent behavioral inconsistency in error handling: in `processꓽresolved_pending_async`
  (`reducers.ts:26-35`), a `"rejected"` pending promise is only swallowed (logged) when
  `ip._auto && reason.name === "PackageNotFoundError"`; any other rejection is rethrown, which will crash the whole
  reduce loop (and thus `ೱall_pending_loaded()`), losing all other already-resolved entries in the same batch since
  `state` reassignment happens via `.reduce` and the throw escapes before the final `{...state, ↆpackageᐧjson_fetches}`
  is returned. Worth confirming this fail-fast behavior is intentional; if a caller awaits several packages and one
  non-auto fetch fails, all progress for that tick is discarded (though already-committed prior calls persist since
  state is reassigned per-iteration... actually no: the throw happens mid-`reduce`, so the local `state` produced for
  earlier iterations in _this_ call is lost too, since it only returns at the end). Should be double-checked against
  caller expectations (`ೱall_pending_loaded` in `index.ts`).
- **G9-P03-06 (Nit)** — Multiple `// TODO` markers left indicating known-incomplete design: `index.ts:99` /
  `selectors.ts:91` ("TODO named catalogs"), `selectors.ts:61-62` ("TODO rename" / "TODO this is a decision not from
  here" — questioning whether `ǃgetꓽversionⵧfor_catalog` belongs in this package at all), `reducers.ts:177-178`,
  `utils--npm.ts:48,53,65` (unexplained special-casing of `load-json-file`, `type-fest`, `typescript` packages marked
  "TODO review"/"TODO why is it misdetected?"). None are blocking, but they represent real unresolved design debt worth
  tracking.
- **G9-P03-07 (Nit)** — No README for a package with non-trivial exported class-based API surface and an `.npmrc`
  (pinning `registry=https://registry.npmjs.org/` and disabling `package-lock`) that isn't otherwise explained.

Legacy mocha/chai devDependencies are present (`chai`, `mocha`, `@types/mocha`, `sinon`) alongside `vitest` — consistent
with the repo's known migration-in-progress state, not flagged as a bug.
