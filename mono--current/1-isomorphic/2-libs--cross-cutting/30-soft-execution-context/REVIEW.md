# Code Review — `@monorepo-private/soft-execution-context`

Experimental, isomorphic "soft execution context" (SXC) providing a graph of hierarchical contexts for dependency
injection, error decoration/handling, logical-stack tracking, and analytics — inspired by zone.js / node domains /
OpenTelemetry context propagation.

Note: this package contains a `module/##doc/` folder (demo.ts + examples/app.ts, lib--bad.ts, lib--good.ts,
lib--nested.ts) holding documentation/demo code, a `module/~~demo-error-handling-01/` folder, and a
`module/~~tosort/2025/` folder holding unsorted/legacy code — not reviewed here per instructions (their content was only
skimmed for context, not audited for bugs).

## Findings

- **G3-P6-01 (Major — missing/incomplete tests)**: A substantial portion of the test suite is stubbed but not
  implemented. `module/src/specs/auto-injections.tests.ts` contains nothing but a comment
  (`// @see plugin "dependency-injection"`) — no actual test code. `module/src/specs/emitter.tests.ts` has two pending
  tests (`it("should work")`, `it("should be shared across all SXC instances")`) with no callback, so they never run any
  assertions. `module/src/internal/plugins/error-handling/index.tests.ts` has six more pending/unimplemented tests
  covering `xTry()`, `xTryCatch()`, `xPromiseTry()`, `xNewPromise()`, and the `final-error` event (both "should be
  emitted" and "should have all the properties"). This means the core auto-catch/rethrow orchestration — explicitly
  called out in the README as "!! will auto-catch, be careful!!" — has no automated regression coverage, despite being
  the riskiest part of the API.

- **G3-P6-02 (Minor — OOP/prototype pattern, contrary to project FP style)**: The plugin system is built as a shared
  mutable prototype object. `module/src/internal/root-prototype.ts` defines `ROOT_PROTOTYPE = Object.create(null)` and
  each plugin's `augment(prototype)` (in
  `internal/plugins/{analytics,dependency-injection,error-handling,logical-stack}/index.ts`) attaches methods that close
  over `this` (e.g.
  `prototype.injectDependencies = function injectDependencies(deps) { let root_state = this[INTERNAL_PROP]; ... }`).
  `internal/create.ts` then does `const SXC = Object.create(ROOT_PROTOTYPE)`. This is classic JS prototypal OOP —
  functionally equivalent to hand-rolled classes — which runs counter to the repo-wide guidance to avoid OOP/classes in
  favor of plain types + pure functions. It's plausibly justified here for performance (README: "not too slow (lots of
  forks)") and for the fluent/chainable `SXC.foo().bar()` API, but it's worth flagging since it's pervasive across all 4
  plugins and the core `create.ts`/`get-root.ts`.

- **G3-P6-03 (Minor — README documents unimplemented API)**: The README's "Methods" section (lines 85-86) documents
  `SXC.xPromiseCatch(operation, promise)` and `SXC.xPromiseTryCatch(...)` as part of the public API. Neither exists:
  `module/src/types.ts`'s `SoftExecutionContext` interface only exposes `xTry`, `xTryCatch`, and `xPromiseTry` (with a
  comment `// TODO one day xPromiseTryCatch`). The closest draft, `xNewPromise`, is fully commented out. A consumer
  following the README literally would hit `SXC.xPromiseCatch is not a function`.

- **G3-P6-04 (Minor — dead code)**: A commented-out `xNewPromise` implementation sits in
  `module/src/internal/plugins/error-handling/index.ts` (~18 lines, marked `/* TODO clarify ... */`) and its
  corresponding commented-out type is in `module/src/types.ts` (~7 lines). Either finish + test this feature or remove
  the drafts.

- **G3-P6-05 (Nit — timely TODO worth revisiting)**: `module/src/internal/plugins/error-handling/index.ts`
  (`xPromiseTry`, ~line 199) has `// TODO actual Promise.try in 2026` guarding a manual
  `Promise.resolve().then(() => fn(params))` shim, followed by `as any // stupid TS`. Given today's date is 2026-07-31
  and the monorepo already targets Node 22+/ES2024 (per the sibling `21-universal-debug-api--placeholder` changelog),
  native `Promise.try` should now be available — this TODO is actionable and could remove both the shim and the `as any`
  cast.

- **G3-P6-06 (Nit — global singleton fragility)**: `internal/root-prototype.ts` creates one process-wide `Emittery`
  instance (`ROOT_PROTOTYPE.emitter = new EventEmitter()`) eagerly at module-load time, annotated
  `// TODO should be injected instead?`. Combined with the `globalThis.__global_root_sec` singleton in `get-root.ts`,
  test isolation depends entirely on disciplined use of `_TEST_ONLY__reset_root_SXC()` in `beforeEach`/`afterEach` —
  which the existing tests do call, including a documented workaround for a mocha bug (`_mocha_bug_clean_global`,
  referencing https://github.com/mochajs/mocha/issues/4954). Currently managed correctly, but a real footgun if a future
  test forgets the reset.

- **G3-P6-07 (Nit — README reads as personal dev notes)**: The README opens with "Because I desperately need that for
  personal projects," "WORK IN PROGRESS, COMPLETELY EXPERIMENTAL FOR NOW," and dated musings ("2024/04 Turns out it's
  already a thing in telemetry…", "MVP v2 - 2018/05"). Harmless for an explicitly experimental private package, but
  worth tidying if/when this graduates past "completely experimental."

- **G3-P6-08 (Nit — partially-enforced invariant)**: `dependency-injection/index.ts`'s `injectDependencies()` only
  guards against overriding the single reserved key `"SXC"` (`if (key === "SXC") throw ...`), yet the corresponding test
  in `index.tests.ts` is titled "should prevent overrides of **internal injections**" (plural). Nothing stops a caller
  from overriding other semi-internal `BaseInjections` fields (e.g. `SESSION_START_TIME_MS`) that are auto-set by
  `_decorateWithDetectedEnv` in `internal/create.ts` — may be intentional (the DI tests elsewhere do rely on overriding
  `ENV`/`CHANNEL`/etc.), but the test name overstates what's actually enforced.

No security concerns identified. No outdated-dependency concerns beyond what's already noted (deps are pinned via
`catalog:`/`workspace:*`, not independently assessable here). package.json/MANIFEST.json5 versions are consistent
(`0.0.2`).
