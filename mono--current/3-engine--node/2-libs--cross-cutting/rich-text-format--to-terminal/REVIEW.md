# Review: @monorepo-private/rich-text-format--to-terminal

Renders Offirmo's "rich text format" document tree to a terminal-friendly string with ANSI styling (bold/italic/dim via
`chalk`), built on top of a generic text-walker/renderer.

Note: this package contains a top-level `tosort/2025/index.mjs` file holding unsorted/legacy code slated for removal —
not reviewed here.

## Findings

- **RT-01 (Critical)** — The package does not compile: `module/index.ts` imports `WalkerCallbacks`,
  `RenderingOptionsⵧToText`, `RenderToTextState`, `DEFAULT_RENDERING_OPTIONSⵧToText`, and `renderⵧto_text` from
  `@monorepo-private/rich-text-format` (lines 3-10), but none of these are exported by that package anymore — confirmed
  via `tsc --noEmit` (`TS2305: Module has no exported member ...`, 5 errors) and by reading
  `@monorepo-private/rich-text-format`'s actual entrypoint
  (`1-isomorphic/2-libs--cross-cutting/40-rich-text-format/module/src/index.ts`), which only re-exports `l1-types`,
  `l1-utils`, and the `l2-sugar/builder`. The text-rendering functionality (`renderⵧto_text`, `WalkerCallbacks`, etc.)
  now lives in a _different_, separate sibling package: `@monorepo-private/rich-text-format--to-textual` (confirmed
  present at `1-isomorphic/2-libs--cross-cutting/41-rich-text-format--to-textual/module/src/to-text/index.ts` and
  `walk.ts`, which do export matching names). This package's `package.json` (line 20) only depends on
  `@monorepo-private/rich-text-format`, not on `--to-textual` — this looks like a package split/rename that happened
  upstream (`rich-text-format` → `rich-text-format` + `rich-text-format--to-textual`) without updating this consumer. As
  written, this package cannot type-check or run; every downstream `on_type`/`on_classⵧafter` callback parameter also
  degrades to implicit `any` (TS7031, 4 more errors) as a direct consequence.
- **RT-02 (Major)** — `module/index.tests.ts:28` calls `.pushNode($node)` on a `Builder` (from
  `RichText.fragmentⵧblock()`), which also fails to compile
  (`TS2339: Property 'pushNode' does not exist on type 'Builder'`) — a second, independent breakage in the test file
  beyond RT-01, suggesting the `Builder` API in `rich-text-format`'s `l2-sugar/builder.ts` has also changed shape
  (method renamed/removed) since these tests were last run successfully.
- **RT-03 (Minor)** — `README.md` is a fragmentary code snippet with two dangling `TODO support images` /
  `TODO support links` notes (each with a raw, unindented `package.json`-dependency-line snippet rather than actual
  prose) — reads as scratch notes rather than finished documentation; doesn't explain the
  `renderⵧto_terminal(doc, callback_overrides?)` signature or the `callbacksⵧto_terminal` export.
- **RT-04 (Nit)** — `@monorepo-private/assert` is declared as a `dependency` (`package.json:19`) but never imported in
  `module/index.ts` — same stale-dependency pattern flagged repeatedly elsewhere in this batch (e.g. `fs--output-file`
  FO-02, `spawn-correctly` SC-02, `practical-logger--node` PL-03).
- **RT-05 (Nit)** — `on_classⵧafter` (lines 57-65) is an explicit no-op stub with `// not implemented!` /
  `// TODO one day...` comments and commented-out debug code — self-documented as intentionally incomplete, consistent
  with the package's overall "TODO support images/links" scope-in-progress state; not flagged as a hidden bug, just
  noting the extent of unfinished functionality alongside RT-01.

Given RT-01/RT-02, this package is currently broken end-to-end (fails to compile, tests can't run) — it should not be
depended on until the `rich-text-format`/`rich-text-format--to-textual` split is reconciled here (likely: add
`@monorepo-private/rich-text-format--to-textual` as a dependency and re-point the imports at it). No unnecessary
OOP/class usage (the `Builder` referenced in tests is an existing upstream API, not something introduced by this
package). No command-injection/shell concerns — this package only formats strings for terminal display via `chalk`, no
subprocess spawning; note that, as with `print-error--to-terminal` (PE-03), styled output is not sanitized against
embedded ANSI escape sequences in the source document's text content, a general log/terminal-injection consideration if
that content can originate from untrusted input.
