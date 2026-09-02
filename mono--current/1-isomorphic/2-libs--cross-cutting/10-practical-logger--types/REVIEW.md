# Review — @monorepo-private/practical-logger--types

Purpose: pure TypeScript type declarations (no runtime code) defining the shared `Logger` / `LogLevel` / `LogPayload` /
etc. interfaces used by all practical-logger implementations.

## Findings

- **G3-P1-01 (Minor)** — Unused runtime dependency. `package.json` declares `@monorepo-private/assert` under
  `dependencies`, but nothing under `module/` imports or references it (grep for `@monorepo-private/assert` across
  `module/` is empty). Since this package is explicitly "no code, 0 bytes", any listed runtime dependency is suspicious.
  Likely safe to remove (note: `package.json` carries the
  `"// @infinite-monorepo/plugin--package-json": "auto generated some content in this file"` marker, so this may be
  tooling-generated boilerplate rather than a hand-added mistake).

- **G3-P1-02 (Nit)** — Vacuous test assertion. `module/index.tests.ts` reads `expect(lib).not.to.have.any.keys` —
  `.keys` is never invoked as a function (`.keys(...)`), so no actual chai assertion runs; the statement is a no-op
  property access. The comment `// that's it` suggests the real intent is just "this file type-checks and imports
  cleanly", which is a legitimate test for a types-only package, but the dangling chai expression reads as if it asserts
  something about `lib`'s shape when it does not.

- **G3-P1-03 (Nit)** — README badge links to `david-dm.org`, a dependency-analysis service that has been shut down for
  years; this badge/link is dead documentation cruft, shared boilerplate across the older-style READMEs in this
  monorepo.

- **G3-P1-04 (Nit)** — Structural inconsistency: this package's single source file lives at `module/index.ts`, while
  sibling packages reviewed alongside it (`practical-logger--core`, `universal-debug-api--types`) use a
  `module/src/index.ts` layout. Not a bug, just a minor convention drift within the same package group.

No other issues found. The type declarations themselves (`module/index.ts`) are clean, well-commented on non-obvious
design choices (e.g. why bunyan-style overloads were rejected), and internally consistent with what
`practical-logger--core` and `practical-logger--minimal-noop` actually implement.

Note: `module/~~gen/notes.md` exists (a stray one-line link to Cloudflare Workers observability docs) — per review scope
this `~~gen` folder's content was not reviewed, just flagged as present.
