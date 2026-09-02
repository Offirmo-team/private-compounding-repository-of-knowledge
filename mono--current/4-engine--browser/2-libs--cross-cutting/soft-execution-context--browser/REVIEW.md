# Review — @monorepo-private/soft-execution-context--browser

Browser-specific extensions to the cross-platform Soft Execution Context (SXC): global error/unhandled-rejection
listeners wired to `SXC.handleError`, plus browser/OS detection (via Bowser) injected as SXC analytics details.

Note: this package contains a `module/~~tosort/` folder (`__demo/demo.html`, `__demo/demo.js`, `cheatsheet.mjs`,
`good_lib.js` — legacy/unsorted code) — not reviewed here.

## Findings

- **G5-P14-01** (Minor) — `README.md:8` shows usage calling `listenToUncaughtErrors()`, but the package actually exports
  `listenToErrorEvents` (confirmed in `module/index.ts:31` and its re-export at line 111) — no `listenToUncaughtErrors`
  symbol exists anywhere in the package. The README example as written would throw `ReferenceError` if copy-pasted.
- **G5-P14-02** (Minor) — `package.json` declares `@monorepo-private/assert` as a dependency, but it's never imported
  anywhere in the package (only file, `module/index.ts`, confirmed via grep) — dead dependency.
- **G5-P14-03** (Nit) — `module/index.ts:89,103`: two `@ts-expect-error` directives with `TODO understand and fix error`
  / `TODO type properly` comments — both suppress real type errors around
  `injectDependencies`/`setAnalyticsAndErrorDetails`, meaning the actual shape mismatch between this package's
  `BrowserDetails`/`Partial<BaseInjections>` and the core SXC's expected types is currently unverified by the type
  checker.
- **G5-P14-04** (Nit) — `module/index.ts:12-29`: a large commented-out `listenToErrors()` function (the "previous"
  `window.onerror`-based approach) left in place with a comment explaining it's redundant with `listenToErrorEvents` —
  reasonable as a historical note, but could be trimmed since the rationale is already captured in the one-line
  `// XXX redundant, next one is better (?rly)` comment above it.
- **G5-P14-05** (Nit) — `module/consts.ts:1`: `PREFIX = "XOF"` has a `// TODO review` comment — unresolved naming
  decision affecting the localStorage key namespace (`XOF.dev_mode`, `XOF.verbose`).

No other issues found — no OOP/class usage (plain functions throughout), and no test files exist for this package; the
two `@ts-expect-error`-suppressed injection points would be reasonable candidates for basic vitest coverage once the
underlying type mismatch (G5-P14-03) is resolved.
