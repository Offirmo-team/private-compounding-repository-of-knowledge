# Review — @monorepo-private/parcel-resolver

A custom Parcel "last resort" resolver plugin that remaps `.js` imports to their `.ts` source, helps resolve
`@monorepo*` npm modules referenced from CSS/HTML, and fakes throwing virtual modules for a hardcoded list of "not yet
resurrected" packages.

## Findings

- **G5-P4-01** (Major) — `module/index.ts:78`: `if (true || DEBUG) { console.error(...) }` — the `true ||`
  short-circuits the condition so this always executes regardless of the `DEBUG` flag, meaning every unresolved
  dependency (the common/expected case for a "last resort" resolver) unconditionally dumps `params`/`Dependency` details
  via `console.error` in every build, including production/CI builds. This looks like a debug leftover (`true ||` used
  to temporarily force the branch on) that was never cleaned up. Should be `DEBUG` alone, or intentionally documented if
  the noisy error output is desired for every unresolved case.
- **G5-P4-02** (Minor) — `POSSIBLY_UNRESURRECTED_OFFIRMO_MODULES` (`module/index.ts:15-22`) hardcodes a list of package
  names — several of which (`@monorepo-private/react--error-boundary`, `@monorepo-private/rich-text-format--to-react`,
  `@monorepo-private/soft-execution-context--browser`, `@monorepo-private/practical-logger--browser`,
  `@monorepo-private/universal-debug-api--browser`) are real, present packages in this monorepo (reviewed elsewhere in
  this batch). If any of these specifiers ever legitimately reach this resolver (e.g. via a broken/renamed import
  elsewhere), the plugin will silently return a virtual module that throws `'This module is not yet resurrected!'`
  instead of surfacing the real resolution error — a maintenance trap if this list becomes stale (module resurrected but
  list not updated, or vice versa).
- **G5-P4-03** (Nit) — Extensive `DEBUG &&` logging scattered through `resolve()` is fine for a diagnostic tool, but the
  `DEBUG` constant is a hardcoded `false` with no way to toggle via env var; combined with G5-P4-01 this makes the
  "debug" concept inconsistent (some logs gated, one is not).

No other issues found — no OOP misuse (the single `Resolver` instantiation is mandated by the Parcel plugin API, not a
design choice), and the `.js` → `.ts` remap logic and CSS/HTML npm-module resolution logic are reasonably documented via
the README and inline comments explaining the underlying Parcel bugs being worked around.
