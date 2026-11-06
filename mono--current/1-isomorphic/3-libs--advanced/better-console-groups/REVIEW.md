# Review: `better-console-groups`

Purpose: monkey-patches the global `console` so that collapsed/lazy `console.group()`s are automatically deployed and
broken out of (uncollapsed) when a `warn`/`error`/failed `assert` happens inside them — handy when reading nested logs
in Chrome DevTools.

## Findings

### G6-P3-01 — Minor (design smell / latent footgun)

`install()` (default export, aka `improve_console_groups`) is not idempotent or re-entrant-safe. It captures
`ORIGINAL_METHODS` from `original_console = ORIGINAL_CONSOLE` (`= console`, the _live_ global object, not a snapshot
taken before any patching occurred). If `install()` were ever called a second time, it would capture the
_already-patched_ `console.group`/`groupEnd`/etc. as its "original" methods, stacking a second wrapping layer on top of
the first instead of being a no-op or a clean re-install.

- Currently mitigated in practice: the package's only declared public entry point (`module/index.ts`, exported via
  `package.json`'s `"exports": {".": "./module/index.ts"}`) wraps `install` in `limit-once`'s `once()`, so
  `_request_install_better_console_groups_if_not_already()` can only ever trigger the real `install()` once.
- However, `better-console-groups.ts` itself still exports the raw, unguarded `install`/`improve_console_groups`
  (`export { install as improve_console_groups }`, `export default install`). Any future internal code (or a deep import
  bypassing the exports map) calling it more than once would silently double-wrap `console`.

### G6-P3-02 — Minor

Leftover `const DEBUG = false` flag with many internal `if (DEBUG) ORIGINAL_METHODS["log"](...)` trace calls scattered
through `better_group`/`better_groupCollapsed`/`better_groupEnd`/`better_output`. Reasonable as a development aid, but
it's dead weight in the shipped module (no build-time stripping visible) and isn't exposed via the public `Options` API
if a consumer actually wanted this tracing.

### G6-P3-03 — Minor (missing tests)

No test files exist for this package at all (no `.test.ts`/`.spec.ts`, mocha or vitest). This is the one package in this
review batch with genuinely non-trivial stateful logic — lazy group deployment, forced "break out of collapsed group"
bookkeeping, nested `group_invocations` stack management — that would clearly benefit from unit tests (per the project's
push to adopt vitest for new tests). Worth covering at least: lazy deploy on first output, forced uncollapse on
`error`/failed `assert`, `warn` uncollapsing only when `uncollapse_level: "warn"`, and correct pairing of `groupEnd()`
calls after a forced uncollapse (verified by inspection to be handled correctly, but untested).

### G6-P3-04 — Nit

```ts
console.assert = (assertion: boolean, ...args: any[]) => {
  if (assertion) {
    // do nothing
  } else {
    better_output(ORIGINAL_METHODS["assert"], true, assertion, ...args)
  }
}
```

Could drop the empty `if` branch in favor of `if (!assertion) { ... }`, consistent with the project's guidance to avoid
unnecessary comments/branches.

## Notes

- Traced the lazy-deploy / forced-uncollapse logic in `better_output` in detail; the pairing between forced internal
  `better_groupEnd()` calls (during uncollapse) and later user-code `groupEnd()` calls is correctly self-consistent,
  since both go through the same `group_invocations` stack rather than the real DevTools nesting count — no correctness
  bug found there.
- No OOP/class usage — a single closure-based `install()` factory holding private per-installation state
  (`group_invocations`, `in_original_call`, `ORIGINAL_METHODS`), which is an appropriate and idiomatic functional-style
  choice here (each `install()` call needs its own encapsulated mutable state, and there is no natural "many instances"
  use case that would call for a class).
- Dependency (`limit-once`) and package.json/MANIFEST are consistent with each other and with sibling packages;
  `sideEffects: false` is accurate since importing the package does not itself invoke the console patch (the consumer
  must call `_request_install_better_console_groups_if_not_already()` explicitly).
- No other issues found.
