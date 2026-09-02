# Review: `json-stable-stringify`

Private TypeScript fork of `substack/json-stable-stringify`, split into composable steps (`sort_before_stringify`,
`trim_before_stringify`, `json_stable_stringify`) for producing deterministic JSON output (sorted keys) plus optional
dead-leaf trimming.

## Findings

- **G2-P2-01** (Major) — In `sort_before_stringify`'s inner `_sort`, the cycle-detection re-checks after `toJSON()`, the
  `replacer`, and `valueOf()` all test `encountered_nodes.has(input)` — the _original_, unmutated `input` variable —
  instead of `encountered_nodes.has(node)` (the freshly transformed value). Since `input` is captured once at function
  entry and the very first check (`if (encountered_nodes.has(input)) {...}` at the top) already guarantees this is
  `false` by the time execution reaches the later checks, all three subsequent checks are dead/no-op code that can never
  trigger. If a custom `toJSON()`, the user-supplied `replacer`, or `valueOf()` returns a reference to an
  already-visited ancestor node (a "new" cycle introduced by the transform, not present in the original structure), it
  will NOT be detected, and traversal can recurse into it — the ancestor is walked using the same
  `new_encountered_nodes` set (which only ever gets `input` added, never the transformed node), so a genuinely cyclic
  result from `replacer`/`toJSON` can cause unbounded recursion / stack overflow instead of respecting `onꓽcycle`.
  Contrast with the sibling `trim_before_stringify`'s `_on_new_node_value` helper (`module/src/trim/index.ts`), which
  correctly re-checks `encountered_nodes.has(node)` against the _transformed_ value at each step — the `sort` version
  looks like a copy/refactor of that pattern where `node` was mistakenly left as `input` in the `.has(...)` calls.
  `module/src/sort/index.ts:28,42,55,71` (compare correct pattern at `module/src/trim/index.ts:30,42,50` — note trim
  passes the just-computed value in as the `node` param on each call)

- **G2-P2-02** (Minor) — `module/src/__fixtures/index.ts` exports a large `X` fixture object that is never imported
  anywhere in the package (`grep` for `__fixtures` finds no consumers). It appears to be the start of an abandoned
  refactor to deduplicate the near-identical inline test data that's currently copy-pasted three times across
  `sort/index.tests.ts`, `trim/index.tests.ts`, and `stable-stringify/index--base.tests.ts`. Either finish wiring the
  fixture into the tests (removing ~150 lines of triplicated inline data) or delete the unused file.
  `module/src/__fixtures/index.ts`

- **G2-P2-03** (Minor) — `sort/index.ts` and `trim/index.ts` both hand-roll the same "cycle / non-JSON dispatch"
  `switch (options.onꓽcycle) { case "replace": ...; case "throw": ...; default: assertⵧnever_reached() }" pattern, repeated 4 times in `sort/index.ts`alone and 2 times in`trim/index.ts`(6 total), byte-for-byte identical each time. Per project convention ("once a similar chunk of code is reused more than two times, extract it"), this is a strong candidate for a small shared helper, e.g.`resolve_cycle(options.onꓽcycle)`. `module/src/sort/index.ts:28-37,42-51,55-64,71-80`; `module/src/trim/index.ts:30-39`

- **G2-P2-04** (Minor) — `trim/index.ts` contains a ~50-line commented-out block (an old, now-superseded implementation
  of the array/object entries logic) left in the source rather than deleted, plus a duplicated inline copy of the
  `onꓽnonᝍjson` switch inside that dead block. Per project style, prefer deleting rather than commenting out.
  `module/src/trim/index.ts:119-168`

- **G2-P2-05** (Minor) — `sinon`/`@types/sinon` devDependencies are declared but unused anywhere in `module/`.
  `package.json`

- **G2-P2-06** (Nit) — `module/notes.md` contains a large block of garbled, unrelated, seemingly copy-pasted code (a
  PII-redaction `stringifySafe`/`shouldSanitizeKey` implementation with mangled markdown-escaped formatting, e.g.
  `\*\*`, unclosed comments) that has nothing to do with this package's actual sort/trim/stringify functionality. Looks
  like accidental paste-over of another snippet while jotting notes; worth cleaning up since it's confusing noise for
  future readers of the package's own design notes. `module/notes.md:20-71`

- **G2-P2-07** (Nit) — Two `describe.skip(...)` blocks (covering `Set`/`Map`/`Date`/boxed-primitive/class/function edge
  cases) and a couple of standalone `it.skip(...)` cases are left skipped with no tracking issue/TODO reference
  explaining why or what's blocking them. `module/src/sort/index.tests.ts:195`,
  `module/src/trim/index.tests.ts:140,190,200`, `module/src/stable-stringify/index--base.tests.ts:190`,
  `module/src/stable-stringify/index--sort.tests.ts:58,101`

## Notes

- Legacy mocha + chai tests throughout (`describe`/`it`/`chai.expect`) — consistent with the package's era, no action
  needed per migration guidance (new tests only should use vitest).
- No `~~tosort` folder present in this package.
- No security concerns found beyond the cycle-detection correctness issue above (G2-P2-01), which is a
  robustness/DoS-adjacent concern (potential stack overflow) rather than a data-exposure issue.
- Purely functional style throughout (no classes); consistent with project conventions.
