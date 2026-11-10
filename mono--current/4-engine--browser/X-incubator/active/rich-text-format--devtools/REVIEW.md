# Review — @monorepo-private/rich-text-format--devtools

React devtools components for visually rendering/debugging `RichText` documents (raw JSON, simplified JSON, and rendered
text/markdown side-by-side), used as Storypad stories.

## Findings

- **G5-P6-01** (Major) — `module/src/to--text/index.stories.tsx:5` imports `RichTextToDebug as Component` instead of
  `RichTextToText` — this story file is an exact duplicate of `to--debug/index.stories.tsx` (confirmed via diff), so the
  "to--text" story actually renders the debug component, not the text renderer it's supposed to demo. Copy-paste bug.
- **G5-P6-02** (Minor) — `module/src/index.tsx`, `module/src/to--debug/index.tsx`, and `module/src/to--text/index.tsx`
  all import `assert, assert_from` from `@monorepo-private/assert` but never call either — dead imports in all three
  files (confirmed 0 call sites via grep). Likely leftover from a template/scaffold.
- **G5-P6-03** (Minor) — Same three files import `Immutable, PositiveInteger` from `@monorepo-private/ts--types`;
  `PositiveInteger` is used (in `to--debug/index.tsx`'s `State` type and `index.tsx` doesn't even use it), but
  `Immutable` is imported and unused in all three files.
- **G5-P6-04** (Minor) — `module/src/to--debug/index.tsx`: the `State` type has a `header_depth: PositiveInteger` field
  that's initialized to `0` but never read or updated anywhere — dead field. Also `state.depth` is read (line computing
  `summary`) but never incremented, so nested headings would never reflect actual depth if this component were ever
  extended to recurse — currently it isn't recursive so this is latent/inert but worth flagging given the unused
  `depth`-tracking scaffolding.
- **G5-P6-05** (Nit) — `module/src/to--debug/index.tsx`: the `<pre>` block literally renders the string `TODO` before
  the JSON dump (`<pre>TODO{JSON.stringify(...)}</pre>`) — looks like an unfinished placeholder left in devtools output.
- **G5-P6-06** (Nit) — `console.log` debug statements (`🔄 <RichTextCombinedRender>`, `🔄 <RichTextToDebug>`,
  `🔄 <RichTextToText>`) are unconditional (no `DEBUG` flag gating, unlike the pattern seen in sibling packages e.g.
  `parcel--plugin--resolver--improved`). Acceptable for a devtools-only package but worth being consistent with the rest
  of the monorepo's debug-logging conventions.
- **G5-P6-07** (Nit) — `module/src/to--text/index.tsx:4` has a commented-out dead import line
  (`//import { x } from '@monorepo-private/rich-text-format--to-textual'`).

No other issues found — package.json dependencies match actual imports (`@monorepo-private/rich-text-format`,
`@monorepo-private/rich-text-format--to-textual`, `@monorepo-private/css--framework`), React components are the expected
exception to the no-OOP rule, and no legacy mocha tests exist to migrate (no test files present at all — reasonable for
a visual devtools/storybook package).
