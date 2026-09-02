# Review: browser-features-detection

Small dependency-free lib of pure, individually-importable browser feature/environment detectors (is-framed,
is-localhost, is-online, is-page-visible, is-tunneled, infer-channel, has-hover, uses-tab).

Note: this package contains a `module/~~tosort` folder (with `2024/` and `2026/` subfolders, e.g.
`devtools-detector.js`, old shared-state prototype) holding unsorted/legacy scratch code — not reviewed here.

## Findings

- **G6-P6-01** (Major): `inferꓽchannel()` in `module/src/l2-infer-channel/index.ts` accepts an injectable
  `currentWindow` parameter (for purity/testability) but then calls `isꓽlocalhost()` and `isꓽtunneled()` with no
  arguments, so those two checks always read the real global `window` instead of the `currentWindow` passed in. Any
  caller/test that injects a mock window to control "is this localhost/tunneled" behavior will get inconsistent results,
  since two of the three gating checks silently ignore the injected window.

- **G6-P6-02** (Major): `module/src/l2-internal/_event-listeners.ts` calls `window.addEventListener(...)` at module top
  level (eagerly, on import), unlike every other file in this package which only touches `window`/`document` lazily
  inside a function body (several even take `currentWindow = window` as a default parameter specifically to defer/allow
  injection). Because `l3-has-hover/index.ts` and `l3-uses-tab/index.ts` import from this file, and both are re-exported
  from the package root `index.ts`, simply importing `@monorepo-private/browser-features-detection` (root) — even just
  to use e.g. `isꓽlocalhost` — eagerly registers global `keydown`/`touchstart`/`pointerover` listeners, and will throw
  immediately in any non-browser context (SSR, Node-based unit tests without a DOM) where `window` is undefined.

- **G6-P6-03** (Minor): `package.json` `exports` map provides subpath exports (backed by a matching `_entrypoint.ts`)
  for every l1/l2/l3 detector except `is-online` and `is-page-visible` (no `_entrypoint.ts` exists for
  `l1-is-online`/`l1-is-page-visible`, and no `"./is-online"` / `"./is-page-visible"` entry in `exports`). This is
  inconsistent with the rest of the package's structure and forces consumers of those two functions to import the full
  barrel (`.`), which also pulls in the eager side effects described in G6-P6-02.

- **G6-P6-04** (Minor): `getꓽmedia_queriesⵧrelevant` (`module/src/l2-internal/_media-queries.ts`) is wrapped in
  `memoize-one` but is called with no arguments, so it effectively memoizes forever after the first call — there's no
  `MediaQueryList.addEventListener("change", …)` to invalidate the cache. `hasꓽhover()` can therefore return a stale
  answer if the user's actual hover/pointer capability changes after the first read (e.g. a mouse/keyboard attached to a
  tablet later in the session).

- **G6-P6-05** (Minor): No unit tests exist anywhere in this package (no `*.test.ts`/`*.spec.ts`), even though `mocha`,
  `chai`, `sinon`, `@types/mocha`, `@types/sinon`, and `vitest` are all listed as `devDependencies` and the `check`
  script only runs `tsc --noEmit`. Several functions were clearly designed to be testable (the `currentWindow` injection
  parameter on `isꓽframed`, `isꓽlocalhost`, `isꓽtunneled`, `inferꓽchannel`) but that design intent is currently
  unexercised — and would have caught G6-P6-01.

- **G6-P6-06** (Nit): Given the above lack of tests, the `mocha`/`chai`/`sinon` (+ their `@types`) devDependencies look
  like unused legacy leftovers sitting alongside `vitest`; per the repo's stated migration to vitest, consider dropping
  them when tests are added rather than carrying both stacks.

- **G6-P6-07** (Nit): `module/src/l3-uses-tab/index.ts` TODO comment has a typo:
  `// TODO persist it lo LS if we detect it!` — "lo" should be "to".

- **G6-P6-08** (Nit): `isꓽlocalhost()` (`module/src/l1-is-localhost/index.ts`) matches suffixes `"test"`, `"example"`,
  `"invalid"`, `"local"` via bare `hostname.endsWith(domain)` with no `.`-boundary requirement, so a hostname that
  merely ends in those letters without an actual `.test`/`.local`/etc. TLD (e.g. a host literally named `unittest` or
  `sometest`) would be misclassified as localhost. Low practical impact since it only feeds dev/staging/prod channel
  inference, not a security boundary, but worth a boundary check (e.g. `=== domain || endsWith("." + domain)`).

No unnecessary OOP/class usage found — the package is fully function-based, consistent with the project's functional
style.
