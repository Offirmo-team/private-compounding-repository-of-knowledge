# REVIEW — @tbrpg/marketing

Defines the marketing/hypermedia metadata (author, website entry point spec) used to generate the public marketing site
for the tbrpg SKU.

## Findings

- **G11-P1-01** (Minor) — `module/src/index.ts:76-78` has a `/////// SOCIAL` section with just a `// TODO` comment and
  no content. Either fill it in or remove the empty section header to avoid dead scaffolding.
- **G11-P1-02** (Minor) — The module is never actually consumed anywhere else in the monorepo (no other package imports
  `@tbrpg/marketing`). Confirm whether `WEBSITE`/`AUTHOR` are wired into a build step (e.g. via
  `@web-property-outfitter/generator--website-entry-points`) elsewhere, or if this package is currently dead/unused
  output.
- **G11-P1-03** (Nit) — `icon.svg` path is commented out (`//svg: path.join(__dirname, './icon--rpg.svg'),`) alongside
  several other commented-out `features` entries (analytics, site-verification, css framework). If these are
  deliberately deferred, a brief comment stating why (rather than just leaving them commented) would help future
  maintainers understand intent vs. leftover cruft.
- **G11-P1-04** (Nit) — No test file exists for this package despite `vitest` being listed as a devDependency and a
  `check` script running `tsc --noEmit`. Given the module is pure data/config (a `WebPage` object literal), a test may
  not be very valuable, but if there's meaningful derivation logic expected to move here it would benefit from at least
  a smoke test validating the shape.

No other issues found — the file is small, typed, avoids classes/OOP, and follows functional/data-oriented style
consistent with project conventions.
