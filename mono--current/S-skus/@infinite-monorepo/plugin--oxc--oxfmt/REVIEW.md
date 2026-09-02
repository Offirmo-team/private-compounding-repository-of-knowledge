# Review: plugin--oxc--oxfmt

Writes a static `oxfmt.config.ts` (formatter config: import sorting, printWidth, quote style, per-filetype overrides)
for the monorepo.

## Findings

No significant issues found. The plugin writes a fixed, reasonable `defineConfig({...})` template. Self-acknowledged
TODOs for future dynamism are present but not bugs:

- `format: "text", // for now TODO improve 1D` on the manifest.
- Hardcoded `internalPattern: ["@monorepo", "@monorepo-private"]` marked
  `// TODO make dynamic, internal namespaces, matching editorconfig`.

No other issues found.
