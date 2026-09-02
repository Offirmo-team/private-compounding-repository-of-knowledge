# Review — @rpg--space/final--web-app (90-final--web-app)

The final buildable web app shell for the "Space RPG" SKU — a minimal Vite/Parcel HTML entry point plus a codegen script
(`module/++build/index.ts`) wiring `@rpg--space/marketing`'s `WEBSITE` spec through
`@web-property-outfitter/generator--website-entry-points`.

Note: `module/++build` is a build/codegen staging folder (`++` prefix), not `~~tosort` — reviewed normally per
instructions.

## Findings

- **G12D-P4-01** (Major) — `module/++build/index.ts` has no wiring in `package.json`'s `scripts`: there is no
  `build`/`gen` script invoking this file (only `_clean--pkg`, `_start:main--parcel`, `_start:main--vite`, `check`,
  `check:ts`, `clean`, `dev`, `watch:check:ts`). Compare to the `@digital-hoarder`/`@dev-docs--web3` SKU families'
  `++gen`/`index.ts` scripts, which are also unwired in `package.json` but at least documented in their own REVIEW
  findings as a known gap — here the codegen entry point exists but nothing in this package invokes it, so it's unclear
  how/when the generated `~~output` (or wherever it's meant to land) actually gets produced or consumed by
  `module/src/index.html`.
- **G12D-P4-02** (Major) — `module/++build/index.ts:37` writes generated output to a local `~~output` directory (sibling
  of the script, i.e. `module/++build/~~output`), not into `module/src/` where `index.html` (the package's actual
  `exports["."]` entry point and Vite/Parcel serve target) lives. Compare to sibling patterns like
  `@dev-docs--web3/98-web-property/module/src/++gen/index.ts`, which targets a sibling `module/src/` directory of the
  final web app so that generated files are actually served. As written, running this script would not update
  `module/src/index.html`, so the generator appears disconnected from the file actually served by
  `dev`/`_start:main--vite`/`_start:main--parcel`.
- **G12D-P4-03** (Minor) — `module/src/index.html` is a bare template (`$Title$` / `$END$` placeholders, no real
  content, no `<script type="module">` tag, no root mount element). This is consistent with the intent that the
  generator (see above) should replace it, but combined with G12D-P4-01/02, there's currently no working path from spec
  → generated HTML → served app.
- **G12D-P4-04** (Minor) — Two build tools are configured side-by-side: `.parcelrc` + `_start:main--parcel`, and
  `vite.config.ts` + `_start:main--vite`. Both are kept as alternative dev-start commands (`_start:main--*` prefix), a
  reasonable transitional pattern, but there's no top-level `start`/`dev` script picking one and no comment indicating
  which is canonical.
- **G12D-P4-05** (Nit) — `package.json`'s only "build"-like script is `clean`; there is no actual `build` script despite
  this being the "final web app" build target — presumably orchestrated by a root Turborepo task, but worth confirming
  there is a documented, working path to a deployable build.
- **G12D-P4-06** (Nit) — `module/MANIFEST.json5` is an empty object `{}`, giving no description of the package's
  purpose.
- **G12D-P4-07** (Nit) — No tests exist for the codegen wiring in `++build/index.ts` (e.g. verifying the resulting
  `SPEC` object is valid, or that `generateꓽwebᝍproperty` doesn't throw for this spec) — low risk given it's thin glue
  code, but a cheap smoke test would catch drift like the output-path issue above.

No class/OOP usage (plain object literal + top-level await script). No security concerns in this package's own code.
`dependencies`/`devDependencies` in `package.json` were cross-checked against actual imports (`@rpg--space/marketing`,
`@web-property-outfitter/generator--website-entry-points`, `node:path`, `node:url`) — all present and consistent.

No other issues found.
