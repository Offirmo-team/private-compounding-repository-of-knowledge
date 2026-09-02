# Review — @monorepo-private/storypad

A framework/bundler-agnostic Storybook replacement: bootstraps by loading a glob of CSF (Component Story Format) story
files, builds an in-memory + URL-synced flux state, and renders a manager UI / story preview.

Note: this package contains a `module/~~gen` folder (inspiration screenshots/assets) and a
`module/src/l3-compat/@storybook/~~hello-world` folder (Storybook demo files copied 2024/04) — not reviewed here per the
tosort/generated-content exclusion rule.

## Findings

- **G5-P7-01** (Major) — `module/src/l2-view/l4-bootstrap/index.ts:39-115` (`startꓽstorypad`): every `init_fn()` failure
  inside the services-init loop, and every failure of `flux.init(...)` / `render(flux)`, is caught and only
  `console.error(err)`'d — execution continues silently past broken initialization (e.g. logger/SXC/error-handling setup
  failing) with the app left in a partially-initialized state. For a "devtools" tool this is arguably
  acceptable/deliberate (`init_fn` fallible-by-design comment absent though), but worth confirming this
  swallow-and-continue behavior is intentional rather than a silent-failure trap, since a broken logger or flux init
  would otherwise be very hard to notice.
- **G5-P7-02** (Minor) — `module/src/l2-view/l0-services/init/10-errors.ts`: the fallback `on_error()` (used when
  `soft-execution-context--browser` isn't "resurrected") is defined but its inner comment says "this code must be super
  extra safe!!! don't even use the advanced logger!" yet it still relies on `console.group`/`console.groupEnd`, which is
  fine, but the recursive-crash fallback path (`catch (err2)`) logs via `console.log` with a shouty message ("FIX
  THIS!!!") — functional, but the whole flow's defensive posture stands out as fragile/hand-wavy scaffolding rather than
  a hardened invariant.
- **G5-P7-03** (Minor) — `module/src/l1-flux/l1-state/state--in-mem/reducers.ts:88-91` (`folderⵧexpand`): unimplemented
  — `console.warn("TODO folderⵧexpand")` and returns state unchanged. Similarly `addꓽannotation` (line 80-84) just logs
  `TODO annotations!` and returns state unchanged — both are exported and presumably called from UI, so calling them
  currently has no effect at all.
- **G5-P7-04** (Minor) — `module/src/l1-flux/l2-observable/index.ts:26`: `ObservableState` constructor takes a
  `private window: Window = self` but this field is never read anywhere in the class (confirmed via grep — no
  `this.window` usage). Dead constructor parameter/field.
- **G5-P7-05** (Minor) — Package-wide: `assert, assert_from` from `@monorepo-private/assert` are imported in
  `module/src/l1-flux/l1-state/state--url/reducers.ts`, `state--url/selectors.ts`,
  `l2-view/l1-components/manager/index.ts`, `story-area/drawer/index.ts`, `story-area/index.ts`,
  `state--in-mem/selectors.ts`, `l1-flux/l2-observable/index.ts`, and `l2-view/l0-services/init/99-tosort.ts`, but
  `assert_from` specifically is never called in any of these files (only bare `assert(...)` is used where used at all,
  and in several files neither is used) — widespread unused import of `assert_from` across the module. Similarly
  `Immutable` is imported but unused in a few of the same files (e.g. `l2-view/l0-services/init/99-tosort.ts`,
  `state--url/reducers.ts` doesn't import it but check similar files).
- **G5-P7-06** (Nit) — `module/src/l2-view/l0-services/init/99-tosort.ts`: the whole file is gated behind
  `if (false) { ... }`, permanently dead code (a demo of log levels). The filename itself (`99-tosort`) flags it as
  known cruft, consistent with the monorepo's `~~tosort` convention but not actually inside a `~~tosort` folder so it
  wasn't auto-excluded — worth actually moving it or deleting it.
- **G5-P7-07** (Nit) — `module/src/l2-view/l0-services/init/00-logger.ts:9` and `01-sec.ts:11` and `10-errors.ts`:
  comment `// x@ts-expect-error during monorepo resurrection...` — the leading `x` looks like it was prepended to
  deliberately disable a real `@ts-expect-error` directive (turning it into a plain comment). If the dynamic `import()`
  of a possibly-missing package no longer needs type suppression, the comment is stale; if it does, the directive is
  currently inert.
- **G5-P7-08** (Nit) — `module/src/l2-view/l4-bootstrap/render-root.ts:22-25`: comment says "to avoid triggering
  css--utils--diagnostics" and sets `lang="en"` + appends a `<meta charset="utf-8">` — reasonable, but note this
  hardcodes `en` unconditionally on every render even when the manager UI itself might run in another locale; low risk
  given this is a dev tool.
- **G5-P7-09** (Nit) — `class ObservableState` (`l1-flux/l2-observable/index.ts`) is the one real class/OOP usage in
  this batch outside of React — flagging per the review instructions, though a mutable class instance for flux state is
  a defensible pragmatic choice for an event-driven observable and not obviously mis-designed (getter methods are pure
  reads, mutations go through the same `InMemState.*`/`UrlState.*` reducer functions used elsewhere).

## Notes (not findings)

- Legacy mocha+chai unit tests exist (`l0-types/l1-csf/v2/index.tests.ts`, `v3/index.tests.ts`) — consistent with the
  "existing code, fine as-is" migration policy; no new tests use vitest yet but none of the recently-touched logic
  (reducers, observable state, URL serialization) has any test coverage at all, which is a gap for a package this
  central and stateful.
- TODOs are numerous throughout (`folderⵧexpand`, `addꓽannotation`, `isꓽexpandedⵧinitially` viewport logic, "on demand"
  story loading) — expected for a package explicitly described as a from-scratch Storybook alternative still under
  active development; not flagged individually as bugs.

No other structural issues found — package.json dependencies broadly match actual imports, and the layered `l0-types` /
`l1-flux` / `l2-view` / `l3-compat` architecture is coherent and consistently followed.
