# Review: plugin--bolt

Discovers/manages workspaces for the (largely deprecated) Bolt package manager, reading `package.json`'s
`bolt.workspaces` field.

## Findings

- **G10-P2-01 (Minor)** — `module/src/index.ts` imports `* as semver from "semver"` but never references `semver.`
  anywhere in the file body — unused import.
- **G10-P2-02 (Minor)** — Dead/no-op filter:
  `.filter((relpath) => { // TODO 1D check if package.json BUT I recall that Bolt isn't checking that and fails, so no; return true })`
  — the filter always returns `true`, so it does nothing; the comment explains why but the code should probably just be
  removed rather than kept as a no-op with a TODO.
- **G10-P3-01 (Nit)** — Explicit TODO to deprecate the whole plugin:
  `// TODO 1D follow https://github.com/boltpkg/bolt/blob/master/src/utils/globs.js ... or just deprecate bolt completely`
  — worth tracking but not a bug.
- **G10-P4-01 (Info — folder presence)** — Package contains a `~~tosort` folder:
  `module/~~tosort/2026/find-workspace-packages.ts`. Its content was not reviewed per review-scope rules, but its
  presence is noted here as required.

No other issues found in the reviewed (non-`~~tosort`) code.
