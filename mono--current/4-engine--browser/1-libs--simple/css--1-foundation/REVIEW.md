# Review: css--1-foundation

An "opt-out" foundation CSS layer (built on top of `css--0-reset`) providing universal, non-configurable best-practice
styles for bare HTML elements, exposed as a single `module/src/index.css` entry point plus a lightningcss bundling
script.

Note: this package contains `module/~~gen`, `module/~~sandbox`, and `module/~~tosort` folders (generated "motherfucking
website" demo pages/tests, HTML sandboxes, and unsorted 2024/2025 color-token/media-query CSS prototypes) — not reviewed
here.

## Findings

- **G6-P8-01** (Major): `module/src/elements/element--button.css` is a comment-only stub
  (`/* see elements--controls.css */` / `/* TODO improved buttons */`) with no actual rules, and it references a file
  `elements--controls.css` that does not exist anywhere in `module/src/elements/`. `elements--inputs.css` even
  cross-references `element--button.css` as if button styling were handled there. Net effect: `<button>` gets zero
  foundation styling despite the file structure implying it's covered, and the referenced sibling file is a dangling
  reference (probably meant to be renamed/created, or the comment is stale).

- **G6-P8-02** (Minor): `element--dl.css` is entirely commented out (a `<dl>` grid layout marked `XXX TO CHECK`) —
  dead/inactive code left in the active `src/` tree rather than in `~~tosort`/`~~sandbox`. Low impact (a `dl` gets no
  foundation styling, consistent with many other minimal-styling choices in this package), but it's inconsistent with
  the "opt-out, all code enabled at once" philosophy stated in the README ("all the code is enabled at once, it's best
  practices") since this block is present but deliberately disabled.

- **G6-P8-03** (Minor): `_build:bundle` script (`module/++gen/build--bundle/index.ts`) hardcodes an output path
  `../../../public/index.css` (i.e. one level above the package root), but no `public/` directory exists in the package
  and it's not referenced by `package.json` `exports` or `files`. If this build step is actually used downstream, its
  output location/consumption isn't visible from the package itself — worth confirming it's still needed/wired up
  correctly, since `exports["."]` points directly at the raw `module/src/index.css`, not at any bundle output.

- **G6-P8-04** (Minor): In `module/++gen/build--bundle/index.ts`, the custom `resolver.read` special-cases
  `@monorepo-private/css--reset` by returning an empty string with a `// TODO one day. Not critical.` comment — meaning
  the bundled/minified output silently drops the reset import instead of resolving it, which could produce a bundle that
  looks complete but is missing the reset layer. Fine as a known, called-out limitation, but flagged since a consumer of
  the bundled file (as opposed to the raw `index.css`) would get an incomplete stylesheet without an obvious signal.

- **G6-P8-05** (Nit): `module/src/root/focus.css` is a single TODO comment with no rules
  (`/* TODO https://css-tricks.com/standardizing-focus-styles-with-css-custom-properties/ */`) — focus-ring styling is
  currently entirely unhandled by this foundation layer despite having a dedicated file reserved for it. Worth being
  aware that accessibility-relevant focus styling is not yet implemented here.

- **G6-P8-06** (Nit): `element--img.css` sets `image-rendering: -webkit-optimize-contrast;` unconditionally with a bare
  `/* src: ? */` comment — a vendor-prefixed, WebKit-specific property applied with no fallback/standard
  `image-rendering` value and no citation for why this specific value was chosen (other prefixed hacks in this package,
  e.g. in `root/typography.css`, are thoroughly justified/dated; this one isn't).

- **G6-P8-07** (Nit): `package.json` name is `@monorepo-private/css--foundation` while the folder is `css--1-foundation`
  — same numbering-vs-name mismatch pattern as `css--0-reset` (named `css--reset`) and presumably `css--2-framework`;
  noted for consistency, not a functional bug.

- **G6-P8-08** (Nit): No unit/visual-regression tests exist. Given this package is pure CSS plus a couple of thin
  `.stories.ts` re-exports and one small Node build script, this is a minor gap rather than a real risk — the build
  script (`++gen/build--bundle/index.ts`) would be the only piece with meaningful logic worth a smoke test.

No unnecessary OOP/class usage found — the one `.ts` file with real logic (`module/++gen/build--bundle/index.ts`) is a
straightforward functional script; `.stories.ts` files are thin re-exports. `package.json` `exports` matches the actual
`module/src/index.css` entry point.
