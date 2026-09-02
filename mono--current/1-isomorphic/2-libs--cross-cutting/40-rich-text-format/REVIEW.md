# Code Review — `@monorepo-private/rich-text-format`

A generic, platform-independent rich text document format (Node/NodeLike tree with
`$type`/`$content`/`$heading`/`$refs`/`$classes`/`$hints`) designed to be rendered isomorphically to plain text, HTML,
Markdown, terminal output, etc., plus normalize/promote/simplify/wrap utilities and a fluent builder ("l2-sugar") for
constructing documents.

Note: this package contains a `module/##docs/tsdiagram.ts` file, a `module/~~gen/` folder (generated
diagrams/screenshots), a `module/~~sandbox/` folder (`01-raw.ts`, `10-builder.ts`, `index.ts`), and a `module/~~tosort/`
folder (`2025/style.css`, `2026/l2-sugar/builder.ts`) — not reviewed here per instructions (their content was only
skimmed for context, not audited for bugs). The `module/src/__examples/` folder is a real (non-excluded) part of the
package and was reviewed in full.

## Findings

- **G3-P7-01 (Major — missing tests)**: `module/src/l1-utils/wrap.ts` has no corresponding test file (`wrap.tests.ts`
  does not exist, confirmed against the full file listing — `normalize.tests.ts`, `misc.tests.ts`, `promote.tests.ts`,
  `simplify.tests.ts` all exist as siblings, but `wrap` does not). `wrap()` has several non-trivial branches (no-op
  passthrough, block-into-inline rejection, fragment type replacement with content-shape coercion, actual wrapping with
  a `Node`/`Array` decision) and is used by the builder (`_create()` in `builder.ts`) to "lift" nodes into the right
  type — exactly the kind of logic that benefits most from unit tests, and currently has zero direct coverage.

- **G3-P7-02 (Major — broken/incomplete public API, no test coverage)**: `module/src/l2-sugar/builder.ts`'s
  `pushSubNodes()` (plural, ~line 239) unconditionally throws when called on a list node:
  `if (isꓽlist($node)) { assert(Array.isArray($node.$content)); throw new Error("TODO REVIEW") }` with the working
  implementation commented out (`//$node.$content.push(...nodes)`). `pushSubNodes` is exported on the `Builder`
  interface and is a public method, yet `builder.tests.ts` never references it (only `addSubs`, `pushSubNode`, `addSub`
  are tested). So a documented builder method is guaranteed to throw for one of its two intended targets (lists), with
  no test asserting this behavior either way.

- **G3-P7-03 (Minor — disabled/incomplete pushKeyValue coverage)**: The entire `pushKeyValue()` describe block in
  `builder.tests.ts` is `describe.skip`, plus a separate
  `it.skip("should work -- from content: multiple nodes (list) -- k/v", ...)` in the "creation" suite. The skipped
  assertions expect output like `"class..foo\nlvl.....42"`, which doesn't match the actual list-rendering format used
  elsewhere in the same file (e.g. `"\n1. 42\n2. foo\n"`), suggesting the k/v-in-list feature's expected behavior has
  drifted from what's implemented and the tests were never updated to match — `pushKeyValue()` itself (non-list usage)
  is exercised nowhere in the active (non-skipped) tests either.

- **G3-P7-04 (Minor — regression test passes for a different reason than its title implies)**: In
  `module/src/l1-types/guards.tests.ts`, the `[BUG#2b] should reject an invalid $type value` test asserts
  `isꓽNode({ $type: "banana", $content: "hello" })` is `false`. I verified by direct invocation that this rejection is
  actually triggered by `assertꓽNodeInvariants()`'s block/inline shape check (`guards.ts:119`) — because `"banana"` is
  not in the known "inline" type list, `getꓽdisplay_type()` defaults it to `"block"`, and a string `$content` then fails
  the "block nodes
  $content must have a block shape" precondition — which fires *before* `assertꓽNode()`'s actual `$type`-enum validation (`guards.ts:155-158`) is ever reached. With array-shaped content (`{
  $type: "banana", $content: ["hello"]
  }`), the enum check does fire and also correctly rejects — but that variant isn't the one under test. So the named "bug" (accepting an invalid `$type`)
  is not actually exercised by this specific regression test; it happens to pass for an unrelated reason. Low severity
  since the guard's real-world behavior is correct either way, but the test's documentation value is weaker than its
  title suggests.

- **G3-P7-05 (Nit — unused import)**: `module/src/l2-sugar/builder.ts` imports `hasꓽemoji` from
  `@monorepo-private/type-detection` (line 4) but it is only referenced inside a commented-out block
  (`//if (hasꓽemoji(content)) {...}`, lines 160-162) in `pushText()`. Dead import.

- **G3-P7-06 (Nit — large block of commented-out dead code)**: `module/src/__examples/index.ts` ends with a ~600-line
  commented-out block (lines 209-803) of old demo constants (`DOC_DEMO_RPG_01`, `DOC_DEMO_INVENTORY`,
  `_SUB_UL_KEY_VALUE_PAIRS`, etc.), some referencing types/functions that no longer match current names (single-quoted
  object keys, `$type: 'heading'` which isn't a valid `NodeType` anymore, `render_item(...)` which doesn't exist in this
  file). Worth deleting or moving to `~~tosort` rather than keeping as a live source file's tail.

- **G3-P7-07 (Nit — minimal README)**: `README.md` is a single import snippet with no explanation of the format, its
  concepts, or the builder API — all of that lives only in `module/notes.md` (design notes) and in code comments.
  Reasonable for a "-private" package, but a newcomer has to read source to learn the API surface
  (l1-types/l1-utils/l2-sugar layering, the `$refs`/`⎨⎨id⎬⎬` reference syntax, block/inline invariant) that the code
  itself clearly considers foundational.

No OOP/class usage found — `builder.ts`'s `Builder` is a closure-based factory (`_createꓽbuilder()` returning a plain
object of functions closing over `$node`), consistent with the project's FP style. No security concerns identified (pure
data transformation, no I/O, no `eval`/dynamic code). package.json (`0.0.1`) is not contradicted by
`module/MANIFEST.json5` (which only declares a description, no version field — not an inconsistency, just less detail
than sibling packages). The mocha `test` script and `tsconfig.json`'s `exclude: ["**/~~*/**/*"]` correctly keep the
ignored sandbox/tosort folders out of both tests and type-checking. Test run confirms 59 passing, 3 pending (the skips
noted in G3-P7-03), 0 failing — no other issues found.
