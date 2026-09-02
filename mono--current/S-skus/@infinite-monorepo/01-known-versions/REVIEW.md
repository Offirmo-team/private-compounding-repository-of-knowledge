# Review — @infinite-monorepo/known-versions

Purpose: a tiny static registry of "known versions" (Ubuntu LTS, Node.js LTS, pnpm recommended) used elsewhere in the
monorepo as a single source of truth for current tooling baselines.

## Findings

- **G9-P01-01 (Minor)** — Unused dependency. `package.json` declares `"@monorepo-private/assert": "workspace:*"` under
  `dependencies`, but `module/src/index.ts` (the package's only source file) never imports or uses it. Either the
  dependency is dead weight or the package is missing the assertions it was presumably meant to have (e.g. asserting the
  shape of `KNOWN_VERSIONS`).
- **G9-P01-02 (Nit)** — No README. The package has no `README.md` documenting what "known versions" means, how the
  values are meant to be kept up to date, or who/what consumes `NODE_MAJOR_VERSION`. Given the file is basically
  config-as-code with maintenance TODO comments (`// [ ] NEXT: …`), a short README would help future maintainers
  understand the update cadence.
- **G9-P01-03 (Nit)** — No tests. There's no runtime logic to speak of (just a literal object + one derived constant),
  so this is low-value, but note it per the review checklist: zero test coverage exists for this package.

No other issues found. The file is small, clean, uses `as const` correctly, and the one exported derived constant
(`NODE_MAJOR_VERSION`) is a reasonable convenience export. No classes/OOP present.
