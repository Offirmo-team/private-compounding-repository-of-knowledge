# REVIEW — @tbrpg/ui--rich-text

Renders TBRPG game state (status, inventory, achievements, adventures, character sheet, etc.) into `RichText.Document`
structures for downstream rendering (terminal/react/textual).

## Findings

- **G11-P18-01** (Critical) — The package's entire test suite fails to run at all. Ten `*.tests.ts` files under
  `module/src/sub-elements/` (`achievements`, `adventure`, `attributes`, `inventory`, `items`, `items--armor`,
  `items--weapon`, `meta`, `monster`, `wallet`) import from `"./sub-elements"` / `"./sub-elements/consts.ts"` instead of
  `"./index.ts"` / `"./consts.ts"` — a self-referential path that doesn't exist (there is no
  `module/src/sub-elements/sub-elements/` directory). Confirmed by running `npm run test`: mocha aborts immediately with
  `ERR_MODULE_NOT_FOUND` on the very first file (`achievements.tests.ts`), and since the script runs with `--bail`, no
  test in this package executes at all. Also confirmed via `tsc --noEmit`, which reports
  `TS2307: Cannot find module './sub-elements'` on all the same files. This looks like a mechanical find-and-replace
  mistake (likely from a directory rename where `./sub-elements` was substituted for what should have stayed `.` or
  `./index.ts`).
- **G11-P18-02** (Major) — `module/src/sub-elements/engagement/recap/index.tests.ts` calls `renderⵧto_text(doc)`
  (line 21) but never imports it (no `import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"`,
  unlike every sibling test file that uses the same helper). Confirmed via `tsc`:
  `TS2304: Cannot find name 'renderⵧto_text'`. This file isn't caught by G11-P18-01 (it doesn't use the broken
  `./sub-elements` import), but would throw a `ReferenceError` at runtime once G11-P18-01 is fixed and this file
  actually executes.
- **G11-P18-03** (Info) — `module/~~tosort/2021/index.ts`, `module/~~tosort/2021/index_spec.ts`, and
  `module/~~tosort/2026/index.stories.tsx` exist. Per review scope, their contents were not reviewed — flagging presence
  only.
- **G11-P18-04** (Minor) — `module/~~sandbox/index.html` also exists (a near-empty scratch HTML file with an empty
  `<script>` tag) — not a `~~tosort` folder so not covered by the mandatory-flag rule, but worth noting as apparent
  scratch/dead content sitting in the shipped module tree.
- **G11-P18-05** (Minor) — `package.json` lists `@monorepo-private/assert` as a dependency, but it is not imported or
  used anywhere in `module/src/**` (confirmed via grep) — same recurring unused-dependency pattern flagged across nearly
  every sibling `@tbrpg` package in this batch.
- **G11-P18-06** (Nit) — `items--armor.ts`'s `push_power()` and `items--weapon.ts`'s `push_power()` (structurally
  identical copy-paste) each have three `else if` branches comparing `power` vs `options.reference_power` for
  "better"/"worse"/"equal", but the third branch's condition is `power < options.reference_power` — an exact duplicate
  of the second ("worse") branch's condition — instead of `power === options.reference_power`. The "equal"
  (`comparison--equal`, `"="`) branch is therefore dead code: it can never execute, since any case where
  `power < reference_power` is already caught by the preceding `else if`.
- **G11-P18-07** (Nit) — `sub-elements/index.ts` re-exports both `items--armor.ts` and `items--weapon.ts`, each of which
  defines an internal helper named `push_quality`/`push_values`/`push_power`/`push_sell_value` — none of these are
  exported (only `render_armor_*`/`render_weapon_*` are), so no name collision occurs, but the near-total structural
  duplication between the two files (same four helper functions, same body shape, differing only in
  `Armor`/`Weapon`/`Damage`-vs-`Reduction` wording) is a strong candidate for extracting a shared generic helper,
  consistent with the project's "extract once reused more than twice" guidance.
- **G11-P18-08** (Nit) — `sub-elements/adventure.ts`'s `renderꓽresolved_adventure()` casts `a.gains` to `any`
  (`const gains: any = a.gains // alias for typing`) and does all subsequent property access through that untyped alias
  — a broad type-safety bypass for the function's core logic, though the trailing "checks" block (lines 134-145) does
  partially compensate by asserting at runtime that every truthy `gains` property was actually handled (throwing
  `"unhandled outcome properties!"` otherwise) — a reasonable defensive fallback for what the type system can't catch
  here.
- **G11-P18-09** (Nit) — `sub-elements/meta.ts` has a large commented-out dead function `render_account_info()` (lines
  53-71, referencing an unresolved `m.uuid`/`m.email` and a `/* TODO rework` block) — dead code left in place rather
  than removed.
- **G11-P18-10** (Nit) — `module/src/index.stories.tsx` (the top-level demo/playground file, not under `sub-elements`)
  contains a `// TODO XXX Claude expects zod, WebMCP some JSON-schema like` comment on `ToolDefinition.inputSchema`, and
  several `console.log` calls in `window.addEventListener` handlers and the `Component()` render body — acceptable for a
  `.stories.tsx` demo file (consistent with how `l40-interfaces`' story file was treated), not flagged as a defect.
- **G11-P18-11** (Nit) — Several `it(...)` test stubs have no callback and are effectively pending/unimplemented:
  `items.tests.ts` ("should render properly" x2). Combined with G11-P18-01, this package's real behavioral test coverage
  is currently zero — every other `.tests.ts` file does have real assertions, but none of them can currently execute.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure rendering functions throughout, consistent with project conventions. Builder-pattern
usage (`RichText.fragmentⵧblock()`, `.pushX().pushY().done()`) is inherently a fluent/mutable-builder style, but this is
dictated by the `@monorepo-private/rich-text-format` API, not an in-package design choice.

## Tests

Uses legacy mocha + chai (expected/fine for existing code) plus `vitest` as a devDependency, consistent with sibling
packages. In practice, **no test in this package currently runs** due to G11-P18-01 — this is the most severe finding of
any `@tbrpg` package reviewed in this batch, since it's not a logic bug but a total loss of test-suite execution
(silently, since CI/local `npm run test` would need to be actually run and its output read to notice — a passing exit
code was not observed, an immediate crash was).
