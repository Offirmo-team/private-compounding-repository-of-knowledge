# Review: plugin--git

Provides shared `.gitignore` / `.gitattributes` / `.worktreeinclude` manifests consumed by nearly every other plugin,
and writes the monorepo's curated baseline entries.

## Findings

- **G10-P2-01 (Nit/style)** — File structure places all logic first, then `export default PLUGIN`, then a separator,
  then every `import` statement at the very bottom of the file. This is a repo-wide convention (seen in nearly all
  plugins), so not flagged as a bug, but noted here since it's an unusual pattern worth confirming is intentional
  tooling-enforced style (e.g. via an import-sorting rule) rather than an accident.
- **G10-P3-01 (Nit)** — `.worktreeinclude` block has commented-out dead lines (`//.env`, `//.env.local`, `//.env.*`)
  marked `// env vars TODO review` — acknowledged pending decision, no action needed.
- Good practice noted: the `*.map` gitignore entry includes a security-motivated comment (source maps can leak original
  source if committed/leaked) — no issue, just a good example of documented intent.

No other issues found — the default-case dead code in `onꓽapply` (commented out with a `NO! what if overlapping nodes?`
rationale) is a deliberate, well-explained design decision, not a bug.
