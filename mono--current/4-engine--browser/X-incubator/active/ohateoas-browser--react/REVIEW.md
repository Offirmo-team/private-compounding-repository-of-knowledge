# Review — @monorepo-private/ohateoas-browser--react

React implementation of Offirmo's Hypermedia Architecture (OHA) browser: renders hypermedia documents (links, actions,
engagements) as an interactive frame/viewport, layered `l0-hyper-anchor` → `l1-viewport` → `l2-frame` → `l3-root`.

Note: this package contains a `module/~~tosort/component.tsx` file (unsorted/legacy code) — not reviewed here.

## Findings

- **G5-P10-01** (Minor) — `module/src/l1-viewport/xxconnected.tsx` is never imported anywhere in the package (confirmed
  via grep) — dead file. The `xx` prefix (mirroring the `x@ts-expect-error` disabling pattern seen elsewhere in this
  batch, e.g. storypad) suggests it was intentionally taken out of the build but left in the tree; only
  `l2-frame/connected.tsx` (the "/2" variant one layer up) is actually wired in.
- **G5-P10-02** (Minor) — `module/src/l1-viewport/component.tsx:39`: `console.log(\`${NAME}\`, { $doc, engagements,
  action_blueprints, links })`and line 82's`console.log(\`XXX Engagement\`,
  engagement)`are unconditional, unlike every other component in this package which gates its render-log behind`window.oᐧextra?.flagꓽdebug_render`
  (line 34 does check the flag, but these two extra logs below it don't) — inconsistent debug-logging, and noisy in
  production since this file always executes them on every render regardless of the flag.
- **G5-P10-03** (Minor) — `module/src/l3-root/component.tsx:3`: imports `assert_from` from `@monorepo-private/assert`
  but only `assert` is actually called in the file — unused import.
- **G5-P10-04** (Nit) — `module/src/l1-viewport/component.tsx:134,155`: keys use `String(index)` and
  `action_blueprint.type` respectively, with the author's own inline comments flagging both as fragile
  (`/* XXX bad!!! */`, `/* XXX may not be unique!!! */`) — self-acknowledged tech debt, worth tracking but not a new
  finding beyond what's already flagged in the code.
- **G5-P10-05** (Nit) — `module/src/l2-frame/component.tsx:53-55`: the `"background"` case in the
  `switch (feedback.tracking)` intentionally falls through to `"foreground"` with a comment explaining it's "not
  implemented yet", which is fine, but combined with the `default: throw new Error(...)` a few lines below and several
  other `Not implemented ...!` throws in the same function, this component is still clearly scaffolding/WIP rather than
  production-ready — expected for an early-stage package, just noting the concentration of unimplemented branches here.

No other issues found — package.json dependencies match actual imports, React components are the expected exception to
the no-OOP rule (no classes present), and there are no test files at all in this package (reasonable given its current
WIP/prototype state, though worth adding vitest coverage once the frame/viewport interaction logic stabilizes).
