# Review: @monorepo-private/read-write-any-structured-file

Reads/writes many "structured" file formats (JSON/JSON5/JSONC, YAML, TOML, markdown-with-frontmatter, `.gitignore`-style
lists, single-value files, JS/TS default-export configs) with a common JSON representation, plus a small deep-merge
helper.

## Findings

- **RW-01 (Critical)** — `module/src/common/index.ts:146` fails to type-check: `result[k] = mergeꓽjson(...)` on
  `result: Immutable<JSONObject>` — TS2542 "Index signature in type 'ImmutableObject<JSONObject>' only permits reading."
  `result` is declared as `Immutable<JSONObject>` (line 141) specifically to satisfy the return type, but the function
  then needs to _build_ that object via mutation before returning it, which the `Immutable<>` wrapper type forbids at
  the type level. Running `tsc --noEmit` in this package fails because of this. This is the same failure surfacing as a
  transitive error in the `load-config` review (LC-02) — `load-config` imports `ↆloadꓽfileⵧdefault_export`/`ↆreadꓽfile`
  from this package's `read` entrypoint, and this error blocks that package's typecheck too. Fix: build `result` as a
  plain mutable `{ [key: string]: JSON }` locally, then cast/return it as `Immutable<JSONObject>` only at the return
  statement (or use `Object.fromEntries` to build it functionally, matching the "avoid mutating inputs and prefer no
  local mutable state" convention this monorepo favors anyway).
- **RW-02 (Major)** — `package.json`'s `"."` export (line 8) points to `./module/src/write/index.ts`, NOT a
  shared/common entrypoint — meaning a bare `import from "@monorepo-private/read-write-any-structured-file"` gets _only_
  the write API, with none of the read functionality re-exported (aside from `mergeꓽjson`, exported for convenience from
  both). This is surprising given the package name implies symmetric read+write capability from the top-level import; a
  consumer must know to import from `/read` or `/write` explicitly. At minimum this deserves a top-level README
  explaining the three entrypoints (currently the only doc is `module/notes.md`, which doesn't mention the exports map
  at all).
- **RW-03 (Major)** — `ೱwriteꓽfile` (`module/src/write/index.ts:16-37`) has switch cases for `"toml"` (line 23-24) but
  the top-level format-inference dispatch table (`inferꓽformat_from_path` in `common/index.ts:47-48`) never returns
  `"toml"` for `.toml` files — wait, actually checking again: line 47-48 of `common/index.ts` _does_ map `.toml` →
  `"toml"`. However, `ೱwriteꓽfile`'s switch is missing a case for `"jsonc"`, `"jsoncⵧwith_trailing_comma"`, and
  `"markupⵧmediawiki"` — all of which are valid members of `StructuredFileFormat` (`types.ts:12-23`) and are inferred by
  `inferꓽformat_from_path` (e.g. `.jsonc` → `"jsonc"` at `common/index.ts:34-35`) but hit the
  `default: throw new Error(...)` branch in the writer. So writing to a `.jsonc` file — a format the reader explicitly
  supports and infers — throws `Writing to format jsonc not implemented!` at runtime. This is a real functional
  gap/inconsistency between the read and write sides for a format that's advertised as supported.
- **RW-04 (Minor)** — `ೱwriteꓽfile`'s 4th parameter is `{}: {} = {}` (line 7) — an unused, oddly-typed placeholder
  parameter (empty object type, destructured to nothing, defaulting to `{}`). If this is meant as a forward-compatible
  "options" slot, it would be clearer as `options: SomeOptionsType = {}` with a real (even if currently empty) named
  type, or removed until actually needed — as written it reads as leftover scaffolding.
- **RW-05 (Minor)** — Format-writing for `"markupⵧmarkdown"` (line 33-34 of `write/index.ts`) delegates to
  `ೱwriteꓽfileⵧtext`, which just does `${content.text}` — this silently drops any `frontmatter` present on
  `ContentⳇMarkup` (`text: string; frontmatter?: JSONObject` per `types.ts:68`). Since the _reader_
  (`ↆloadꓽfileⵧmarkdown` in `read/index.ts:151-178`) explicitly parses and returns frontmatter, the write path is
  asymmetric: read-then-write of a markdown file with frontmatter will silently lose the frontmatter. Given the explicit
  `// TODO details EOL / trailing` comment nearby, this looks like a known-incomplete area, but the frontmatter loss
  specifically isn't flagged anywhere.
- **RW-06 (Minor)** — Security-relevant design note already self-documented in `types.ts:7`:
  `"TS is flexible but risk code injection (cf. contractor hiding a process exfiltration payload in a config file)"` for
  the `"default-export"` format, which is implemented via dynamic `import(path.resolve(process.cwd(), file_path))` in
  both `ↆloadꓽfileⵧdefault_export` (`read/index.ts:99-102`) and mirrored in the writer. This is a legitimate concern
  already flagged by the authors — worth reiterating here since this reviewer was asked to pay attention to security:
  any caller of `ↆreadꓽfile`/`ೱwriteꓽfile` on a `.ts`/`.js`/`.mjs` config file is executing arbitrary code from that
  file with the current process's full privileges. This is inherent to supporting "config as code" and can't be fixed
  without dropping the feature, but consumers upstream (e.g. `load-config`, which walks up the filesystem and will pick
  up `.ts`/`.js` config files automatically) should be aware they're one untrusted repo checkout away from arbitrary
  code execution. Worth a prominent README warning, which doesn't currently exist.
- **RW-07 (Nit)** — `module/notes.md` mentions
  `TODO env var extension? BUT risky https://pnpm.io/blog/2026/06/11/env-variables-in-repository-npmrc` — good,
  security-conscious TODO, no action needed, just noting the security-awareness is already present in the docs for a
  different feature (env-var substitution) than RW-06.
- **RW-08 (Nit)** — No tests at all for this package (no `*.tests.ts` files) despite the non-trivial format-inference,
  parsing, and merge logic — the RW-01 and RW-03 bugs above would likely have been caught by basic round-trip
  (write-then-read) tests per format.
- **RW-09 (Nit)** — `_getꓽjson__type` (`common/index.ts:99-116`) throws a generic `"Incorrect JSON!"` for anything that
  isn't array/null/primitive/plain-object — e.g. would throw for a JS `Date`, `Map`, `Set`, etc. passed accidentally.
  Reasonable for a function that's meant to operate on already-validated JSON, but the error message doesn't say _what_
  was wrong, which would help debugging.

No `~~tosort` folder present in this package. No unnecessary OOP/class usage — code is function-first throughout,
consistent with monorepo style.
