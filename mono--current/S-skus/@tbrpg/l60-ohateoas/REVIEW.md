# REVIEW — @tbrpg/l60-ohateoas

HATEOAS-style server for TBRPG: `createꓽserver()` returns a `{ ↆget, dispatch }` pair that builds `RichText.Document`
responses (with hints for links/actions/engagements) from the underlying `@tbrpg/state` store, and applies dispatched
actions to it.

## Findings

- **G11-P19-01** (Critical) — `module/src/server.ts:139` contains a bare `xxx` identifier immediately followed by an
  object-literal statement, inside the `/session/adventures/` route handler's `is_inventory_full` branch:
  ```ts
  if (TBRPGState.is_inventory_full(state.u_state)) {
    xxx
    {
      msg_main: 'Your inventory is full! You can’t play until you make some space.',
      choices: [ { ..., callback: () => game_instance.view.set_state(...) } ],
    }
  }
  ```
  This is not valid TypeScript. Confirmed by running `npm run test`: the file fails to even parse, aborting the whole
  suite before any test runs (`SyntaxError [ERR_INVALID_TYPESCRIPT_SYNTAX]: Expected ';', '}' or <eof>` at this exact
  line). The block also references an undefined `game_instance` (never imported or declared in this file) and is
  dead/commented-out sibling code above it (lines 120-136) suggests this was mid-refactor, unfinished, work-in-progress
  code accidentally left uncommented. As it stands, this single line makes the entire package unparseable/unbuildable —
  no test, and no runtime usage of `createꓽserver()`, can work at all.
- **G11-P19-02** (Critical) — `server.ts:16` imports `createꓽall_store_fns` from `@tbrpg/interfaces` and calls it at
  `server.ts:48` (`const all_store_fns = createꓽall_store_fns()`), but `@tbrpg/interfaces` exports no such function —
  its only exports are `init`, `reducer`, `reducer_bulk`, and `createꓽstore` (confirmed via grep across
  `@tbrpg/interfaces`'s source). Once G11-P19-01's syntax error is fixed, every call to `createꓽserver()` — including
  all 4 tests in `server.tests.ts` and the `server.stories.tsx` demo — will throw immediately with
  `TypeError: createꓽall_store_fns is not a function`. This looks like it should be `createꓽstore` (or a wrapper built
  on top of it), not a same-named-but-nonexistent function.
- **G11-P19-03** (Minor) — `package.json` lists `@monorepo-private/assert` as a dependency, but it is not imported or
  used anywhere in `module/src/**` (confirmed via grep, zero matches) — same recurring unused-dependency pattern flagged
  across nearly every sibling `@tbrpg` package in this batch.
- **G11-P19-04** (Nit) — `server.ts:18-19` imports `@tbrpg/state` twice: once as a namespace
  (`import * as TBRPGState from "@tbrpg/state"`) and once as a redundant named import
  (`import {will_next_play_be_good_at} from "@tbrpg/state"`). The named import is never used directly — the only call
  site (`server.ts:228`) goes through the namespace as `TBRPGState.will_next_play_be_good_at(...)`, making the second
  import line dead. Both of these two lines also have stray trailing semicolons, inconsistent with the semicolon-free
  style used everywhere else in the file.
- **G11-P19-05** (Nit) — `/session/adventures/last` (server.ts:180-186) unconditionally
  `throw new Error('Not implemented!')` before the case even reaches its `links[...] = ...`/`break` lines (which are
  consequently unreachable dead code). Similarly, `dispatch()`'s `case ActionType['play']` (server.ts:230-232) throws
  `Not implemented!` whenever `will_next_play_be_good_at` returns false, gated behind an explicit `// interrupt`
  comment. Both look like intentionally-deferred, not-yet-implemented paths rather than bugs, but they mean the "bad
  outcome" flow of the core `play` action is currently guaranteed to crash rather than degrade gracefully.
- **G11-P19-06** (Nit) — `dispatch()`'s pre-check for `ActionType['play']` (server.ts:220-226, checking
  `is_inventory_full` before dispatching) duplicates logic already present in `ↆget()`'s `/session/adventures/` route
  handler (the now-broken block at G11-P19-01) — worth consolidating into one shared guard once G11-P19-01/02 are fixed,
  rather than maintaining the same "is inventory full" check in two places.

## Style / functional-programming compliance

No unnecessary classes/OOP. `createꓽserver()` follows the same closure-over-local-state pattern as `l40-interfaces`'s
`createꓽstore()`. Response building uses the `RichText` fluent builder API (dictated by that package, not an in-package
design choice).

## Tests

No `~~tosort` folder is present in this package. Uses legacy mocha + chai (`server.tests.ts`, 4 tests) plus `vitest` as
a devDependency, consistent with sibling packages. In practice, **the package cannot currently compile or run at all**
due to G11-P19-01 — this is more severe than even `l50-ui--rich-text`'s test-suite failure (G11-P18-01), since that
package's non-test source was valid TypeScript; here the shipped `server.ts` itself does not parse. All 4 tests in
`server.tests.ts` call `createꓽserver()` and would fail immediately even if the syntax error were fixed, due to
G11-P19-02.
