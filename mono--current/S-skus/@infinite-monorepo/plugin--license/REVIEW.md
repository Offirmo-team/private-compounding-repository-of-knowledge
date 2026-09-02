# Review: plugin--license

Declares the LICENSE file manifest for packages/monorepo; does not generate content itself.

## Findings

- **G10-P1-01 (Major, copy-paste bug)** — The `doc` array on the LICENSE manifest is:
  `["https://github.com/nvm-sh/nvm?tab=readme-ov-file#nvmrc", "https://www.npmjs.com/package/nvmrc"]` These are
  documentation links for `.nvmrc`, not LICENSE files — completely unrelated to this plugin's purpose. Cross-referencing
  `plugin--nvm/module/src/index.ts`, which legitimately declares the identical `doc` array for its own `.nvmrc`
  manifest, confirms this was copy-pasted from there by mistake and never updated to point at actual LICENSE
  documentation (e.g. choosealicense.com or npmjs license-field docs).

No other issues found — like `changelog`/`readme`, this package only declares a manifest via `onꓽload` with no
`onꓽapply`, which is an intentional, consistent pattern across these "declare only" plugins.
