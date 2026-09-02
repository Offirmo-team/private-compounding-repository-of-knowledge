# Review — @monorepo-private/toolbox--parcel

A pure dependency-aggregation package pulling in npm modules that Parcel needs transitively (`process`, `sharp`,
`parcel-resolver-ignore`, `@parcel/service-worker`) so they get hoisted/installed in the workspace; no source code.

## Findings

- **G5-P5-01** (Nit) — README's paths in the explanatory error snippets reference
  `3-engine--browser/0-dev-tools/parcel--toolbox` but the package now lives under
  `4-engine--browser/0-dev-tools/parcel--toolbox` — stale path from a prior monorepo restructuring, purely
  cosmetic/documentation.
- **G5-P5-02** (Nit) — README's "Tosort" section leaves open questions ("was it needed at some point?" for
  `@parcel/core`) that aren't reflected in `package.json` at all (none of the "Tosort" deps are actually declared as
  dependencies) — the doc is more of a scratchpad of considered-but-rejected additions; harmless but could be trimmed
  once resolved.

No other issues found — this is intentionally a trivial, dependency-only package (per its own `test` script comment: "no
need for unit tests for this kind of repo (meta)"), so absence of source/tests is expected and appropriate.
