# Review — `@monorepo-private/data-structures`

An experimental, in-progress library of graph/tree data structures (currently: generic tree types + a filesystem-tree
implementation), built from concrete use cases (file tree, craft recipe, todo dependencies) rather than a generic ADT
API.

Note: this package contains a `module/~~tosort` folder (years 2023/2024/2025 of prior explorations: file-system,
generic--adjacency, tree--generic, impl--crafting, etc.) holding unsorted/legacy code slated for removal — not reviewed
here per instructions.

## Findings

- **G1-P4-01** (Major) — Unused OOP/class where the codebase mandates functional style, and it's dead code to boot.
  `module/src/2-graphs/1-trees/impl--filesystem/selectors.ts` defines `class CTreeForRL` (lines 92-126) implementing
  `TreeForRL` with a constructor and methods. This is exactly the kind of "class for a Tree" pattern the project's
  functional-programming/no-OOP convention forbids. It could trivially be a factory function returning a plain object
  literal (`{ isꓽroot, getꓽrepresentationⵧlines, getꓽchildren }`), consistent with the rest of the codebase (e.g.
  `getꓽrepresentationⵧlinesⵧgeneric` in `selectors--representation--lines.ts` already consumes a plain-object-shaped
  `TreeForRL` interface, no class needed on the consumer side).

- **G1-P4-02** (Major) — `getꓽparent__path()` is an unimplemented stub that always throws away its work and returns a
  placeholder string, and it's used inside a live error path.
  `module/src/2-graphs/1-trees/impl--filesystem/selectors.ts` lines 17-23:

  ```ts
  function getꓽparent__path<FilePayload, FolderPayload>(node: FileSystemNode<...>): PathⳇRelative {
      let segments: string[] = []
      const { options } = node.root
      return "TODO getꓽparent__path()"
  }
  ```

  `segments` and `options` are computed and never used (dead locals); the function unconditionally returns the literal
  string `"TODO getꓽparent__path()"`. It is called from `getꓽnodeⵧby_path()`'s error message (line 52:
  `could not find "${segment}" in "${getꓽparent__path(acc)}"!`), so any "not found" error thrown by this module
  currently reports a bogus path instead of useful debug context — actively misleading in production use, not just an
  incomplete feature.

- **G1-P4-03** (Minor) — TODO comments left in shipped code. Several TODOs remain outside the acknowledged
  `~~tosort`/`~~gen` legacy areas:
  - `module/src/2-graphs/1-trees/selectors--representation--lines.ts:52-53` — `// TODO check orphans` /
    `// TODO check cycles` in `getꓽrepresentationⵧlinesⵧgeneric()`, meaning malformed graphs (cycles) would cause
    infinite recursion in `_getꓽrepresentationⵧlines()` (see G1-P4-06).
  - `module/src/2-graphs/1-trees/impl--filesystem/types.ts:57` — `// TODO clarify` above the
    `Aggregated<FilePayload, FolderPayload>` type, which is exported but has zero usages anywhere in `module/src`
    (dead/unused type, see G1-P4-05).
  - `module/src/2-graphs/2-full/todo-dependencies/notes.md:1` — a bare `TODO "dependencies graph"` placeholder file with
    no implementation at all (the whole `2-full/todo-dependencies` feature from the README's "use cases" list is just
    this one-line notes file).

- **G1-P4-04** (Minor) — Dead/unused import: `assert_from` is imported but never called in 4 files. `assert_from` is
  imported alongside `assert` from `@monorepo-private/assert` in:
  - `module/src/2-graphs/1-trees/impl--filesystem/selectors.ts`
  - `module/src/2-graphs/1-trees/impl--filesystem/reducers.ts`
  - `module/src/2-graphs/__examples/crafting--mochi-cake/index.ts`
  - `module/src/2-graphs/__examples/fs--foo-bar-gnokman/index.ts` In none of these is `assert_from(...)` actually
    invoked (only `assert(...)` is used). Likely leftover from copy-pasting a boilerplate import header.

- **G1-P4-05** (Minor) — Unused exported type: `Aggregated<FilePayload, FolderPayload>`
  (`module/src/2-graphs/1-trees/impl--filesystem/types.ts:58-64`) is exported from the module's public barrel
  (`index.ts` → `module/src/index.ts`) but has no producer or consumer anywhere in the package. Combined with its own
  `// TODO clarify` comment, this reads as speculative/half-designed API surface.

- **G1-P4-06** (Minor) — No cycle/depth guard in tree rendering, so a malformed (non-tree) graph would recurse forever.
  `_getꓽrepresentationⵧlines()` in `selectors--representation--lines.ts` recurses into `node.getꓽchildren()` with no
  visited-set or depth limit, and the author's own TODO (line 53) flags the missing cycle check. For the filesystem
  implementation this is currently safe in practice (folders can't be their own descendant given the construction API),
  but the generic algorithm is exported and reusable for other implementations of `TreeForRL` where that invariant may
  not hold — worth at least a defensive comment on the exported function since the type only requires structural
  conformance, not acyclicity.

- **G1-P4-07** (Minor) — Naming/README-vs-code mismatch for the file-representation helper. The README's "Common
  operations" list mentions traversal orders (depth first, breadth first, in-order, post-order, level-order) as a
  learning reference, but only one traversal (parent-first pre-order, hardcoded) is actually implemented; no code offers
  a choice of traversal strategy. Not a bug — the README is explicitly framed as "Learning" notes/links rather than an
  API spec — but a reader skimming the README could expect more traversal coverage than exists. Low-risk since the
  package is explicitly `"status": "experimental"` per `MANIFEST.json5`.

- **G1-P4-08** (Nit) — Legacy mocha+chai test present (expected/acceptable per project migration policy, noted for
  completeness, not flagged as a defect): `module/src/2-graphs/1-trees/impl--filesystem/selectors.tests.ts` uses
  `chai`'s `expect`. This is the package's only real test file and covers `getꓽrepresentationⵧlines()` for
  empty/root/sub cases — reasonable coverage for that one selector, but `insertꓽfile`, `upsertꓽfolder`,
  `getꓽnodeⵧby_path`, `getꓽnodeⵧby_pathⵧensure_folder/_file`, and error paths (duplicate insert, not-found lookup) have
  no tests at all. `sinon` and `vitest` are declared as devDependencies but neither is imported/used anywhere in
  `module/src`.

- **G1-P4-09** (Nit) — Filename convention inconsistency: the one real test file is named `selectors.tests.ts` (plural
  `.tests.ts`), matching the package's own `test` script glob (`'./module/**/*.tests.ts'`), but this differs from the
  singular `.spec.ts`/`.test.ts` convention seen in sibling monorepo packages using vitest. Not a bug (it correctly
  matches this package's own mocha glob), just worth flagging if/when this package migrates to vitest, since vitest's
  default glob (`*.{test,spec}.*`) would not pick up `.tests.ts` without config changes.

- **G1-P4-10** (Nit) — `package.json` `dependencies`/`devDependencies` are consistent with actual imports
  (`@monorepo-private/assert`, `@monorepo-private/normalize-string`, `@monorepo-private/ts--types` via type-only
  imports, `chai`/`mocha` for the one test file) — no unused or missing declared dependencies found, and no
  outdated-version concerns since all are `workspace:*`/`catalog:` managed by the monorepo tooling.

## No other issues found

Correctness of the core filesystem-tree operations (`createꓽfilesystem`, `insertꓽfile`, `upsertꓽfolder`,
`getꓽnodeⵧby_path`) looks sound for the documented use case: inputs are not mutated destructively in surprising ways
(new nodes are created via factory functions, not in-place mutation of caller-supplied objects),
duplicate-insert/overwrite is guarded by `assert()`, and empty-tree/root cases are exercised by the existing test. The
package is explicitly marked `"status": "experimental"` and is clearly a work-in-progress incubator library, which
contextualizes several of the TODOs/stubs above as expected rather than alarming — but `getꓽparent__path()` (G1-P4-02)
and the `CTreeForRL` class (G1-P4-01) are the two findings worth prioritizing if this package graduates out of the
incubator.
