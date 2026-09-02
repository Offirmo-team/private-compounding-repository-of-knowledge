# Review: @monorepo-private/practical-logger--node

Node-specific sink/wrapper for Offirmo's practical-logger, printing colorized, level-styled log lines (via `chalk`) to
the console and pretty-printing error causes/details.

## Findings

- **PL-01 (Major)** — `module/##doc/demo.ts` (the target of the `demo` npm script, `package.json:14`) is broken on two
  counts: (1) it does `require("../../practical-logger-core/doc/shared-demo")` (line 16) using CommonJS `require` inside
  an ES module (`package.json` declares `"type": "module"`) — `require` isn't defined in ESM without a shim, so this
  throws at runtime; (2) even if that were fixed to a dynamic `import()`, the path
  `../../practical-logger-core/doc/shared-demo` doesn't exist — the actual sibling package is
  `1-isomorphic/2-libs--cross-cutting/11-practical-logger--core` (numeric-prefixed, different relative path), and the
  only `shared-demo.js` files that exist anywhere in the repo live under
  `Z-tosort/...stack--2021--DONE/xxx-migrated/...` (old, migrated-away code) — the current `11-practical-logger--core`
  package has no `doc/shared-demo` file at all. Running `pnpm demo` in this package fails immediately. This looks like
  leftover code from a pre-rename/pre-migration version of the package that was never updated.
- **PL-02 (Minor)** — `README.md:37` references `./doc/screen-term-dark-alt.png`, but the actual image lives at
  `module/~~gen/screen-term-dark-alt.png` (confirmed via `find`) — the README's demo screenshot is a broken link. (Per
  the `~~gen` folder name — likely a generated-content folder — this isn't a `~~tosort` folder covered by the "don't
  review tosort" rule, but is unreviewed either way here since it's a binary asset.)
- **PL-03 (Minor)** — `@monorepo-private/assert` is declared as a `dependency` in `package.json` (line 20) but is never
  imported anywhere under `module/src/` — same stale/unused-dependency pattern seen in other packages in this batch
  (`fs--output-file` FO-02, `spawn-correctly` SC-02).
- **PL-04 (Nit)** — `README.md` ends with two literal `TODO` lines (lines 54, 56) — one bare ("TODO explanation") and
  one pointing to an external article about `util.debuglog`. Harmless but these read as leftover authoring notes rather
  than finished documentation.
- **PL-05 (Nit)** — `to_aligned_ascii` (`module/src/sinks/common.ts:6-13`) left-pads/truncates level labels to a fixed
  width using `(lvl + "         ").slice(0, MIN_WIDTH)` with a commented-out alternative centering implementation
  directly above it (lines 8-10) — minor dead-code-as-comment, harmless.
- **PL-06 (Nit)** — Tests are legacy mocha + chai — consistent with the in-progress vitest migration, not flagged as a
  bug. Coverage is reasonable for the package's small surface: `createLogger` with no/all/custom-sink params, all log
  levels rendering without throwing, and a small structural check that `LEVEL_TO_ASCII`/`LEVEL_TO_STYLIZE` cover every
  `LogLevel`.

No other issues found: `tsc --noEmit` passes cleanly for this package's own code (no transitive dependency errors
observed, unlike several other packages in this batch). No unnecessary OOP/class usage; function-first style throughout.
No `~~tosort` folder present in this package (only the unrelated `~~gen` asset folder noted in PL-02). No
command-injection/shell concerns — this package only writes to stdout via `console.log`/`chalk`, no subprocess spawning;
per PE-03 in the `print-error--to-terminal` review, error `details`/`message` values are passed to
`displayError`/`prettifyꓽany` without ANSI-escape sanitization, but that's a pre-existing characteristic of the
downstream lib, not something introduced here.
