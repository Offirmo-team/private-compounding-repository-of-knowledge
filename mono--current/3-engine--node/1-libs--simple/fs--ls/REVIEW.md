# Review: @monorepo-private/fs--ls

## Findings

- **LS-02 (Minor)** — `lsDirsSync`/`lsFilesSync` throw a generic `Error` ("Missing dirent.parentPath! …") if
  `dirent.parentPath` is falsy, guarding against pre-Node-20 environments. This is reasonable defensive coding, but the
  check runs on every dirent in a `.map()` — for large directories this is a lot of repeated identical checks; could be
  hoisted to a single check on the array, or simply trust the environment given package.json/engines presumably already
  pins a Node version (not verified — no `engines` field present in `package.json`, so this guard is actually
  load-bearing and appropriately placed).
- **LS-03 (Nit)** — No tests exist for this package at all (no `*.tests.ts` files), despite `mocha`/`chai`/`vitest`
  being listed as devDependencies and a `check` script wired to run tests implicitly via `check:ts` only (the `test`
  script itself is entirely absent from `package.json`, unlike sibling packages e.g. file-entry). The LS-01 recursion
  bug would have been caught immediately by a basic recursive-listing test with `full_path: false`.
- **LS-04 (Nit)** — No README.md, unlike some sibling `1-libs--simple` packages.
