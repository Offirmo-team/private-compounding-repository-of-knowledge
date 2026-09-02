# Review — @monorepo-private/rich-text-format--to-react

Renders Offirmo's RichText document format to React elements, walking the document tree via the shared
`rich-text-format--to-textual` walker and mapping node types to HTML tags/classes.

Note: this package contains a `module/~~tosort/demo/*` and `module/~~tosort/interactive-fragment.jsx` — legacy demo
code, not reviewed here.

## Findings

- **G5-P13-01** (Major) — `module/src/render--to-react.tsx:213`: a literal `debugger` statement inside
  `_getꓽHTMLElementType`, immediately followed by `throw new Error("NIMP")`, in the fallback branch reached whenever a
  node type starting with `_` isn't `_h`. This is production code (not gated behind any dev/debug flag) — any real
  caller hitting this branch would trip the debugger statement before throwing, which will hang execution if devtools
  happen to be open. Should be removed.
- **G5-P13-02** (Minor) — `module/src/render--to-react.tsx:6`: imports `assert_from` from `@monorepo-private/assert` but
  never calls it (only `assert` is used) — unused import.
- **G5-P13-03** (Minor) — `module/src/render--to-react.tsx:7`: imports `normalizeꓽurl` from
  `@monorepo-private/normalize-string` but it's never called anywhere in the file — unused import. `capitalizeⵧfirst` is
  imported but only referenced inside the commented-out `onꓽfilterꘌCapitalize` callback (lines 362-373), i.e. also
  effectively dead in the currently-active code path.
- **G5-P13-04** (Nit) — Lines 361-381: a whole callback (`onꓽfilterꘌCapitalize`) is commented out along with its
  registration in `callbacksⵧto_react` — sizeable dead code block rather than a one-line TODO; if it's a planned future
  feature, consider tracking it as a real TODO instead of commented-out source.
- **G5-P13-05** (Nit) — `module/src/index.tsx:9-15` (`RichText` component) silently swallows any rendering error and
  renders a red `<span>` with the error message directly in the DOM (`error?.message || "Error"`). Reasonable as a
  fallback UI, but note the error is not otherwise reported (no logger/SXC call), so a render failure here would be easy
  to miss outside of the visual red text — for a package this central to the UI layer, wiring this into the same logging
  path used by `react--error-boundary` would give better observability.

No other issues found — package.json dependencies match actual imports, no OOP/class usage, and no test files exist for
a package with genuinely complex tree-walking/keying logic (`_getꓽaggregated_keyed_children`, `_generateꓽown_react_key`)
that would benefit from vitest coverage given its correctness-sensitive re-key logic for lists/duplicate children.
