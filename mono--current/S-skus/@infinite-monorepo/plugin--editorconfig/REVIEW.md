# Review: plugin--editorconfig

Writes a `.editorconfig` file with the monorepo's default formatting rules (indent, EOL, per-filetype overrides).

## Findings

- **G10-P2-01 (Minor)** — `module/src/index.ts` imports `manifestꓽᐧgitignore` from `@infinite-monorepo/plugin--git` but
  never uses it — unused import.
- **G10-P3-01 (Minor/style)** — `onꓽapply` has two `case` branches ("repository" and "monorepo") that build and write
  the exact same `intent: "present--containing"` block with `CONFIGⵧDEFAULT` — duplicated logic used twice; per project
  convention ("once a chunk is reused more than twice, extract it") this is borderline but still worth factoring into a
  small shared helper for clarity.
- **G10-P4-01 (Nit)** — `CONFIGⵧDEFAULT` is marked `// TODO one day configurable` — acknowledged future work, no action
  needed.

No other issues found.
