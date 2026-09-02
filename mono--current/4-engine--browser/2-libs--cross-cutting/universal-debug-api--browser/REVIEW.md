# Review — @monorepo-private/universal-debug-api--browser

Browser implementation of Offirmo's Universal Debug API: installs a singleton `_debug.v1` on `globalThis`, providing
per-name loggers, localStorage-backed override hooks, and internal-value exposure for debugging.

Note: this package contains a `module/~~demo` folder (`index.html`, `index.js`) — like `react--error-boundary`'s
`~~demo`, this is vendored/demo content and NOT literally named `~~tosort`, but is treated the same way (out of scope
for deep review) and called out here for transparency.

## Findings

- **G5-P15-01** (Minor) — `package.json` declares `@monorepo-private/assert` as a dependency, but it's never imported
  anywhere in the package (confirmed via grep across `module/src/`) — dead dependency.
- **G5-P15-02** (Minor) — `module/src/v1/index.ts:35,171`: `addDebugCommand()` populates a `debugCommands` map, but
  nothing in the package ever reads or invokes it — the map is write-only, so registered commands are inert. The
  author's own `// TODO check` comment at line 35 suggests this half-built feature is already known to be incomplete.
- **G5-P15-03** (Nit) — `module/CHANGELOG.md`: explicit `TODO unit tests!` under `[Unreleased]`, and indeed no test
  files exist anywhere in the package (confirmed via `find`) — self-acknowledged gap, not a new discovery, but worth
  reiterating given the non-trivial override/logger-caching logic in `v1/index.ts`.
- **G5-P15-04** (Nit) — Scattered unresolved TODOs indicating known rough edges: `module/src/index.ts:13`
  (`// TODO extract this common code!` — duplication vs. the node implementation), `module/src/v1/index.ts:41-42`
  (`// TODO override?`, `// TODO allow off?` on the own-logger setup), `module/src/v1/index.ts:87-88`
  (`// TODO only complain once`, `// TODO seen crash, to check again` inside `_getOverride`'s catch block — hints at a
  previously-seen crash that wasn't fully root-caused), `module/src/v1/index.ts:155` (`// TODO switch to / ?` on
  `exposeInternal`'s path separator).
- **G5-P15-05** (Nit) — `module/src/index.ts:15-58`: the multi-instance-reconciliation IIFE (handling placeholder vs.
  real implementation, version comparison) is intricate defensive logic with no test coverage; combined with G5-P15-03,
  this is the part of the package that would most benefit from vitest coverage given its edge-case branching
  (placeholder detection, min-version comparison, duplicate-module detection).

No other issues found — no OOP/class usage (plain functions and closures throughout, consistent with the monorepo's
functional style), package.json's other dependencies match actual imports, and README usage examples (`getLogger`,
`overrideHook`) match the real exports.
