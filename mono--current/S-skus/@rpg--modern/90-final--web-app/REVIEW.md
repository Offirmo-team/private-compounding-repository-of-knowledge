# REVIEW — @rpg--modern/final--web-app

The final buildable web app shell for the `@rpg--modern` SKU — a minimal Vite/Parcel HTML entry point wired to the
monorepo's shared build config.

## Findings

- **G12C-P2-01** (Major) — No `tsconfig.json` exists in this package, unlike sibling `@space-rpg/90-final--web-app`
  (which has one extending `@monorepo-private/config--typescript/module/dom/tsconfig.json` with
  `lib: ["ES2025", "DOM"]`). There is also no `check`/`check:ts` script in `package.json`, so this package isn't covered
  by the monorepo-wide TS typecheck the way most other packages are. Harmless today since there's no `.ts`/`.tsx` source
  (only `index.html`), but if any script is later injected via a bundler entry point, there's no static verification
  path.
- **G12C-P2-02** (Minor) — `module/src/index.html` is a bare template (`$Title$` / `$END$` placeholders only) with no
  mount point (e.g. `<div id="root">`) and no `<script type="module">` tag. Compare with
  `@digital-hoarder/90-final--web-app/module/src/index.html`, which is a fully generated page (critical CSS,
  trailing-slash-normalization script, `<main id="react-root">`, module script importing the app entry). It's unclear
  from this package alone whether a generator step (e.g. `@web-property-outfitter/generator--website-entry-points`,
  which `@rpg--modern/marketing` depends on) is actually wired to populate this file before build/deploy, or whether the
  site would ship as a blank page.
- **G12C-P2-03** (Minor) — Two build tools are configured side-by-side (`.parcelrc` + `_start:main--parcel`, and
  `vite.config.ts` + `_start:main--vite`), with no top-level `start`/`dev` script picking one and no indication of which
  is canonical. Same pattern flagged in sibling review for `@tbrpg/90-final--web-app` (G11-P3-03).
- **G12C-P2-04** (Nit) — `package.json`'s only script besides the build-tool starters is `clean`; there is no `build`
  script despite this being the "final web app" target. Likely orchestrated by a root Turborepo task, but worth
  confirming there's a documented path that actually produces a deployable artifact for this SKU.
- **G12C-P2-05** (Nit) — This package is structurally identical (same `package.json` shape, same `.parcelrc`, same
  `vite.config.ts`, byte-identical `index.html`) to `@tracer-bullet/90-final--web-app` and other `90-final--web-app`
  siblings. Expected for a scaffolded template, but flagging since none of these files differentiate the `@rpg--modern`
  SKU from its siblings — same absence of build script and tsconfig is repeated across the family rather than being
  package-specific.

No other issues found; file set is minimal (`package.json`, `.parcelrc`, `vite.config.ts`, `module/MANIFEST.json5`
(empty `{}`), `module/src/index.html`) and consistent with sibling SKU `90-final--web-app` packages. No `~~tosort`
folder present in this package.
