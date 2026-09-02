# Code Review — `@monorepo-private/universal-debug-api--placeholder`

No-op implementation of Offirmo's Universal Debug API: does nothing by default but transparently defers to any other
effective implementation (node/browser) already installed on `globalThis._debug`, via a shared root-namespace
convention.

Note: this package contains a `module/~~tosort/demo-web/` folder (and `module/~~tosort/shared-demo.js`) holding
unsorted/legacy demo code, and a `module/src/##doc/demo.ts` scratch demo file — not reviewed here per instructions.

## Findings

- **G3-P5-01 (Major — missing tests)**: The package has zero test files (`module/src/**` contains only `index.ts`,
  `v1.ts`, and the ignored `##doc/demo.ts`), yet `mocha`, `chai`, `@types/mocha`, `sinon`, `@types/sinon`, and `vitest`
  are all listed in `devDependencies`, and `@monorepo-private/config--mocha` too. None of these are used — there's no
  `test` script in `package.json` at all (compare to sibling packages such as `12-practical-logger--minimal-noop`, which
  do have a `test` script). The `CHANGELOG.md` even has `- TODO unit tests!` under `[Unreleased]`, confirming this is a
  known gap. Given the merge/defer logic in `index.ts` (idempotent install via `||=`) is exactly the kind of logic
  that's easy to get subtly wrong and cheap to unit-test with `vitest`, this is worth closing.

- **G3-P5-02 (Minor — dead/unused devDependencies)**: Following from G3-P5-01, `mocha`, `chai`, `@types/mocha`, `sinon`,
  `@types/sinon`, and `@monorepo-private/config--mocha` are declared but nothing in the package uses or references them
  (no `test` script, no test files, no mocharc). Either add tests (preferably vitest, per repo migration direction) or
  drop the unused deps.

- **G3-P5-03 (Nit — README documents an export that doesn't exist)**: The README's usage snippet (lines 53-61) imports
  `globalThis` from the package:
  `import { … globalThis, // exposed from sub-dependency for convenience } from "@monorepo-private/universal-debug-api--placeholder"`.
  `module/src/index.ts` does not export any `globalThis` binding (it only re-exports `getLogger`, `exposeInternal`,
  `overrideHook`, `addDebugCommand`, `createV1`, and the types from `@monorepo-private/universal-debug-api--types`).
  This looks like stale documentation from a previous version of the API surface.

- **G3-P5-04 (Nit — stale/broken README links and badges)**: The README links to sibling packages
  `../universal-debug-api-node/README.md` and `../universal-debug-api-browser/README.md`, and to
  `../../4-tools/universal-debug-api-companion-webextension/README.md` — none of these paths exist in the current
  monorepo layout (the closest match, `Z-tosort/2021/universal-debug-api-companion-webextension`, lives under a "to
  sort" archive, not `4-tools`). The david-dm.org dependency badge also points to a now-defunct service. Low priority
  since this is a private/internal placeholder package, but the doc will mislead anyone who clicks through.

- **G3-P5-05 (Nit — commented-out debug line left in source)**: `module/src/v1.ts` line 5 has
  `//console.trace('[UDA--placeholder installing…]')` left commented out. Either remove it or make it a real (guarded)
  diagnostic; dead commented code adds noise.

No OOP/class usage found — the package is small, purely functional (factory function `create()` returning a plain
object, `||=` for idempotent global install). No security concerns (it deliberately touches `globalThis` but only under
a namespaced `_debug` key, consistent with its documented purpose). No outdated-dependency concerns beyond the unused
ones already noted in G3-P5-02. No other issues found.
