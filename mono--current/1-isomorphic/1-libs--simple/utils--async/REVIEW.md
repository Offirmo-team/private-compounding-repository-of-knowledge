# Review: @monorepo-private/utils--async

Isomorphic async/scheduling utilities: ponyfills for `nextTick`/`setImmediate`/`requestIdleCallback`, semantic
scheduling helpers (`asap_but_not_synchronous`, `schedule_when_idle_but_not_too_far`, `dezalgo`, …), small `Promise`
helpers (`forArray(...).executeSequentially`, `deriveꓽInspectablePromise`), and simple `awaitable` timers
(`next_microtask`, `end_of_current_event_loop`, `elapsed_time_ms`, `next_idle`, `all_planned_idle_executed`).

Note: this package contains a `module/~~gen/spikes/browser-event-loop.html` folder holding unsorted/legacy
spike/experiment code (per instructions, not reviewed here) — it's a plain HTML/JS scratch file, not part of the
published module surface (excluded from `module/**/*.ts` glob and TS project), so it has no runtime impact, but see
G2-P14-05 below regarding whether it should ship at all.

## Findings

### G2-P14-01 (Minor) — Existing tests are useful but inherently flaky, timing-based, and mocha/chai (pre-existing, not a new-test violation)

All 4 test files (`contract.tests.ts`, `ponyfills.tests.ts`, `promises.tests.ts`, `semantic.tests.ts`) rely on
wall-clock `setTimeout` races (`this.retries(3)`/`this.retries(5)`) to assert event-loop ordering. This is legacy
mocha/chai, which is fine per the project's testing policy (existing tests need not be migrated), but worth flagging
because these tests are inherently non-deterministic on loaded CI machines — that's presumably exactly why `retries` is
used, and is an acceptable, if fragile, trade-off for this kind of "prove our understanding of platform semantics"
contract test.

### G2-P14-02 (Minor) — `all_planned_idle_executed()` safety counter can silently under/over-run

In `awaitable.ts`, `safety` starts at 10 and the loop is `while (--safety && (info?.didTimeout ?? true))`. If real idle
callbacks never report `didTimeout: true` within 10 iterations (plausible under load, since the ponyfill's `didTimeout`
is hardcoded to `false` — see `ponyfills.ts:93`), the function will silently return after only 9 iterations without any
warning, rather than throwing/logging that it gave up. This could mask real bugs in test suites that depend on "all idle
work is flushed" as a precondition. A `console.warn` (or throwing) when `safety` reaches 0 without achieving
`didTimeout` would make this fail loudly instead of silently returning early.

### G2-P14-03 (Minor) — Ponyfill's `didTimeout` is always `false`, contradicting real API semantics and interacting badly with G2-P14-02

`requestIdleCallbackPonyFill` in `ponyfills.ts:91-96` always resolves with `didTimeout: false`, even though the comment
on line 93 acknowledges "this is a shim". Per the real `IdleDeadline` spec, `didTimeout` should be `true` when the
callback is invoked because the timeout elapsed rather than because the browser was actually idle. Since
`all_planned_idle_executed()` (in `awaitable.ts`) uses `didTimeout` as its "we're done" signal, running that helper in a
Node-only environment (where the ponyfill is used) means the loop will always run until `safety` is exhausted (see
G2-P14-02) rather than terminating early/correctly — the two files are tested independently but the assumption linking
them together is unverified by any test.

### G2-P14-04 (Nit) — Confusing local shadowing in `dezalgo`

`function dezalgo(callback: Callback<void>): Callback<void> { return () => asap_but_not_synchronous(callback) }` returns
`Callback<void>`, i.e. `() => void`, but `asap_but_not_synchronous` returns a `Promise<void>`, so the actual returned
function's runtime return value is a dropped Promise, not `void`. TypeScript allows this (a function returning
`Promise<void>` is assignable where `void` is expected), but it means any caller relying on `dezalgo(fn)()` returning a
promise to await completion will silently get `undefined` instead — a subtle "fire and forget" trap for something
explicitly meant to control async timing.

### G2-P14-05 (Nit) — Spike HTML file bundled in the package

`module/~~gen/spikes/browser-event-loop.html` is a manual scratch/demo page (open in browser, check console). It's
correctly excluded from TS compilation via the `~~` prefix, but if `~~gen` isn't excluded from the npm-published files
(not verified here, no explicit `files` field in `package.json`), this could ship inside the npm tarball. Low priority
since the package is `"private": true`.

## Summary

No critical bugs. The library is small, well-commented, functional-style (no OOP), and its riskiest area is the
node-only ponyfill for `requestIdleCallback`/`didTimeout` semantics not lining up with the "wait for idle" helper in
`awaitable.ts` (G2-P14-02/03) — worth a dedicated test if `all_planned_idle_executed()` is actually used anywhere in
Node contexts. Existing mocha/chai tests are fine per project policy; any new tests here should use vitest.
