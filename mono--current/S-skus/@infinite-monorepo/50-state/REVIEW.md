# Review: @infinite-monorepo/state

Central immutable-state store (types + reducers + selectors) for the infinite-monorepo tool: tracks the SCM/workspace
node graphs, discovered file facts, requested file outputs, and plugin-private sub-state, and drives the BFS traversal
used to build the monorepo graph.

## Findings

### G9-P50-01 (Critical) — Package fails `tsc --noEmit`: 43 type errors in `reducers.ts` alone

Running the package's own `check:ts` script (`tsc --noEmit`) surfaces 43 compiler errors localized to
`module/src/reducers.ts` (plus more inherited from upstream deps, tracked separately). Representative failures:

- `create()` (line ~7) does not satisfy `State` because `root_pkg_details` (declared required in `types.ts:65`) is never
  populated — see G9-P50-02.
- `onꓽspec_chain_loaded()` line 79: `nodeⵧworkspace_root.spec = completeꓽspec(...)` assigns an
  `ImmutableObject<InfiniteMonorepoSpec>` where a mutable `Partial<InfiniteMonorepoSpec>` is expected (the `Omit<...>`
  local object isn't typed as `Immutable`, so mutating `.spec`/`.path‿abs` in place is a type mismatch as well as a
  mutation of what should be treated as read-only).
- `registerꓽnode()` lines 174-251: repeated `Property 'type'/'path‿abs'/'details' does not exist` errors because
  `NodeⳇForꓽregisterꓽnode` is used without its required type parameter (`NodeⳇForꓽregisterꓽnode<NodeType>` vs bare
  `NodeⳇForꓽregisterꓽnode`), collapsing the type to a near-useless union.
- `_getꓽPATHVARⵧROOT_for_type()` line 641: `Generic type 'NodeⳇForꓽregisterꓽnode' requires 1 type argument(s)` — same
  root cause, and this function is called from `registerꓽnode` at line 184/188 with unqualified `_node`/`parent_node`.
- `requestꓽfactsⵧabout_file()` line 504: `Expected 2 arguments, but got 3` for the `callback(state, null, x.content)`
  direct-invocation branch — `AsyncCallbackReducer<T>` (in `types.ts`) is declared as a 2-arg function
  `(state, result) => state`, but is called with 3 args here. This is a real bug, not just a type nit: the extra third
  argument is silently dropped at runtime, so the "already read" fast path likely doesn't deliver the file content to
  the callback the same way the async path does (see G9-P50-03).
- Multiple `exactOptionalPropertyTypes` violations (lines 461, 487, 610) where optional fields are assigned without
  `undefined` in their type, and several `Spread types may only be created from object types` (lines 192, 330, 331) from
  spreading values typed as unions that include primitives/Map/Set.

This means the package's own advertised `check` script is currently red. Since this state module is imported by nearly
every plugin package (`plugin--*`, `60-pkg-analyzer`, `70-operation--apply`), any type-safety guarantees downstream
consumers rely on for `State`/`Node`/callback signatures are currently unverified by the compiler.

### G9-P50-02 (Major) — `State.root_pkg_details` is declared but dead: never set, never read, and not provided by `create()`

`types.ts:65` declares `root_pkg_details: PureModuleDetails // TODO should be in the node?` as a **required** field of
`State`. However:

- `create()` in `reducers.ts` never initializes it (confirmed by the `tsc` error "Property 'root_pkg_details' is
  missing").
- No reducer/selector in this package (`reducers.ts`, `selectors.ts`) reads or writes `root_pkg_details` anywhere.
- No consumer package (`plugin--*`, `60-pkg-analyzer`, `70-operation--apply`) references it either.

Either this is truly dead code that should be removed, or it's an incomplete migration (the `TODO` comment suggests the
field's home was being reconsidered) and `create()` is missing required initialization. As-is it's a latent bug: any
strict consumer constructing/spreading a full `State` object will be type-incorrect, and it contradicts the "single
source of truth" principle since the state's own factory doesn't produce a valid `State`.

### G9-P50-03 (Major) — Inconsistent callback arity for `AsyncCallbackReducer` in `requestꓽfactsⵧabout_file`

`AsyncCallbackReducer<T>` is typed as `(state, result: T | Error) => State` (`types.ts:42`), and the async path in
`resolveꓽasync_operations()` (`reducers.ts:627`) correctly calls it with 2 args: `acb(state, new_substate.content)`. But
the synchronous "already read" fast path in `requestꓽfactsⵧabout_file()` (`reducers.ts:504`) calls
`callback(state, null, x.content)` — 3 arguments, with the actual content as the 3rd instead of the 2nd. Since JS
ignores the extra argument, if any real callback signature follows the 2-arg contract (as the type says it should), the
"already cached" fast path will pass `null` as the `result`/content instead of the real cached content, i.e. **it
silently loses the file content when reusing a cached read**. This looks like a real behavioral bug, not just a type
annotation issue — worth checking (and fixing) at the call sites in `plugin--*` packages that implement these callbacks.

### G9-P50-04 (Minor) — Dead import: `DependencyType` imported but never used

`reducers.ts:729` imports `DependencyType` from `@infinite-monorepo/primitives` alongside `DependencyDetails` and
`PkgFQName`, but only the latter two are referenced anywhere in the file.

### G9-P50-05 (Minor) — Sprinkled `as any` casts around `FileOutputPresent`/`FileOutputAbsent` narrowing

`reducers.ts` lines 112, 530, 539, 543, 561-563 use `as any` / `as any as X` to bridge
`FileOutputAbsent | FileOutputPresent` and `candidate_spec.manifest` access instead of a type guard (e.g.
`intent !== "not-present"` narrows to `FileOutputPresent`). This works around what looks like a real discriminated-union
modeling gap: `requestꓽfile_output`'s overloads are typed correctly, but the shared implementation body loses that
narrowing and falls back to `any`, defeating the type safety the overloads were meant to provide.

### G9-P50-06 (Minor) — `~~tosort` folder present, untriaged content not reviewed

`module/~~tosort/2026/analyze-pkg.ts` (~919 lines) exists inside this package's `module/` tree. Per review scope, its
contents were **not** reviewed for bugs/quality, but its presence is worth flagging: it's a large, uncategorized file
(looks like an older/alternate implementation of package analysis, using `ignore-walk`, `json5`, `parse-imports-ts`,
`write-json-file` — none of which appear as declared dependencies of this package) sitting in the module tree of a
package that's otherwise clean of stray files. It should eventually be triaged: either integrated properly (with its
dependencies added to `package.json`), moved to the appropriate package (`60-pkg-analyzer`?), or deleted if superseded.

### G9-P50-07 (Nit) — Debug logging is compile-time-constant but not stripped, and mixes `console.debug`/`console.log`

`const DEBUG = true` at the top of `reducers.ts` gates most trace logging via `DEBUG && console.debug(...)`, which is a
reasonable lightweight pattern, but `onꓽspec_chain_loaded()` (line 98) has an unconditional
`console.log("Spec loaded:", result)` that bypasses the `DEBUG` gate — likely a leftover debug statement (there's a
commented-out duplicate a few lines below at line 129 that _is_ commented out, suggesting the one at line 98 was meant
to be removed/gated too).

### G9-P50-08 (Nit) — Several `// TODO` markers indicate acknowledged incompleteness

Multiple TODOs mark known gaps, e.g.: `types.ts:65` (`root_pkg_details` placement, see G9-P50-02), `reducers.ts:112`
(`TODO 1D schema validation` on an `as any` cast), `reducers.ts:120` (`TODO 1D handle config not at root of workspace`),
`reducers.ts:152` (`TODO review, duplicate??`), `reducers.ts:200`
(`TODO 1D check that the _ar path prefix match the parent type`), `reducers.ts:383` (`TODO also auto-install types?`),
`reducers.ts:449-450` (`TODO better immu?` / `TODO needed?` on `reconcile()`). None of these are new findings beyond
what's already self-documented, but collected here for visibility since they represent real unfinished edges in graph
registration and path validation.

### G9-P50-09 (Nit) — No tests

No test files exist for `reducers.ts` or `selectors.ts`, despite this being the most logic-heavy, most-depended-upon
package in the group (BFS traversal invariants, node registration invariants, async file-fact caching, output-file
conflict merging). Given the bugs found above (G9-P50-01..03), unit tests (vitest, per the migration direction) covering
`registerꓽnode`, `requestꓽfactsⵧabout_file` (especially the cached vs. non-cached path), and `requestꓽfile_output`
conflict/merge behavior would have likely caught the arity bug in G9-P50-03.

No unnecessary OOP found in this package's own source — `reducers.ts`/`selectors.ts`/`types.ts` are plain functions and
types. (It does _consume_ the `PkgInfosResolver` class from `@infinite-monorepo/pkg-infos-resolver` as an opaque field
on `State`, which is out of scope for this package's review.)
