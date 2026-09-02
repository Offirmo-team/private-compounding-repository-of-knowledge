# Review — @monorepo-private/practical-logger--core

Purpose: isomorphic (node+browser) reference implementation of the practical-logger `Logger` interface — level
filtering, common-details merging, argument normalization, and a bunyan-inspired default JSON sink — meant to be
reused/wrapped by the platform-specific `practical-logger--browser`/`--node` packages.

## Findings

- **G3-P2-01 (Major)** — README/behavior mismatch. The README states this package "is a perfectly working logger which
  will output JSON lines to stdout, corresponding to log lines, in the same way bunyan does." In reality the default
  sink is `outputFn: LogSink = console.log` (`module/src/core.ts:26`), invoked with the raw `LogPayload` _object_, not a
  JSON string. Node's `console.log(someObject)` prints an inspected representation (unquoted keys, potential
  multi-line/pretty formatting for nested values) — not a single JSON line. To get actual bunyan-style JSON lines, a
  caller must pass their own sink that does `JSON.stringify(payload)`. The README should either say so explicitly or
  ship that as the default.

- **G3-P2-02 (Major)** — Missing test coverage for the module's core behaviors. `module/src/core.tests.ts` only checks
  that `create()` doesn't throw with no args, and that `checkLevel()` throws on an invalid level. Nothing tests:
  - level filtering (that `setLevel`/`isLevelEnabled` actually suppress lower-priority log calls from reaching
    `outputFn`);
  - `addCommonDetails` merging behavior, or its guard that throws when `details.err` is set;
  - the `serializer()` output shape (that `name`/`time`/`level`/`msg`/`details` are populated correctly and `err` is
    only attached when present). These are the primary responsibilities of this package and are currently unverified by
    any test.

- **G3-P2-03 (Minor)** — Silent loss of falsy log arguments. In `normalizeArguments`
  (`module/src/normalize-args.ts:15-16`), `Array.from(raw_args).forEach((arg) => { if (!arg) return; ... })` skips _any_
  falsy argument outright. So `logger.info(0)`, `logger.info(false)`, or `logger.info("")` never contribute to the
  message, and the logger silently falls back to `"(no message)"` instead of logging the falsy value. This edge case
  isn't covered by `normalize-args.tests.ts`.

- **G3-P2-04 (Minor)** — Loosely-typed lookup table construction. `LOG_LEVEL_TO_HUMAN` (`module/src/consts.ts:40-49`)
  casts both the alias map and the `reduce` accumulator `as any`, which throws away type-checking for what could be a
  small, precisely-typed `Record<string, string>` built with a typed reducer callback. Minor, but at odds with the
  codebase's general preference for precise, pure, well-typed helpers.

- **G3-P2-05 (Minor)** — Broken/typo'd README link: `https://www.npmjs.com/package/@offirmo/practical-loggernode` is
  missing a hyphen (should read `.../practical-logger-node`).

- **G3-P2-06 (Nit)** — Unused runtime dependency `@monorepo-private/assert` (same pattern as `practical-logger--types`;
  not referenced anywhere under `module/`).

Note: `module/##demo/index.ts` exists (skipped per review scope — a manual demo script exercising `__shared-demos`).
`module/notes.md` contains a single unaddressed TODO ("review https://logtape.org/intro").
