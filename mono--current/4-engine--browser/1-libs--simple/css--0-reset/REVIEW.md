# Review: css--0-reset

A per-browser/per-version CSS "true reset" (no opinionated defaults) assembled via `@import` chains, exposed as a single
`module/src/index.css` entry point.

Note: this package contains a `module/~~gen` folder (captured/generated default browser stylesheets:
`default-stylesheets/blink (chromium)/*`, `gecko*.css`, `webkit*.css`, plus `other-resets/toremove.css`) — not reviewed
here.

## Findings

- **G6-P7-01** (Major): `module/src/browser--safari/versions/v17.css` exists (with only a comment, no actual rules yet)
  but is never `@import`ed from `browser--safari/index.css` (which only imports `versions/v15.css`). Since the package's
  own `README.md`/`NOTES.md` describe an intent to track per-version differences, this file is effectively dead/orphaned
  — Safari 16/17+ get no dedicated ruleset even though the file was started.

- **G6-P7-02** (Major): The entire `module/src/differences/*.css` folder (`body.css`, `button.css`, `line--height.css`,
  `text-size-adjust.css`, `underlines.css`) and `module/src/semantic-errors/h123456.css` are never `@import`ed by any
  other CSS file (only `semantic-errors/monospaced.css` is actually wired in, via the three browser version files).
  `text-size-adjust.css` in particular contains real, non-trivial rules (`-moz-text-size-adjust`,
  `-webkit-text-size-adjust`, `text-size-adjust: none` on `html`) that look intentional but currently have zero effect
  on consumers of this package — dead code that misleads anyone skimming the source tree into thinking these resets are
  active.

- **G6-P7-03** (Minor): Package name mismatch: `package.json` `name` is `"@monorepo-private/css--reset"`, but the folder
  is `css--0-reset` and the sibling packages follow a numbered naming scheme (`css--1-foundation`, `css--2-framework`).
  Either the package.json name is stale (missing the `--0-` numbering) or this is an intentional exception — worth
  confirming, since it could confuse dependency resolution/search for the numbered sibling packages.

- **G6-P7-04** (Minor): Four files are present but completely empty: `module/src/differences/body.css`,
  `module/src/differences/button.css`, `module/src/differences/underlines.css`,
  `module/src/semantic-errors/h123456.css`. They read as placeholders for planned-but-unwritten reset rules (consistent
  with the many `TODO`s in `README.md`/`notes.md`), which is fine for a work-in-progress reset, but combined with
  G6-P7-02 makes it hard to tell "empty because not yet written" apart from "empty and abandoned."

- **G6-P7-05** (Nit): `module/src/index.css` line 1 has a
  `/* TODO use https://www.browserstack.com/guide/create-browser-specific-css */` — long-standing TODO, listed for
  traceability, no action needed beyond awareness.

- **G6-P7-06** (Nit): Numerous TODOs scattered through
  `README.md`/`module/notes.md`/`module/src/browser--chrome/NOTES.md`/`module/src/browser--safari/NOTES.md` ("default
  stylesheet: TODO", research links) — consistent with the package's stated early/exploratory state; not flagged
  individually.

- **G6-P7-07** (Nit): No unit/visual-regression tests exist, though the README explicitly states "should be unit tested
  with visual regression" as a goal. Given this is pure CSS with no logic, and cross-browser visual regression tooling
  is a bigger investment, this is noted as a gap rather than a hard requirement.

No `.ts` logic files exist besides the stories file (`module/stories/known-issues/flex_heigth100pc.stories.ts`), which
is a demonstration/documentation story, not testable logic — no bugs found there. `package.json` `exports`
(`"." -> "./module/src/index.css"`) matches the actual entry file. No OOP/class usage (pure CSS + one small stories
module).
