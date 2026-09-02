# Review: @monorepo-private/soft-execution-context--node

Node-specific glue for `@monorepo-private/soft-execution-context`: wires up `uncaughtException`/`unhandledRejection`
global listeners and decorates the root SXC with detected Node/OS environment details.

Note: this package contains a `module/~~tosort/2025/index.cjs` folder holding unsorted/legacy code slated for removal —
not reviewed here.

## Findings

- **SX-01 (Major)** — `@monorepo-private/soft-execution-context` is imported directly in the real (non-test) source
  entrypoint (`module/src/index.ts:3`, and re-exported wholesale via `export * from ...` at line 66), but `package.json`
  only lists it under `devDependencies` (line 26) and `peerDependencies` (line 39) — not as a regular `dependency`. A
  `peerDependency` means the _consumer_ of this package is expected to provide it, which is a defensible pattern for a
  peer-style plugin, but it's undeclared as a runtime dependency proper, and combined with the `devDependencies` listing
  this reads more like an oversight than an intentional peer-dependency design (nothing in the README or code suggests
  version-compatibility reasons for peer-instead-of-regular, the usual motivation for `peerDependencies`). Same category
  of issue as `load-config`'s LC-01 (a raw-source `.ts` export needing its imports resolvable by any consumer's
  typechecker).
- **SX-02 (Minor)** — `@monorepo-private/assert` is declared as a `dependency` (`package.json:19`) but never imported
  anywhere in `module/src/index.ts` — same recurring stale-dependency pattern as several other packages in this batch
  (FO-02, SC-02, PL-03, RT-04).
- **SX-03 (Minor)** — No tests at all (no `*.tests.ts` files) despite `mocha`/`chai`/`vitest`/`sinon` devDependencies
  present. The commented-out `_force_set_level_of_uda_default_logger` helper (lines 40-62) is explicitly annotated
  `// for unit tests only, for convenience` but is entirely commented out (including its export at line 71) — dead code
  intended for a test suite that doesn't exist. Given this package wires up process-wide global error handlers, tests
  verifying `listenToUncaughtErrors`/`listenToUnhandledRejections` actually invoke `SXC.handleError` on the right events
  would have real value and are currently entirely unverified.
- **SX-04 (Nit)** — `// TODO protect from double install` (line 7) is a legitimate concern left unaddressed: calling
  `listenToUncaughtErrors()` or `listenToUnhandledRejections()` twice (e.g., if a consumer's app is re-initialized, or
  in a test suite that imports the module fresh per test) will register duplicate `process.on(...)` listeners, each
  creating its own child SXC — silently accumulating listeners rather than erroring or being idempotent. Node's default
  `MaxListenersExceededWarning` (10) would eventually surface this in a pathological case, but nothing here prevents or
  warns about the double-registration directly.
- **SX-05 (Nit)** — `demo.ts` has 4 lines of commented-out alternative import paths for an example `app.ts` (lines
  43-46), left over from experimentation — minor cleanup opportunity, consistent with similar leftover-comment patterns
  seen elsewhere in this batch (`ohateoas-browser--terminal` OB-04).

No other issues found. `tsc --noEmit` passes cleanly for this package's own code. No unnecessary OOP/class usage;
function-first style throughout. No command-injection/shell concerns (no subprocess spawning; this package only
registers process-level event listeners and reads `os`/`process` info).
