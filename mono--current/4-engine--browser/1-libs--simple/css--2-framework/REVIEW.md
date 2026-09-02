# Review: css--2-framework

A micro CSS framework (reset+foundation consumer, "motherfuckingwebsite"-inspired) adding theming, design tokens, atomic
utility classes, and a couple of small side-effect `.ts` behaviors (tab-focus detection, iOS pinned-webapp viewport
tweak), exposed via `module/src/index.ts`.

Note: this package contains `module/~~tosort`, `module/~~gen`, `module/~~demo`, and `module/##doc` folders (old
storybook configs/fonts/CSS prototypes and scratch docs) — not reviewed here. `module/++gen/build--bundle/index.ts` is
an active build script, not scratch, and is reviewed below.

## Findings

- **G6-P9-01** (Major): `module/src/themes/theming.css` (base theming rules: `scrollbar-color`, `accent-color`,
  link/visited/hover/active colors, `hr`/`img`/heading colors per `[data-o-theme]`) is never `@import`ed anywhere —
  `themes/index.css` only imports `consts--colors--boz.css` and `consts--colors--modifiers.css` plus defines the raw
  color-variable values itself; `theming.css` is a separate, substantial file that's completely disconnected from the
  import graph. The only reference to it is a stale comment in `advanced/error-reports.css` ("see @offirmo framework
  theming"). Net effect: links, scrollbars, and headings don't actually get the theme-aware colors this file was clearly
  meant to provide.

- **G6-P9-02** (Major): Two color-palette files in `module/src/consts/` are defined but never `@import`ed by anything:
  `consts--colors--clrs.css` (the "clrs.cc" palette) and `consts--colors--monk-skin-tones.css` (Google's Monk Skin Tone
  Scale). Only `consts--colors--boz.css`, `consts--colors--modifiers.css`, and `consts--colors--colorhunt--212.css` are
  actually wired in (via `themes/index.css` / `theme--dark--colorhunt212.css`). Dead CSS variables that look available
  but aren't.

- **G6-P9-03** (Major): `module/++gen/build--bundle/index.ts`'s custom `resolver.read` tries to resolve the
  `@monorepo-private/css--foundation` import by substituting the path
  `path.join(__dirname, "../../../css--foundation/public/index.css")`. From `module/++gen/build--bundle`, three `..`
  levels lands at the `css--2-framework` package root, so this resolves to
  `css--2-framework/css--foundation/public/index.css` — a path that can never exist. It should instead reach the sibling
  package at `1-libs--simple/css--1-foundation/public/index.css` (four `..` levels, and the real folder is
  `css--1-foundation`, not `css--foundation`). Even setting aside that neither package currently produces a `public/`
  bundle output, this resolver logic is broken and would fail immediately if the build were run.

- **G6-P9-04** (Major): `module/src/advanced/controls.ts` and `module/src/atomic/atomic--dimension.ts` are both eager
  side-effect modules — `controls.ts` calls `window.addEventListener("keydown", ...)` at module top level, and
  `atomic--dimension.ts` calls `adjust_css()` (which reads `window.location.search` and may call `document`-touching
  `style_once`) at module top level. Both are imported unconditionally from `module/src/index.ts`, so simply importing
  `@monorepo-private/css--framework` (the package root) immediately registers a global keyboard listener and executes
  DOM/URL-reading logic with no way to opt out, and would throw in any non-browser context (SSR, Node-based tests) where
  `window`/`document` are undefined. Same anti-pattern flagged as Major in `browser-features-detection`
  (`_event-listeners.ts`).

- **G6-P9-05** (Minor): `package.json` declares `@monorepo-private/assert` as a runtime `dependency`, but it is never
  imported or used anywhere in `module/src/` or `module/++gen/`. Only `@monorepo-private/style-once` (used in
  `atomic--dimension.ts`) is actually used — `assert` looks like a stale/unused dependency.

- **G6-P9-06** (Minor): `README.md`'s two live-demo links are both explicitly marked "TODO BROKEN"
  (`https://codepen.io/Offirmo/pen/qYYWVy` and `https://codepen.io/Offirmo/pen/zjavzJ`), and the "automatic defaults"
  usage snippet has a literal placeholder `href="TODO"` — stale/incomplete documentation that would mislead a new
  consumer trying to follow the README's own usage instructions.

- **G6-P9-07** (Minor): `module/src/index.stories.ts` carries a large amount of dead/commented-out code: an entirely
  commented block defining `BackdropsBackgrounds()`, `Fonts()`, `ColorsAsCSSVariablesTable()`/`Colors()` (~200 lines),
  plus `Containers()` and `Experimental()` which are stub functions returning `"TODO"` with big commented-out
  implementations directly below them. Several of these blocks use JSX syntax (`<>...</>`, `style={{...}}`) even though
  the file is a plain `.ts` (not `.tsx`), so this code couldn't even be re-enabled by simply uncommenting it — it would
  need a syntax/tooling conversion first, suggesting it's genuinely abandoned rather than paused.

- **G6-P9-08** (Nit): `package.json` name is `@monorepo-private/css--framework` while the folder is `css--2-framework` —
  same numbering-vs-name mismatch pattern noted in `css--0-reset` and `css--1-foundation`.

- **G6-P9-09** (Nit): No unit/visual-regression tests exist, despite `mocha`, `chai`, `sinon` (+ `@types`), and `vitest`
  all being listed as `devDependencies`. The two side-effect `.ts` files (G6-P9-04) and the build script (G6-P9-03) are
  the pieces that would most benefit from even a minimal smoke test, since both currently have latent bugs.

- **G6-P9-10** (Nit): `module/src/tokens/tokens--scale.css`'s `--o⋄scale` variable is entirely commented out with a
  `NOT IMPLEMENTED` note — the "programmatic UI scaling" token advertised by the file's own comment doesn't exist yet.
  Awareness only, consistent with the package's many other explicit TODOs.

No unnecessary OOP/class usage found — the two `.ts` logic files are small functional scripts (aside from the
side-effect-on-import issue in G6-P9-04). `package.json` `exports` (`"." -> "./module/src/index.ts"`) matches the actual
entry point; unlike `css--0-reset`/`css--1-foundation` (which export `.css` directly), this package intentionally
exports a `.ts` file since it needs to also pull in the two side-effect modules alongside the CSS.
