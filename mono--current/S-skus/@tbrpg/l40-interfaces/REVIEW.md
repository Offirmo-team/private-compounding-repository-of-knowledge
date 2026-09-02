# REVIEW — @tbrpg/interfaces

TBRPG action/reducer interface layer: defines the `TBRPGAction` discriminated union and a Redux-style
`reducer()`/`reducer_bulk()`/`createꓽstore()` API wrapping `@tbrpg/state`'s reducer functions for consumption by
UI/persistence layers.

## Findings

- **G11-P17-01** (Info) — `module/~~tosort/sugar/index.ts` exists. Per review scope, its contents were not reviewed —
  flagging presence only.
- **G11-P17-02** (Minor) — `package.json` lists `@monorepo-private/assert` as a dependency, but it is not imported or
  used anywhere in `module/src/**` (confirmed via grep) — same recurring unused-dependency pattern flagged across nearly
  every sibling `@tbrpg` package reviewed in this batch (`l22`, `l24`, `l25`, `l26`, `l30`-`l34`).
- **G11-P17-03** (Minor) — `l2-reducer/index.ts`'s `reducer()` cannot get TypeScript's discriminated-union narrowing to
  flow from `action.type` into `action` inside each `switch` case, so every single case reassigns to an explicit escape
  hatch, `const action_ts_discrimination_not_working = action as any`, and passes that `any` value to the underlying
  `@tbrpg/state` reducer instead of the narrowed `action`. This is self-documented (the variable name states the
  problem) but it fully defeats type-checking for every action payload passed to `TBRPGState.*` — a typo'd or mismatched
  field on any `Action*` interface in `l1-actions/index.ts` would not be caught by the compiler at this boundary. Worth
  root-causing (likely the `Immutable<TBRPGAction>` wrapper interfering with narrowing, fixable via a type guard or by
  narrowing before wrapping) rather than leaving as a permanent `any` cast on every branch.
- **G11-P17-04** (Nit) — `createꓽstore()`'s `subscribe()`/`_notify_subscribers()` contain leftover debug `console.log`
  calls (`"subscribe()"`, `"subscribe.clean()"`, `"notifying..."`) that fire on every subscribe/unsubscribe/dispatch —
  fine for the `.stories.tsx` demo file, but this is the actual store implementation shipped to consumers.
- **G11-P17-05** (Minor) — `l2-reducer/index.tests.ts` only exercises the generic `ACTION_TYPEꘌNOOP` action through
  `reducer()` (plus store subscribe/unsubscribe behavior). None of the 10 domain-specific `TBRPGAction` variants
  (`play`, `equip_item`, `sell_item`, `rename_avatar`, `switch_class`, `redeem_code`, `re_seed`, `on_start_session`,
  `on_logged_in_refresh`, `acknowledge_engagement_msg_seen`) are ever dispatched through `reducer()` in a test — so the
  entire `switch` body in G11-P17-03, including whether each case wires to the correct `@tbrpg/state` function, is
  untested at this layer (only indirectly covered by `@tbrpg/state`'s own tests on the underlying functions, not on the
  dispatch wiring itself).
- **G11-P17-06** (Nit) — `l1-actions/index.ts`'s `getꓽaction_types()` helper is annotated
  `// needed for some validations` but has no caller anywhere in `module/src/**` — either dead code or consumed by a
  downstream package outside this one; worth confirming which.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout. `createꓽstore()` uses a closure over
`let state`/`Set` rather than a class for its stateful store — consistent with project conventions despite being
inherently stateful. `reducer_bulk()` is a clean one-line `reduce()` fold.

## Tests

Uses legacy mocha + chai (expected/fine for existing code, `test` script excludes `~~*` folders) with `vitest` listed as
a devDependency for the eventual migration, consistent with sibling packages. Coverage is thin relative to the package's
role as the main dispatch surface: only the noop path and store subscription mechanics are tested (G11-P17-05).
