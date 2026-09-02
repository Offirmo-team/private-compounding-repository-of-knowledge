# Review: plugin--mise

Writes `mise.toml` (tool-version manager config) for the monorepo and adds `.mise/` to `.gitignore`.

## Findings

- **G10-P2-01 (Minor)** — `module/src/index.ts` imports `* as semver from "semver"` but never references `semver.`
  anywhere in the file — unused import.
- **G10-P3-01 (Nit)** — `module/notes.md` has a typo: `.nopmignore` (should read `.npmignore`).

No other issues found — the `mise.toml` content generation (min_version, idiomatic version files, `npm:corepack` tool,
`.env` pointer) is straightforward and has no logic bugs.
