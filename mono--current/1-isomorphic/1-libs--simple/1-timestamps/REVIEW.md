# Review: `@monorepo-private/timestamps`

Purpose: a tiny set of pure functions generating string/number timestamps (UTC epoch ms, human-readable
day/minute/second/ms formats, ISO-8601 extended/simplified variants), all optionally taking an injectable `Date` for
testability.

## Findings

- **[Nit] G2-P10-01** — `package.json` declares `@monorepo-private/assert` as a real (non-dev) dependency, but it is
  never imported anywhere in `module/src/index.ts` (confirmed via grep — zero matches). Same unused-dependency pattern
  seen in sibling packages (`random`, `set-deep-property`); likely from a shared template.

- **[Nit] G2-P10-02** — `module/src/index.ts:88-98` has a sizeable commented-out `getꓽspace_timestamp_ms` function ("fun
  but unclear" per the preceding comment) with no tracking TODO/issue reference. Harmless, but dead code that could be
  deleted (git history preserves it) or turned into a tracked idea.

- **[Nit] G2-P10-03** — `sinon` is a devDependency and, unlike the `random`/`normalize-string` packages, it actually
  _is_ used here (`index.tests.ts` uses `sinon.useFakeTimers()` to verify the injectable-`Date` default still cooperates
  with global time mocking) — so no dead-dependency finding for sinon in this package, noted for contrast with siblings.

No `~~tosort` folder present in this package.

The implementation is straightforward, correct, and consistent: every exported generator takes an optional
`now: Readonly<Date>` defaulting to `new Date()`, so behavior is injectable/testable, and each higher-granularity
human-readable formatter is built by composing the coarser one (`‿minutes` calls `‿days`, `‿seconds` calls `‿minutes`,
`‿ms` calls `‿seconds`) rather than duplicating date-formatting logic — a good example of the project's "single source
of truth" guidance. All 8 exported functions have matching test cases (length/type assertions plus a fixed-time
round-trip via `TEST_TIMESTAMP_MS` and a sinon fake-clock check). README code sample matches the actual exports exactly.
No OOP/class usage — pure functions only. Tests use the legacy mocha+chai stack, consistent with "existing tests are
fine" guidance — no new tests were added here to migrate. `vitest` is a declared devDependency but unused, same as other
packages reviewed so far.

No other issues found — this is a small, well-executed, low-risk package.
