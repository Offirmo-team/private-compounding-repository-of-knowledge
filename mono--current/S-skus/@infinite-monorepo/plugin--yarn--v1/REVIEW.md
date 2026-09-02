# Review: plugin--yarn--v1

Writes yarn-v1/bolt-specific `package.json` fields (`engines.yarn`, `devEngines.packageManager`) and a `.gitattributes`
merge strategy for `yarn-lock.json`.

## Findings

- **G10-P2-01 (Nit)** — `manifestꓽyarnᝍlockᐧjson`'s `doc` array is empty with only a `// TODO` placeholder comment — no
  documentation links yet, unlike every other manifest in this batch which links to relevant docs.
- **G10-P2-02 (Nit)** — `devEngines.packageManager` version field has a dangling `// TODO version` comment — the version
  constraint isn't actually specified yet.
- Good practice noted: correctly gates all behavior on the active package manager being `"yarn"` or `"bolt"` via an
  early return, avoiding the plugin firing when irrelevant.

No other issues found.
