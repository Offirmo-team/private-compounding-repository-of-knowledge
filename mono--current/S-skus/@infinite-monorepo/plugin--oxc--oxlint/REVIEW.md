# Review: plugin--oxc--oxlint

Writes `oxlint.config.ts` for the monorepo; structurally near-identical to the sibling `plugin--oxc--oxfmt`.

## Findings

- **G10-P2-01 (Minor)** — `onꓽapply` currently writes an **empty** `defineConfig({})` — oxlint is effectively
  unconfigured/a no-op right now. This may be intentional scaffolding (there's a dangling `// TODO meta/config--oxlint`
  referencing a not-yet-created shared config package), but as it stands the plugin doesn't actually configure any lint
  rules.

No other issues found.
