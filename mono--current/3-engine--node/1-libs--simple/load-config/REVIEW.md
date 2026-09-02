# Review: @monorepo-private/load-config

Walks up the filesystem from a given path (or cwd) toward the fs root, collecting a chain of config file/folder loads
(`radix`) plus metadata about notable boundaries (fs root, home, git repo root, `from`, deepest `package.json`).

## Findings

- **LC-01 (Major)** — `package.json` lists `@monorepo-private/ts--types` only under `devDependencies` (line 26), but
  `module/src/index.ts:165-172` imports types from it (`JSONObject`, `DirPathⳇAbsolute`, `PathⳇAbsolute`,
  `FilePathⳇAbsolute`, `PathSeparator`, `PathⳇAny`) directly in the package's real (non-test, non-sandbox) source file
  that's the package's `exports` entrypoint. Since this monorepo ships packages as raw `.ts` sources via `exports` (not
  compiled `.d.ts`), any consumer whose own `tsc` walks into `load-config`'s `module/src/index.ts` will need
  `@monorepo-private/ts--types` resolvable — but as a `devDependency` here it isn't guaranteed to be present/hoisted for
  downstream consumers, only for local development of this package itself. This should be a regular `dependency` (even
  though it's type-only, `import type` doesn't change Node/pnpm's dependency-resolution requirement here). Type-only
  imports don't need bundling but do need to resolve during consumer type-checking.
- **LC-02 (Major)** — Running `tsc --noEmit` in this package fails, but the error is actually inside a dependency it
  pulls in transitively: `../read-write-any-structured-file/module/src/common/index.ts:146` —
  `result[k] = mergeꓽjson(...)` fails with TS2542 ("Index signature in type 'ImmutableObject<JSONObject>' only permits
  reading"). This means `load-config`'s own `check:ts` script is currently broken through no fault of its own code —
  flagging here since it directly blocks this package's CI/local check, and it's also flagged in the
  `read-write-any-structured-file` review as RW-0x (root cause).
- **LC-03 (Minor)** — Inefficiency acknowledged in-code via
  `// TODO 1D yes we're not very efficient listing all child_dirs_pathes‿rel and child_files_pathes‿rel` (line 39) — at
  every directory level on the way up, both `lsDirsSync` and `lsFilesSync` are called even when only one is strictly
  needed for a given branch. Given this only runs once per `loadꓽconfigⵧchain()` call and directories are typically
  shallow, this is a minor/acceptable inefficiency, correctly self-flagged as a TODO rather than silently left in.
- **LC-04 (Minor)** — `// TODO 1D allow branching to a sibling folder = arch repo / multi mono repo` (line 5) and the
  `HOME_path‿abs` comment `// TODO XDG? TODO can it fail in CI?` (line 19) are legitimate forward-looking TODOs without
  tracking issues — worth linking to an issue tracker if this codebase has one, otherwise they'll be easy to lose track
  of.
- **LC-05 (Minor)** — `loadꓽconfigⵧtopmost` (line 128) does `assert(start_index >= 0, ...)` (line 132) using Node's
  `assert` module for what is effectively user-input validation (an invalid/not-found `options.boundary` value), then
  separately throws a plain `Error` for "no config found" a few lines later (line 138). Mixing `assert()` (traditionally
  for invariants/internal bugs) with thrown `Error` (for expected failure modes) for what are both "the caller-provided
  boundary wasn't found" cases is a minor inconsistency — both are really the same kind of "not found" condition and
  could use the same error-raising convention.
- **LC-06 (Nit)** — `module/README.md` is a single line pointing at an external URL (mise.jdx.dev) for "how
  configuration merging works" — reasonable as a pointer, but doesn't describe this package's actual API
  (`loadꓽconfigⵧchain`, `loadꓽconfigⵧtopmost`, the `Result`/boundary shape). The `sandbox/index.ts` file is a better
  usage example than the README currently offers.
- **LC-07 (Nit)** — No tests at all (no `*.tests.ts`), despite the non-trivial branching logic in `loadꓽconfigⵧchain`
  (boundary detection priority ordering, `~`-path expansion, catch-and-ignore-vs-log logic). This is the kind of
  function that's easy to regress silently; a few unit tests around boundary detection order and the `~` path case would
  add real value.
- **LC-08 (Nit)** — Legacy mocha + chai wiring present in `package.json` (mocha/chai devDependencies, no actual tests)
  alongside vitest — consistent with the broader migration status, not a bug by itself given LC-07.

No unnecessary OOP/class usage; the module is written in the expected function-first style with a plain `Result` type.
No `~~tosort` folder present in this package.
