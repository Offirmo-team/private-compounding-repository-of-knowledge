# Review: plugin--readme

Declares the README.md file manifest; actual README.md content is written elsewhere (by `plugin--offirmo`'s
`_static_files()`).

## Findings

- **G10-P2-01 (Minor)** — `package.json` lists `types-for-plugins` under `devDependencies`, but `module/src/index.ts`
  imports from it live (used in actual runtime logic, not just types) — it should be a normal `dependency`, matching the
  same misclassification pattern also seen in `plugin--changelog`, `plugin--license`, and `plugin--tosort`.
- **G10-P3-01 (Nit)** — The division of responsibility (this plugin only declares the manifest; `plugin--offirmo` writes
  the actual content) is a bit non-obvious from within this package alone — likely intentional, but worth a short
  comment here pointing at where the content is actually generated, for future maintainers landing in this file first.

No other issues found.
