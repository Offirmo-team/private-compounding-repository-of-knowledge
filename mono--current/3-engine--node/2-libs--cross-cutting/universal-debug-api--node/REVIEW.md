# Review: @monorepo-private/universal-debug-api--node

Node implementation of Offirmo's isomorphic "Universal Debug API" (UDA) — a global `_debug.v1` singleton exposing
per-name loggers and ENV-var-driven override hooks, with multi-install detection/version-mismatch warnings.

## Findings

- **UD-01 (Minor)** — `@monorepo-private/assert` is declared as a `dependency` (`package.json:19`) but never imported in
  `module/src/index.ts` or `module/src/v1/*.ts` — same recurring stale-dependency pattern flagged repeatedly elsewhere
  in this batch (FO-02, SC-02, PL-03, RT-04, SX-02).
- **UD-02 (Minor)** — The global-singleton installation logic in `module/src/index.ts:15-59` is genuinely tricky
  (detecting an existing placeholder vs. a real prior install vs. a version mismatch, and deliberately refusing to
  replace a real existing instance even from a "more recent" candidate) and is exactly the kind of logic that's easy to
  silently regress — yet there are zero tests for this package (no `*.tests.ts` files despite `mocha`/`vitest`
  devDependencies present). A few tests simulating "no prior install", "placeholder present", "two installs at different
  versions" would directly protect this fragile bootstrap sequence, and would also exercise `overrideHook`'s
  "auto-typed" env-var parsing (numbers vs JSON vs raw string, `v1/index.ts:79-90`) which likewise has no coverage.
- **UD-03 (Nit)** — `// TODO extract this common code!` (`module/src/index.ts:13`) flags that the install/dedup logic is
  meant to be shared (presumably with a browser-side `universal-debug-api--browser` equivalent) but hasn't been factored
  out yet — legitimate forward-looking TODO, worth linking to a tracking issue if one exists.
- **UD-04 (Nit)** — Several inline `// TODO` markers are left without further context: `v1/index.ts:32` (`debugCommands`
  "TODO check"), `v1/index.ts:38-39` ("TODO override?" / "TODO allow off?" for `_ownLogger`), `v1/index.ts:125` ("TODO
  check!" on a comment claiming an error "should never happen"), `v1/index.ts:158` ("TODO switch to / ?" for
  `exposeInternal`'s path separator), `v1/index.ts:171`/`173` ("TODO" and "TODO try catch" on `addDebugCommand`, which
  is inconsistent since the function's body is _not_ wrapped in try/catch despite `exposeInternal` right above it being
  defensively wrapped). None of these are bugs by themselves, but `addDebugCommand`'s missing try/catch is a minor
  inconsistency worth calling out: `exposeInternal` catches errors around its path-traversal logic (line 165-167)
  specifically so that a bad call doesn't crash the caller, but `addDebugCommand`'s equivalent operation
  (`debugCommands[commandName] = callback`, line 174) has no such guard despite the adjacent "TODO try catch" comment
  acknowledging the gap.
- **UD-05 (Nit)** — Both `exposeInternal` and `addDebugCommand` self-log a
  `_ownLogger.warn(...): alpha, not documented!` on every call (`v1/index.ts:156`, `172`) — functional but means any
  code path exercising these "alpha" APIs is noisy by design; reasonable as a deliberate signal during this API's alpha
  period, not a bug.

No other issues found. `tsc --noEmit` passes cleanly. README is clear, accurate, and specifically explains _why_
`overrideHook()` exists over directly reading `process.env` (isomorphism with a browser implementation) — a good example
of documentation earning its place. No unnecessary OOP/class usage; function-first/closure-based style throughout
(`create()` returning a plain object, no classes). No command-injection/shell concerns — this package only reads
`process.env` values and `JSON.parse`s them as data (not executed as code), which is a safe use of dynamic input; unlike
`read-write-any-structured-file`'s self-documented "default-export" code-injection risk (RW-06), nothing here evaluates
env-var content as code.
