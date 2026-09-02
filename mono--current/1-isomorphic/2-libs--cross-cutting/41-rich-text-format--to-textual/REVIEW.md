# Code Review — `@monorepo-private/rich-text-format--to-textual`

Renders `@monorepo-private/rich-text-format` `Node`/`NodeLike` documents to plain text/Markdown, built on a generic,
hook-based tree-walker (`walk.ts`) shared by (presumably) all textual renderers.

Note: this package contains a `module/~~tosort/2026/to-debug/index.ts` and `module/~~tosort/2026/to-html/index.ts` — not
reviewed here per instructions (their content was only skimmed for context: they appear to be draft debug and HTML
renderers built on the same `walk()` primitive, suggesting `to-text` may currently be the only "finished" renderer of a
planned set).

## Findings

- **G3-P8-01 (Major — missing README)**: The package has no `README.md` at all (confirmed absent from the full file
  listing), unlike sibling package `40-rich-text-format` (which at least has a one-line one). Given this package exposes
  a non-trivial generic `walk()`/`WalkerCallbacks` extension API (used by `to-text` and, per the `~~tosort` drafts,
  intended to be reused by `to-html`/`to-debug`), some documentation of the hook contract
  (`onꓽnodeⵧenter`/`onꓽnodeⵧexit`/`onꓽconcatenateⵧstr`/`onꓽconcatenateⵧsub_node`/`resolveꓽunknown_ref`) would materially
  help anyone writing a new renderer.

- **G3-P8-02 (Minor — empty test file / no test for `common.ts`)**: `module/src/common.tests.ts` contains only
  `describe(`${LIB} -- common`, () => {})` — an empty suite, no actual test cases. Meanwhile `common.ts` exports two real functions: `isꓽlink()` (untested) and `getꓽcontent‿nodes_list()` (untested directly, though exercised indirectly through `walk.tests.ts`/`to-text/index.tests.ts`). `isꓽlink()` in particular — a one-line `!!$node.$hints.href`
  check — has no direct coverage.

- **G3-P8-03 (Minor — commented-out/unimplemented filter feature, silently dropped)**: `walk.ts`'s
  `_walkꓽStringWithRefs()` handles the `⎨⎨key|filter1|filter2⎬⎬` filter syntax by doing
  `console.log("TODO review & reimplement filters", $filters)` and then reducing over `$filters` with a no-op (the real
  body is commented out, lines 464-476) — so filters are parsed but silently discarded at runtime with only a
  console.log, no error, no application of the filter. A caller passing `⎨⎨name|Capitalize⎬⎬` today gets unfiltered
  output with a stray console line, which could easily go unnoticed in production. The corresponding `WalkerCallbacks`
  filter/class/type hook interfaces (`onꓽfilter`, `onꓽfilterꘌCapitalize`, `onꓽclassⵧbefore`, `onꓽtype`, etc.) are
  entirely commented out (lines 102-165, 193-214) — a large surface area of designed-but-abandoned/deferred API.

- **G3-P8-04 (Minor — placeholder-recovery path logs via `console.error` unconditionally, dead `if (true)`)**: In
  `walk.ts` (~line 447),
  `if (true) { console.error("shouldꓽrecover_from_unknown_sub_nodes FAILURE"); console.error($node, {...}) }` runs on
  every unresolved-ref failure right before throwing — the `if (true)` is vestigial (likely leftover from a removed
  condition, e.g. a verbose/debug flag) and the two `console.error` calls fire on every throw path even when the caller
  catches and handles the error gracefully, which is noisy for a purely expected/recoverable error condition (contrast
  with the library's own `assert` package, which already prints similar diagnostics before throwing).

- **G3-P8-05 (Nit — dead/incomplete test scaffolding)**: `walk.tests.ts` has three empty pending test stubs with no
  callback: `describe("callbacks -- types")` → `it("should work -- catch all")` / `it("should work -- specify")`, and
  identical pairs under `"callbacks -- filters"` and `"callbacks -- classes"` (6 pending tests total, matching the "6
  pending" in the `npm run test` output). These map directly to the commented-out hook interfaces noted in G3-P8-03 —
  the type/filter/class hook system was seemingly scaffolded then deprioritized, with the tests never removed.

- **G3-P8-06 (Nit — large commented-out advanced-rendering block)**: `to-text/index.ts` has an 89-line commented-out
  `if (style === 'advanced' && isꓽlistⵧKV($node)) {...}` block (lines 138-169) referencing an `isꓽlistⵧKV` that doesn't
  exist anywhere in this package, plus a `SPECIAL_LIST_NODE_CONTENT_KEY` constant and `CheckedNode` type that are
  likewise not defined here. This is a draft for a feature (`'advanced'` style, referenced in the commented-out
  `RenderingOptionsⵧToText.style` union at line 15) that was never finished; low risk since it's inert, but worth
  pruning or tracking as a real TODO rather than leaving stale dead code referencing undefined symbols.

- **G3-P8-07 (Nit — commented-out state field)**: `walk.ts`'s `BaseWalkState` interface has a commented-out
  `//$parent_node: Immutable<CheckedNode> | null TODO review useful for context?` (line 59); `BaseHookParams`-adjacent
  code has no other loose ends of this kind. Minor, but consistent with the pattern of speculative fields left as
  comments rather than tracked TODOs.

No OOP/class usage found — `walk.ts`/`common.ts`/`to-text/index.ts` are all pure functions and factory-style callback
objects, consistent with the project's FP style. No security concerns (pure data transformation over a JSON-like tree,
no I/O/eval). package.json version `0.0.1` is consistent with sibling package `40-rich-text-format`'s `0.0.1`;
`module/MANIFEST.json5` is an empty object (`{}`) — sparse, but not contradictory. Test run confirms 32 passing, 6
pending (the stubs in G3-P8-05), 0 failing. No other issues found beyond those listed above.
