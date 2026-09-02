# Review: 0-meta/scripts

Purpose: a tiny internal `@monorepo-private/scripts` package exposing two CLI bin scripts
(`monorepo-script--clean-package`, `monorepo-script--update-build-variables`) used by other monorepo packages'
`package.json` `scripts` (e.g. `"clean": "monorepo-script--clean-package …dist …cache"`).

## Findings

- **G1-P3-01** (Minor) — `exports["."]` points to `./module/src/clean.mjs`, but that file is a CLI script with
  unconditional top-level side effects (it reads `process.cwd()/package.json` and calls `console.log`/starts cleaning as
  soon as it's loaded). Declaring it as the package's importable entry point contradicts `"sideEffects": false` in the
  same `package.json`, and there is no evidence anywhere in the monorepo that this package is ever `import`ed as a
  library (grep found zero `from "@monorepo-private/scripts"` usages — only the two `bin` commands are consumed).
  Verified: running `node --input-type=module -e 'import ".../clean.mjs"'` from an unrelated directory immediately
  throws trying to read a `package.json` that doesn't exist there — i.e. merely importing the "module entry point"
  crashes/executes unwanted work. The `exports` field looks like copy-paste boilerplate that doesn't reflect real usage;
  it should probably be removed (this package's only public surface is the two `bin` executables).

- **G1-P3-02** (Minor) — `clean.mjs`'s `default` case (`module/src/clean.mjs:61-63`) does `path.join(PKG_PATH, dir)`
  with no validation of `dir`, so a caller-supplied argument like `../../../somewhere` (or an absolute path) is honored
  as-is and then recursively force-deleted (`fs.rm({recursive: true, force: true})`). Verified experimentally:
  `monorepo-script--clean-package ../victim` run from a package directory deleted `../victim` outside the package. Since
  `cli.input` always comes from trusted local `package.json` "scripts" today, this is low risk in practice, but there's
  no defensive check that the resolved path stays within `PKG_PATH`, so a typo'd or copy-pasted `clean` script in some
  package could silently delete the wrong directory (e.g. a sibling package or `../..`).

- **G1-P3-03** (Nit) — `update-build-variables.mjs` shebang requests `node --experimental-import-meta-resolve` (line 2),
  but the flag is never used anywhere in the file (no `import.meta.resolve` call). Verified via `grep` — no
  `import.meta.resolve` usage. This is dead/vestigial CLI configuration; harmless (Node 24 still accepts the flag) but
  should be dropped since it serves no purpose and could confuse a future reader into looking for `import.meta.resolve`
  usage that doesn't exist.

- **G1-P3-04** (Nit) — `clean.mjs:53` comment `// parcel 1 ?` for `.cache` — the file also cleans `.parcel` labeled
  "parcel 1" and `.parcel-cache` labeled "parcel 2" a few lines below, so the uncertain `?` on the `.cache` entry looks
  like a leftover guess rather than a confirmed convention. Purely cosmetic, no functional impact.

- **G1-P3-05** (Nit) — No automated tests exist for either script (no `*.tests.ts`, `*.spec.*`, mocha or vitest files
  found in the package). Given the package's small size and that it's a pair of straightforward CLI wrappers, this is a
  minor gap rather than a serious defect — a couple of vitest cases (e.g. for `to_numver` in
  `update-build-variables.mjs`, which already contains 3 inline `assert` "tests" at module load time at lines 69-71)
  would be a natural, low-effort addition.

## Other notes (not findings)

- No `~~tosort` folder present in this package — the mandatory note is included only for completeness; nothing to flag
  here.
- No README in this package. Given its tiny, self-explanatory surface (two CLI scripts, both named descriptively, both
  discoverable via `--help` through `meow`), this is acceptable and not flagged as an issue.
- No classes/OOP found — the code is already idiomatic functional-style Node scripts (plain functions, no mutation of
  inputs beyond expected filesystem side effects, no shared/global mutable state beyond CLI-scoped constants). No style
  violations to flag on that front.
- Dependencies (`chalk`, `meow`, `semver`, `tiny-invariant`, `write-json-file`, all via the workspace catalog) are all
  actively imported and used; catalog versions (`meow ^14`, `semver ^7`, `chalk ^6`, `tiny-invariant ^1`,
  `write-json-file ^7`) are current/reasonable — nothing outdated to flag.
- `package.json` `bin`/`exports` paths correctly point at the two existing files in `module/src/`; both scripts are
  executable (`chmod +x` verified) and their polyglot shebang (`":" //# ... ; exec /usr/bin/env node "$0" "$@"`) was
  verified to work correctly when invoked directly.
- No TODO/FIXME comments found in the source.

Overall this is a small, low-risk utility package; only minor/nit-level issues were found, no bugs that affect current
real-world usage.
