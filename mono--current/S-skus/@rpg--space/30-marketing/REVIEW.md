# Review — @rpg--space/marketing (30-marketing)

Declares the `WEBSITE`/`Thing`/`WithOnlinePresence` marketing metadata (title, colors, author, canonical URL) for the
"Space RPG" property, consumed by `90-final--web-app` to codegen the site's entry points.

## Findings

- **G12D-P1-01** (Minor) — `module/src/index.ts:28`:
  `urlⵧcanonical: "https://www.offirmo.net/minisite--github-pages-sandbox/"` looks like a leftover placeholder/sandbox
  URL copy-pasted from another minisite rather than a real canonical URL for "Space RPG". Worth double-checking this is
  intentional before shipping.
- **G12D-P1-02** (Nit) — `module/src/index.ts:22-26`: a commented-out `SOCIAL_LINKⵧGITHUB` block (referencing an
  unrelated `minisite--dev-mental-models` repo) is dead code left in the file with no explanatory TODO.
- **G12D-P1-03** (Nit) — `module/src/index.ts:52`: bare `// TODO` under the `SOCIAL` section header with no
  ticket/description of what's pending.
- **G12D-P1-04** (Nit) — `module/MANIFEST.json5` is an empty object `{}`; sibling packages elsewhere in the repo either
  populate this with a `description`/`target` or use the `"description": "TODO description in MANIFEST.json5"`
  placeholder — here it's just empty, giving no hint of intent.
- **G12D-P1-05** (Nit) — No tests for this package (not even a smoke test verifying `WEBSITE` conforms to the `WebPage`
  shape), unlike the sibling `marketing--creator` package it depends on, which does test `AUTHOR` via
  `expectㆍtoㆍbeㆍaㆍvalidㆍAuthor`. Given this is a declarative config module, risk is low, but a similar validity
  check would be cheap and consistent with the pattern already used in this codebase.

No class/OOP usage (plain object literals only). No security concerns (static, non-executable config data).
Imports/exports were cross-checked against `@monorepo-private/marketing--creator` and
`@monorepo-private/ts--types--hypermedia` — all resolve correctly, `dependencies`/`devDependencies` in `package.json`
are consistent with actual imports.

No other issues found.
