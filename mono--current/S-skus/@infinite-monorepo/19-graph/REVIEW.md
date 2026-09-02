# Review: @infinite-monorepo/graph

Purpose: type-only package modeling the monorepo as a graph (repo → workspace → workspace-line → package nodes),
including path-variable placeholder types (`$REPO_ROOT$`, `$MONOREPO_ROOT$`, etc.) inspired by JetBrains' path
variables.

## Findings

### G9-P19-01 — Minor — Declared dependency on `@monorepo-private/assert` never used

File: `package.json` (dependencies) vs. `module/src/index.ts`

Same pattern as `15-spec`: this is a type-only module (no runtime imports), yet lists `@monorepo-private/assert` as a
runtime dependency. Appears to be a generator/template artifact rather than an intentional dependency.

### G9-P19-02 — Minor — `ArchRepository` type defined but unused anywhere

File: `module/src/index.ts:112`

```ts
// group of repositories
export interface ArchRepository extends NodeBase {}
```

No other file in the monorepo references `ArchRepository`. It's an empty interface (adds nothing beyond `NodeBase`)
explicitly marked as forward-looking via the `TODO review polyrepo` / `TODO review multirepo` comments nearby, so likely
intentional scaffolding — but as written it's dead code with zero behavior difference from `NodeBase` itself.

### G9-P19-03 — Minor — `WorkspaceLine` / `NodeⳇWorkspaceLine` marked "not implemented" but already load-bearing in two plugins

File: `module/src/index.ts:88-94` says `// not implemented at this stage`, yet `plugin--bolt/module/src/index.ts`
actively constructs and registers a `NodeⳇWorkspaceLine` node (`StateLib.registerꓽnode<NodeⳇWorkspaceLine>`), while
`plugin--pnpm/module/src/index.ts` has the equivalent code path commented out with
`/* TODO 1D WorkspaceLine (unused atm) ... */`. The comment in this package is stale relative to actual usage — at least
one consumer (`plugin--bolt`) already implements it. Worth updating the comment or confirming whether `bolt`'s
implementation is considered complete.

### G9-P19-04 — Nit — `NodeId` comment questions its own correctness

File: `module/src/index.ts:49`

```ts
// id = path so far
export type NodeId = DirPathⳇAbsolute // XXX or relative?
```

The `XXX or relative?` marker signals unresolved design uncertainty on a core identifier type used throughout the graph
(`NodeBase.parent_id`, `NodeRef`). Not a bug per se, but a foundational type with an open question is worth resolving
before more consumers depend on it (three plugins already do).

### G9-P19-05 — Nit — No README, no tests

Package has no `README.md` and no test files. As with `15-spec`, this is type-only so runtime unit tests aren't very
meaningful, but the graph shape (parent/child relationships, `bfs_level`, `plugin_area`) is complex enough that a short
doc comment block or README summarizing the node hierarchy would help; several TODOs
(`TODO better union of descendents?`, `TODO 1D file-level node?`) suggest the model is still evolving.

No OOP/class usage — plain interfaces and pure type unions, consistent with repo conventions.
