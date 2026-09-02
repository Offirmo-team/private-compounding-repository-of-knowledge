# REVIEW — @tbrpg/final--web-app

The final buildable web app shell for the tbrpg SKU — a minimal Vite/Parcel HTML entry point wired to the monorepo's
shared build config.

## Findings

- **G11-P3-01** (Major) — No `tsconfig.json` exists in this package, unlike its sibling in
  `@space-rpg/90-final--web-app` (which has one extending
  `@monorepo-private/config--typescript/module/dom/tsconfig.json` with `lib: ["ES2025", "DOM"]`). Since there's no
  actual `.ts`/`.tsx` source yet (only `index.html`), this may currently be harmless, but it means there's no
  `check`/`check:ts` script either — the package.json has no `scripts.check`, so it won't be covered by the
  monorepo-wide typecheck the way most other packages are (see `30-marketing`'s `check:ts` script for the expected
  pattern).
- **G11-P3-02** (Minor) — `index.html` is a bare template (`$Title$` / `$END$` placeholders) with no actual app mount
  point (`<div id="root">` or similar), and no `<script type="module" src=...>` tag referencing an entry script. If the
  intent is that a build/generator step injects this content, that's fine, but nothing in this package's own files
  indicates where that generator is wired in — worth double-checking the pipeline actually populates this before
  shipping, since a genuinely empty HTML shell would produce a blank page.
- **G11-P3-03** (Minor) — Two build tools are configured side-by-side: `.parcelrc` + `_start:main--parcel` script, and
  `vite.config.ts` + `_start:main--vite` script. Both are kept as alternative dev-start commands (prefixed
  `_start:main--*`), which is a reasonable transitional pattern, but there's no top-level `start`/`dev` script that
  picks one, and no comment indicating which is the currently-preferred/canonical path — worth confirming intent so
  contributors don't run the deprecated one by accident.
- **G11-P3-04** (Nit) — `package.json`'s only real script is `clean`; there's no `build` script despite this being
  explicitly the "final web app" build target. Presumably orchestrated by a root-level Turborepo task, but worth
  confirming this package produces a deployable build via some documented path.

No other issues found; file set is otherwise minimal and consistent with sibling SKU `90-final--web-app` packages.
