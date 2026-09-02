# Review: plugin--turborepo

Adds `turbo` as a monorepo dev dependency and appends `.turbo/` to `.gitignore`; ships a static reference `turbo.jsonc`
template and README under `module/src`/`module/~~gen` for documentation purposes.

## Findings

- **G10-P2-01 (Minor, self-acknowledged gap)** — The plugin never actually declares or writes a `turbo.jsonc` file
  manifest — `onꓽload` only declares the `.gitignore` manifest, and `onꓽapply` only ever requests output for
  `.gitignore`. The static `module/src/config/turbo.jsonc` template exists but isn't wired to any `requestꓽfile_output`
  call. This matches the file's own top-of-file comment `// TODO turbo.jsonc`, so it's a known, tracked gap rather than
  a silent oversight — flagged here mainly so it isn't lost, since every other config-writing plugin in this batch
  (oxfmt, oxlint, mise, vite, etc.) does generate its config file.
- **G10-P3-01 (Nit)** — `module/~~gen/turbo.jsonc.README.md` documents useful script-naming conventions (`prepare:pkg`,
  `generate`, `build`, `clean`) for turbo-orchestrated tasks — good reference content, no issue.

No other issues found in the (small) implemented logic.
