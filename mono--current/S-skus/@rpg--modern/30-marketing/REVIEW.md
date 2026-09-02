# REVIEW — @rpg--modern/marketing

Marketing/SEO metadata entry point (author + website property spec) for the "Mental Models Dev" mini-site SKU.

## Findings

- **G12C-P1-01** (Minor) — `module/src/index.ts` imports `Author` and `Url‿str` as types from
  `@monorepo-private/ts--types--hypermedia` but never uses either as a type annotation anywhere in the file (only
  `Author` appears again inside a comment block). `noUnusedLocals`/`noUnusedParameters` are disabled repo-wide in the
  shared tsconfig, so `tsc --noEmit` stays silent, but these are dead imports that should be removed.
- **G12C-P1-02** (Nit) — The `/////// SOCIAL` section is followed only by a `// TODO` with no ticket/description, and
  `content: {}` is left empty with no comment on what (if anything) should live there. Low-value as a marketing stub,
  but worth a one-line note on intent (e.g., "content intentionally empty, site is a placeholder").
- **G12C-P1-03** (Nit) — This file is byte-for-byte identical to
  `S-skus/@tracer-bullet/30-marketing/module/src/index.ts` and `S-skus/@tbrpg/30-marketing/module/src/index.ts` (same
  title "Mental Models Dev", same GitHub repo URL `minisite--dev-mental-models`, same canonical URL). This looks like a
  copy-paste scaffold that wasn't yet customized per-SKU — worth confirming this is intentional (e.g. a template not yet
  filled in) rather than an accidental duplicate that should differentiate `@rpg--modern` from
  `@tracer-bullet`/`@tbrpg`.

No other issues found. `MANIFEST.json5` is an empty placeholder (`{}`), consistent with sibling SKU marketing packages
across the monorepo. `package.json` dependencies (`@monorepo-private/assert`, `@monorepo-private/marketing--pro`,
`@monorepo-private/ts--types--hypermedia`, `@web-property-outfitter/generator--website-entry-points`) all match actual
imports in `index.ts`. Legacy mocha/chai devDependencies are present alongside vitest per the monorepo's ongoing
test-framework migration — expected, not a defect. No `~~tosort` folder present in this package.
