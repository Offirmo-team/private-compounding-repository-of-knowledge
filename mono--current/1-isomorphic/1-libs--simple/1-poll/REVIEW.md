# Review: `poll`

Small utility that repeatedly calls a predicate on an interval until it returns truthy or a timeout elapses,
resolving/rejecting a `Promise` accordingly.

## Findings

- **G2-P6-01** (Major) — If `predicate()` throws (either on the initial synchronous check at line 17, or on any
  subsequent tick inside the `setInterval` callback at line 27), the error is not handled consistently and, in the
  interval case, is actively dangerous:
  - The **initial** call (`let result = predicate()` at line 17) is unguarded — if it throws, `poll()` throws
    _synchronously_ instead of returning a rejected `Promise`. Callers that do `poll(...).catch(...)` (the documented
    usage pattern in the README) will get an uncaught synchronous exception instead of a catchable rejection —
    inconsistent API contract depending on whether the predicate happens to throw on the first check or a later one.
  - Inside the `setInterval` callback (line 26-32), if `predicate()` throws, the exception happens inside a timer
    callback with no try/catch — it becomes an unhandled exception (crashes the process under Node with default
    settings, or is silently swallowed depending on environment), and critically **neither `waitForElement` nor
    `waitForTimeout` is cleared**, so the interval keeps firing (and, if the predicate throws every time, repeatedly
    raises uncaught exceptions) until the timeout eventually fires and clears the interval — a timer/resource leak in
    the meantime, and a promise that never resolves or rejects if the predicate throws on every call before the timeout
    independently clears it. Suggest wrapping both the initial check and the interval-tick predicate call in try/catch,
    clearing both timers, and rejecting the promise with the caught error. `module/index.ts:17`, `module/index.ts:26-32`

- **G2-P6-02** (Minor) — `poll()` has no explicit return type annotation. The two return paths
  (`Promise.resolve(result)` at line 18, and `new Promise((resolve, reject) => {...})` at line 25 with no generic
  argument) can infer differently — the `new Promise(...)` branch has no type parameter, so `resolve(result)` inside it
  is unannotated and TypeScript will infer a wider/looser type for that branch than the explicit
  `Promise.resolve(result)` early-return branch. Adding `Promise<boolean>` as the function's declared return type
  (and/or `new Promise<boolean>((resolve, reject) => {...})`) would tighten this and make the public contract explicit.
  `module/index.ts:15,25`

- **G2-P6-03** (Minor) — No mechanism to cancel/abort an in-flight poll (e.g. via `AbortSignal`) before it naturally
  resolves or times out. Not necessarily required for this simple utility, but worth a mention since long-running polls
  (up to `timeoutMs`, default 10s) with no way to cancel early is a common source of "polling continues after the caller
  no longer cares" bugs in consuming code (e.g. component unmount). `module/index.ts`

- **G2-P6-04** (Nit) — `@monorepo-private/assert` declared as a runtime dependency but unused; `sinon`/`@types/sinon`
  devDependencies unused. Same pattern as other packages in this group. `package.json`

- **G2-P6-05** (Nit) — Internal variable name `waitForElement` for the `setInterval` handle is a leftover from a
  DOM-polling-oriented origin (e.g. "wait for element to appear") even though the function is now a generic predicate
  poller; a more neutral name (e.g. `intervalHandle`) would better match the generalized API. `module/index.ts:26`

- **G2-P6-06** (Nit) — README usage example is a truncated code fragment (`this.props.user.user_metadata`,
  `this.setState(...)` inside an unclosed `.then()` block, missing closing parens/braces) — reads as copy-pasted from a
  React class-component call site rather than a complete, runnable example. `README.md`

## Notes

- No `~~tosort` folder present in this package.
- Tests use legacy mocha + chai (test file even has a `[Claude code]` prefix in its `describe` title, suggesting these
  were AI-generated) — consistent with the project's testing migration guidance, no action needed since these already
  exist; timing-based tests (`should respect periodMs interval`) are best-effort/tolerance-based and could be flaky
  under CI load, but that's a common, accepted tradeoff for this kind of utility.
- Purely functional implementation, no classes.
