# Review: font--comics

Purpose: graphical/font assets (CSS `@font-face` declarations + calibration + storypad demo stories) for comic-style
"speech bubble" typography in an RPG UI — largely a static asset package, not application logic.

Note: this package contains scratch/legacy folders that were **not reviewed** for content, per instructions:

- `module/~~tosort/blambot/*.webp` — a batch of 23 binary Blambot font-preview images, not reviewed.
- `module/~~tosort/storypad/index.html` — legacy storypad bootstrap, superseded by
  `module/__fixtures/storypad/index.html`.
- `module/~~gen/` — generated research notes (`research.md`) and reference images (`david-revoy-*.jpeg`), not reviewed.

## Findings

- **G6-P10-01 (Major)** — Case-sensitive CSS class mismatch breaks the Ames--free demo/calibration entirely.
  `module/src/ames--free/index.css` declares `.omr⋄font⁚Ames--Free--raw` and `.omr⋄font⁚Ames--Free` (capital `F`), but
  `module/src/ames--free/index.stories.tsx` sets `const KLASS = "omr⋄font⁚Ames--free"` (lowercase `f`), and applies
  `class="${KLASS}--raw"` / `class="${KLASS}"` to the demo `<div>`s. Since CSS class selectors are case-sensitive, none
  of the Ames--free stories ever actually match the `@font-face` styling — the story pages render with the fallback
  `sans-serif` font instead of the calibrated comic font. (For comparison, `deevad-hand` and `_test` get this right:
  their `KLASS` constants exactly match their CSS class names.)

- **G6-P10-02 (Minor)** — Broken README link. `README.md` points to `./src/~~gen/research.md`, but the actual file lives
  at `module/~~gen/research.md` (no `src/` in the real path, and the link is relative to the package root where there is
  no `src/` folder at all). The link is dead as written.

- **G6-P10-03 (Minor)** — Inconsistent script naming vs. sibling packages. `package.json` exposes the TS-check
  entrypoint as `"_check": "run-s check:ts"` (leading underscore), whereas the sibling asset package `font--smallest`
  (and the other 3 packages reviewed here) expose it as `"check": "run-s check:ts"`. The repo-root `turbo.jsonc` defines
  a `"check": {}` pipeline task; because this package's script is named `_check` instead of `check`, it will silently be
  skipped by any tooling/CI that runs `turbo check` (or similarly invokes the `check` script) across the monorepo,
  unlike its sibling.

- **G6-P10-04 (Nit)** — Public export surface only covers one of the two fonts. `package.json`'s `exports` map is
  `{ ".": "./module/src/deevad-hand/index.css" }`, so `ames--free` (which has its own complete asset, license, and
  stories setup, parallel to `deevad-hand`) is not reachable via the package's public entry point — only via a deep
  relative path inside the monorepo. Possibly intentional (deevad-hand may be the "chosen" font and ames--free kept as
  an alternative/experiment), but worth confirming since nothing in the README or MANIFEST documents this asymmetry.

- **G6-P10-05 (Nit)** — `module/src/_test/index.css` and `index.stories.tsx` are a leftover scratch/test harness (not
  excluded by naming convention since the folder is `_test`, not `~~test`): the CSS's actual `@font-face` rules are
  entirely commented out and reference font files that don't exist in the package (`Ames-Regular.otf`,
  `animeace2_reg.otf`, etc.), leaving only a no-op `.omr⋄font⁚TEST { font-family: "TEST", sans-serif; ... }` rule. Looks
  like leftover scaffolding from calibrating the two real fonts; consider removing if no longer needed.

No other issues found — the CSS itself (font-face declarations, `size-adjust`/`ascent-override` calibration, license
files) is straightforward and consistent between the two real fonts, and there is no OOP/class usage to flag (this
package is CSS + tiny story functions only).
