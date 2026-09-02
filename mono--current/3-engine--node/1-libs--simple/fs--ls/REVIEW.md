# Review: @monorepo-private/fs--ls

Thin wrapper around `fs.readdirSync` providing synchronous directory/file listing helpers, including a recursive file
lister.

## Findings

- **LS-01 (Major)** — `lsFilesRecursiveSync()` (`module/index.ts:58-71`) does not forward `options` to its own recursive
  call: `result = [...result, ...lsFilesRecursiveSync(full_dir)]` (line 67) omits the second argument. Two consequences:
  - When called with `{ full_path: false }`, the top-level `dirs` list contains directory _names_ (not full paths, per
    `lsDirsSync`'s behavior with `full_path: false`). The recursive call then does `lsFilesRecursiveSync(full_dir)` with
    a bare directory name and default options, so `fs.readdirSync(full_dir)` resolves it relative to `process.cwd()`
    instead of the intended parent directory — this throws `ENOENT: no such file or directory, scandir '<dirname>'`
    unless cwd happens to already be `srcpath`. Reproduced live:
    `lsFilesRecursiveSync('/tmp/lstest', { full_path: false })` throws
    `ENOENT: no such file or directory, scandir 'sub'`.
  - Even when it doesn't crash (default/`full_path: true`), any option passed by the caller (including future options
    beyond `full_path`) is silently dropped for nested levels — only the top level respects the caller's options.
  - Fix: `lsFilesRecursiveSync(full_dir, options)`.
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
